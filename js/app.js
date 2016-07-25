var myApp = angular.module('myApp',['ngRoute']);

//Route Config
myApp.config(['$routeProvider', function($routeProvider){

    $routeProvider.
        when('/home',{
          templateUrl: 'views/home.html',
          controller: 'adminDate'
        }).
        when('/edit',{
          templateUrl: 'views/edit.html',
          controller: 'editDate'
        })
        .otherwise({
          redirectTo: '/home'
        });
}]);

//adminDate Controller
myApp.controller('adminDate', ['$scope', '$http', 'dataService', function($scope, $http, dataService){
    // Set day to Date, date format set when called in app
     $scope.day = new Date();
     var today = $scope.day.getDay();
     $scope.printToday = today;

     //Set Tomorrow Day of Week
     $scope.tomorrow = dayOfWeek[today + 1]

     // Todays Open and Close Time and format into 12hr
     var openTime = dataService.showHrInfo(today).openStore;
     var closingTime = dataService.showHrInfo(today).closeStore;
     $scope.currentOpen = dataService.checkNum(openTime);
     $scope.currentClose = dataService.checkNum(closingTime);

     //Tomorrows open and Close Time and format into 12hr
     var openTimeTom = dataService.showHrInfo(today + 1).openStore;
     var closingTimeTom = dataService.showHrInfo(today + 1).closeStore;
     $scope.tomOpen = dataService.checkNum(openTimeTom);
     $scope.tomClose = dataService.checkNum(closingTimeTom);

     // Show the list of Todays Closings
     var todaysClosings = dataService.getHours();
     for(var i = 0; i < todaysClosings[today].close.length; i++){
         var closed = todaysClosings[today].close[i];
         var open = todaysClosings[today].open[i];
         closed = dataService.checkNum(closed);
         open = dataService.checkNum(open);
         $('.closings').append('<h4>From</h4><h5> ' + closed +' to '+ open + ' for ' + todaysClosings[today].reason[i] +'.</h5>');
     };

     // Used to show weekly hours
     $scope.viewHours = dataService.returnHours();

     // Pass values to update weekly open and close hours
     $scope.updateHours = function(){
         var dayToUpdate = $('#day').val();
         var openNew = $("#open").val();
         var closeNew = $("#close").val();
         dataService.changeHours(dayToUpdate, openNew, closeNew);
     };

     // Set Store hour update select options to current day
     $('#day').val(today);
     $('#open').val(todaysClosings[today].openStore);
     $('#close').val(todaysClosings[today].closeStore);

     // When day changes update open and close to match day
     $('#day').on('change',function(){
         $('#open').val(todaysClosings[$('select').val()].openStore);
         $('#close').val(todaysClosings[$('select').val()].closeStore);
     });
}]);

// editDate Controller
myApp.controller('editDate', ['$scope', '$http', 'dataService', function($scope, $http, dataService){
    // Hey it's today.
    var today = new Date().getDay();

    // Display list of todays closings with option to remove
    $scope.displayToday = dataService.editTodaysClosings();

    // Function to remove closing
    $scope.removeItem = function(key){
        dataService.removeClosing(key);
    };

    // Validates new closing time window and either expands current open/close window or adds new closure 
    $scope.checkClosedHours = function(){
        var newClose = $('#closeSpecial').val();
        var newOpen = $('#openSpecial').val();
        var newReason = $('#closeReason').val();
        var success = dataService.validateClosing(newClose,newOpen,newReason);
        return success;
    }
}]);
