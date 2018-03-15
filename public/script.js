

var app = angular.module('willdo', ["ngRoute"]);

app.config(function ($routeProvider) {
  $routeProvider
    .when("/project", {
      templateUrl: "template/project.html",
      controller: 'project',
      resolve: {
        'check': auth
      }
    })
    .when("/task", {
      templateUrl: "template/task.html",
      controller: 'task',
      resolve: {
        'check': auth
      }
    })
    .when("/command", {
      templateUrl: "template/command.html",
      controller: 'command',
      resolve: {
        'check': auth
      }
    })
    .when("/calendar", {
      templateUrl: "template/calendar.html",
      controller: 'calendar',
      resolve: {
        'check': auth
      }
    })
    .when("/chart", {
      templateUrl: "template/chart.html",
      controller: 'chart',
      resolve: {
        'check': auth
      }
    })
});

app.controller('project', function ($scope, $http) {
  $scope.project = {
    name: 'Swampum',
    tasks: [
      {
        name: 'WEB-46',
        description: 'Change user account details',
        priority: 'High'
      },
      {
        name: 'WEB-53',
        description: 'Confirm changed email address',
        priority: 'High'
      }, {
        name: 'WEB-58',
        description: 'Facebook login proccess',
        priority: 'Medium'
      }, {
        name: 'WEB-52',
        description: 'Reply to user message',
        priority: 'Low'
      }
    ]
  }

  $http.get('https://willdomessenger.herokuapp.com/project')
    .then(response => { 
      console.log(response.data)
    })




  $scope.chosenTask = $scope.project.tasks[0]

  $scope.changeContent = function (task) {
    $scope.chosenTask = task
  }

  $scope.getPriority = function () {
    return "priority " + $scope.chosenTask.priority.toLowerCase()
  }

  $scope.getChosen = function(x){
    if($scope.chosenTask.name == x.name) return 'task selected'
    else return 'task'
  }


})



app.controller('task', function ($scope) {
  console.log('task')
})
app.controller('command', function ($scope) {
  console.log('command')
})
app.controller('chart', function ($scope) {
  console.log('charts')
})
app.controller('calendar', function ($scope) {
  console.log('calendar')
})

