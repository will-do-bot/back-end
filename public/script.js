var app = angular.module('willdo', ["ngRoute", 'ngAnimate']);

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
    .when("/project/:id", {
      templateUrl: "template/projectTasks.html",
      controller: 'projectTasks',
      resolve: {
        'check': auth
      }
    }) 
});

