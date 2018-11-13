const containerHeight = 720;
const containerWidth = 600;
const minutesinDay = 60 * 12;
let collisions = [];
let width = [];
let leftOffSet = [];
let myPos = 0;
let matchedPos = -1;


// Creating an Event
var createEvent = (height, top, left, units, id) => {

    let node=$("<div></div>")
     node.addClass("event");
    if (id == myPos) {
        let span=$("<span class='title'>Me</span>")
        node.append(span);
        node.css({color:matchedPos != -1 ? "green" : "black"});
        node.css({borderLeftColor:(matchedPos != -1) ? "green" : "black"});
    } else {
        let span=$("<span class='title'>Brilliant Lunch</span>")
        node.append(span);
        node.css({color:(matchedPos == id) ? "green" : "blue"});
        node.css({borderLeftColor: (matchedPos == id) ? "green" : "blue"});
    }

    // Customized CSS to position each event
    node.css({width:(containerWidth / units) + "px"});
    node.css({height:height + "px"});
    node.css({top :top + "px"});
    node.css({left:left + "px"});

   $("#events").append(node);
}

/* 
collisions is an array that tells you which events are in each 30 min slot
- each first level of array corresponds to a 30 minute slot on the calendar 
  - [[0 - 30mins], [ 30 - 60mins], ...]
- next level of array tells you which event is present and the horizontal order
  - [0,0,1,2] 
  ==> event 1 is not present, event 2 is not present, event 3 is at order 1, event 4 is at order 2
*/

function getCollisions(events) {

    //resets storage
    collisions = [];
    for (var i = 0; i < 24; i++) {
        var time = [];
        for (var j = 0; j < events.length; j++) {
            time.push(0);
        }
        collisions.push(time);
    }

    events.forEach((event, id) => {
        let end = event.end;
        let start = event.start;
        let order = 1;

        while (start < end) {
            timeIndex = Math.floor(start / 30);

            while (order < events.length) {
                if (collisions[timeIndex].indexOf(order) === -1) {
                    break;
                }
                order++;
            }

            collisions[timeIndex][id] = order;
            start = start + 30;
        }

        collisions[Math.floor((end - 1) / 30)][id] = order;
    });
};

/*
find width and horizontal position

width - number of units to divide container width by
horizontal position - pixel offset from left
*/
function getAttributes(events) {

    //resets storage
    width = [];
    leftOffSet = [];

    for (var i = 0; i < events.length; i++) {
        width.push(0);
        leftOffSet.push(0);
    }

    var maxCount = 0;

    collisions.forEach((period) => {

        // number of events in that period
        let count = period.reduce((a, b) => {
            return b ? a + 1 : a;
        })

        if (count > 1) {
            period.forEach((event, id) => {
                // max number of events it is sharing a time period with determines width
                if (period[id]) {
                    if (count > width[id]) {
                        width[id] = count;
                    }
                    if (count > maxCount) {
                        maxCount = count;
                    }
                }

                if (period[id] && !leftOffSet[id]) {
                    leftOffSet[id] = period[id];
                }
            })
        }
    });
    width.forEach((w, id) => {
        if (width[id] != 0) {
            width[id] = maxCount;
        }
    })
};

var getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
}

var findMatch = (events) => {
    let me = events[myPos];
    //maxconside is an object with key as a index and value as a overlap duartion,we form only if overlap value>=30
    let maxconside = {};
    events.forEach((e, id) => {
        if (id != myPos) {
            if (!(me.start > e.end) && !(me.end < e.start)) {
                if (me.start < e.start && me.end > e.end && e.end - e.start >= 30) {
                    maxconside[id] = e.end - e.start;
                }
                else if (me.start > e.start && me.end > e.end && e.end - me.start >= 30) {
                    maxconside[id] = e.end - me.start;
                }
                else if (me.start < e.start && me.end < e.end && me.end - e.start >= 30) {
                    maxconside[id] = me.end - e.start;
                }
            }
        }
    })
    //max is the value having maximum overlap
    let max = 0
    Object.keys(maxconside).forEach((key) => {
        if (maxconside[key] > max) {
            max = maxconside[key];
        }
    })
    //actualMatchedKeys is an array of index having maximum overlap
    actualMatchedKeys = Object.keys(maxconside).filter(key => maxconside[key] == max);

    //matchedPos is the random key among the maimum overlap
    if (actualMatchedKeys.length > 0) {
        matchedPos = actualMatchedKeys[getRandomInt(actualMatchedKeys.length)]
    }

}

var matchLunchEvent = (events) => {
    var me = events[0];
    //sorted based on start time
    var events = events.sort((a, b) => a.start - b.start);
    //setted myPos for my event
    me = events.find((e, index) => {
        if (e.start == me.start && e.end == me.end) {
            myPos = index;
            return true;
        }
    })


    // clear any existing nodes
    var myNode =$("#events");
    myNode.text('');

    getCollisions(events);
    getAttributes(events);
    findMatch(events);
    
    //console.log(collisions)

    events.forEach((event, id) => {
        let height = (event.end - event.start) / minutesinDay * containerHeight;
        let top = event.start / minutesinDay * containerHeight;
        let units = width[id];
        if (!units) { units = 1 };
        let left = (containerWidth / width[id]) * (leftOffSet[id] - 1) + 10;
        if (!left || left < 0) { left = 10 };
        createEvent(height, top, left, units, id);
    });
}

//const events=[{start:235,end:285},{start:300,end:360},{start:180,end:240}];
//const events = [ {start: 30, end: 150}, {start: 540, end: 600}, {start: 560, end: 620}, {start: 610, end: 670} ];
const events = [{ start: 225, end: 285 }, { start: 210, end: 270 }, { start: 180, end: 240 }, { start: 240, end: 300 }, { start: 300, end: 360 }, { start: 270, end: 330 }];
//const events =[{start:225,end:285},{start:300,end:360},{start:180,end:240}]
matchLunchEvent(events);