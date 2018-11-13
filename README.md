In this Problem we need to display the event in a calender without consding it with Others
For placing any event in the calender, i use Absolute position with top,left and width property.
For placing event I used the jquery library.

------------------For Creating  UI-----------------------

collisions is an array that tells you which events are in each 30 min slot
- each first level of array corresponds to a 30 minute slot on the calendar 
  - [[0 - 30mins], [ 30 - 60mins], ...]
- next level of array tells you which event is present and the horizontal order
  - [0,0,1,2] 
  ==> event 1 is not present, event 2 is not present, event 3 is at order 1, event 4 is at order 2

I mapped time interval to pixel and using this collisions array find different attributes width,top,right position.
 and display in a container.


------------------For Buisness Case----------------------------------

For matching different event, first calculated the overlap time with "me" event.And Filter out other events which is less than 30 min.Then find the maximum overlap time and checked that who are having the max overlap time.And created the random number geneartor function which finds the random event among the maximum overlap time.
And Changed the style from jquery based on buisness requirement




