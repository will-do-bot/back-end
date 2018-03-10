

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

app.controller('project', function ($scope) {
  $scope.project = {
    name: 'Swampum',
    tasks: [
      {
        name: 'Criar Banco',
        description: 'This is a description',
        priority: 'High'
      },
      {
        name: 'Revisar Interface',
        description: 'This is a description',
        priority: 'High'
      }, {
        name: 'Criar Documentacao',
        description: 'This is a description',
        priority: 'Medium'
      }, {
        name: 'Comer Pudim',
        description: 'This is a description',
        priority: 'Low'
      }
    ]
  }

  $scope.chosenTask = {
    name: 'Criar Banco',
    description: 'This is a description',
    priority: 'High'
  }

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

