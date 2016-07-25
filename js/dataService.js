angular.module('myApp').service('dataService', function(){
    var hourInfo=[];
    if(localStorage.getItem('hourInfo') === null){
        data = angular.toJson(hours);
        hourInfo = localStorage.setItem('hourInfo', data);
        hourInfo = angular.fromJson(localStorage.getItem('hourInfo'));
    }
    else{
        hourInfo = angular.fromJson(localStorage.getItem('hourInfo'));
    };

    // Vars to get todays info
    var today = new Date().getDay();
    var todayInfo = angular.fromJson(hourInfo);
    // Check times and format into 12hr time if needed
    this.checkNum = function(n){
        var numOut;
        if(n > 12){
            numOut = (n - 12);
        }
        else{
           numOut = n;
        }
        return numOut;
    };
    // Return hours from hourInfo
    this.getHours = function(){
        var disHours = angular.fromJson(hourInfo);
        return disHours;
    };
    // Get Day specific information
    this.showHrInfo = function(day){
        var retHours;
        retHours = hourInfo[day];
        return retHours;
    };

    //Get weekly hours and adjust from 24hr format to 12 hour format
    this.returnHours = function(){
        // Get Hours Data
        var showHours = angular.fromJson(hourInfo);
        // Set up Empty Array for modified hours
        var hourEdit = [];
        // Cycle through days
        for(i = 0; i < showHours.length; i++){
            // Set vars for day, open, close
            var day = showHours[i].day;
            var open = showHours[i].openStore;
            var closed = showHours[i].closeStore;
            // Check if open/close value is greater than 12, if so subtract 12
            if(open > 12){
                open = open - 12;
            }
            if(closed > 12){
                closed = closed - 12;
            }
            // Set day, open, close into data object
            var data = {"day":day,"open": open,"close": closed};
            // Push data to hourEdit array
            hourEdit.push(data);
        }
        // Return hourEdit array to controller
        return hourEdit;
    };

    // Update weekly Open and Close hours
    this.changeHours = function(i, open, close, $scope){
        hourInfo[i].openStore = open;
        hourInfo[i].closeStore = close;
        var data = angular.toJson(hourInfo);
        localStorage.setItem('hourInfo',data);
        location.reload();

    };

    // Displays todays closings with option to remove
    this.editTodaysClosings = function(){
        var todayClose = [];
        for(i = 0; i < todayInfo[today].open.length; i++){
            // Set vars for day, open, close
            var open = todayInfo[today].open[i];
            var closed = todayInfo[today].close[i];
            var reason = todayInfo[today].reason[i];
            // Check if open/close value is greater than 12, if so subtract 12
            if(open > 12){
                open = open - 12;
            }
            if(closed > 12){
                closed = closed - 12;
            }
            // Set day, open, close into data object
            var data = {
                open : open,
                close : closed,
                reason : reason
            };
            // Push data to hourEdit array
            todayClose.push(data);
        }
        // Return hourEdit array to controller
        return angular.fromJson(todayClose);

    };

    // Function to remove closure
    this.removeClosing = function(key){
        todayInfo[today].open.splice(key, 1);
        todayInfo[today].close.splice(key, 1);
        todayInfo[today].reason.splice(key, 1);
        var data = angular.toJson(todayInfo);
        localStorage.setItem('hourInfo', data);
        location.reload();
    };

    // Validate closing time addition
    this.validateClosing = function(close,open,reason){
        // set var for valid, if valid === 1, then we're good to add a new closure
        var valid;

        // for loop to validate and if needed amend time closures
        for(var i = 0; i < todayInfo[today].open.length; i++){
            // if close is > close[i] and close is < open [i] then...
            if(close > todayInfo[today].close[i] && close < todayInfo[today].open[i]){
                // if the new close time is less than the new open time
                if(close < todayInfo[today].open[i]){
                    // set open[i] to the new open time
                    todayInfo[today].open[i] = open;
                    // amend to reason to close with the new reason
                    todayInfo[today].reason[i] = todayInfo[today].reason[i] + ' and ' + reason;
                    var data = angular.toJson(todayInfo);
                    localStorage.setItem('hourInfo',data);
                    location.reload();
                    break;
                }
            }
            // or if open is > close[i] and open < open[i] then...
            if(open > todayInfo[today].close[i] && open < todayInfo[today].open[i]){
                // if the new open time is greater than close[i]
                if(open > todayInfo[today].close[i]){
                    // then close[i] should be changed to the new close
                    todayInfo[today].close[i] = close;
                    // next amend the reason to reason[i]
                    todayInfo[today].reason[i] = todayInfo[today].reason[i] + ' and ' + reason;
                    var data = angular.toJson(todayInfo);
                    localStorage.setItem('hourInfo',data);
                    location.reload();
                    break;
                }
            }
            // if you get here without conflicts than valid is now 1
            else{
                valid = 1;
            }
        }

        // if valid is 1 than push the new open, close, and reason into storage
        if(valid === 1){
            todayInfo[today].open.push(open);
            todayInfo[today].close.push(close);
            todayInfo[today].reason.push(reason);
            var update = angular.toJson(todayInfo);
            localStorage.setItem('hourInfo', update);
            location.reload();
        }
    }

});
