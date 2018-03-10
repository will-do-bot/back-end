

var app = angular.module('willdo', ["ngRoute"]);

app.config(function($routeProvider) {
    $routeProvider
    .when("/project", {
        templateUrl : "template/project.html",
        controller: 'project',
        resolve: {
            'check': auth
        }
    })
    .when("/task", {
        templateUrl : "template/task.html",
        controller: 'task',
        resolve: {
            'check': auth
        }
    })
    .when("/command", {
        templateUrl : "template/command.html",
        controller: 'command',
        resolve: {
            'check': auth
        }
    })
    .when("/calendar", {
        templateUrl : "template/calendar.html",
        controller: 'calendar',
        resolve: {
            'check': auth
        }
    })
    .when("/chart", {
        templateUrl : "template/chart.html",
        controller: 'chart',
        resolve: {
            'check': auth
        }
    })
});

app.controller('project', function($scope){
    console.log('project')
})
app.controller('task', function($scope){
    console.log('task')
})
app.controller('command', function($scope){
    console.log('command')
})
app.controller('chart', function($scope){
    console.log('charts')
})
app.controller('calendar', function($scope){
    console.log('calendar')
})

