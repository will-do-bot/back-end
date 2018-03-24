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
});

app.controller('project', function ($scope, $http) {
  $scope.projects = [
    {
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
    ],
      priority: 'High'
    },
    {
      name: 'School',
      tasks: [
          {
            name: 'Lab-3',
            description: 'Files exercise',
            priority: 'High'
          },
          {
            name: 'Truth Table',
            description: 'Discrete Maths Work. Ps: HELP',
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
    ],
      priority: 'Medium'
    },
    {
      name: 'Home',
      tasks: [
          {
            name: 'Buy materials',
            description: 'Buy materials for building',
            priority: 'High'
          },
          {
            name: 'Hire a civil engineer',
            description: 'Hire a good civil engineer',
            priority: 'High'
          }
    ],
    priority: 'Low'
    }
  ]
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

  $scope.content = {
    title : "Projects", 
    sideBar :{
      type: "All Projects",
      content : $scope.projects
    }
    
  }

  $http.get('https://willdomessenger.herokuapp.com/project')
    .then(response => { 
      console.log(response.data)
    })




  $scope.chosenProject = $scope.projects[0]

  $scope.changeContent = function (project) {
    $scope.chosenProject = project
  }

  $scope.getPriority = function () {
    return "priority " + $scope.chosenProject.priority.toLowerCase()
  }

  $scope.getChosen = function(x){
    if($scope.chosenProject.name == x.name) return 'task selected'
    else return 'task'
  }
  

})



app.controller('task', function ($scope,$http) {
  $scope.tasks = {
    name : "Tasks",
    tasks : [
      {
        name: 'Talk to the boss',
        description: 'Talk to the boss about TIS',
        priority: 'High'
      },
      {
        name: 'Go to the bank',
        description: 'Pay the skin',
        priority: 'Medium'
      },
      {
        name: 'Dog training',
        description: 'Training the dog to crouch ',
        priority: 'Low'
      }
    ]
  }
  
  $scope.chosenTask = $scope.tasks.tasks[0]

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


app.controller('command', function ($scope) {
  console.log('command')
})


app.controller('chart', function ($scope) {
  console.log('charts');
    var ctx = document.getElementById("chartTasks");
    Chart.defaults.global.legend.display = false;
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Antes do prazo", "No prazo", "Depois do prazo"],
            datasets: [{
                label: 'Time Tracking (Tarefas)',
                data: [1, 18, 5],
                backgroundColor: [
                    '#f8bbd0',
                    '#e91e63',
                    '#c51162'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 0
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            },
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Time Tracking - Conclusão das tarefas'
            }
        }
    });
})


app.controller('calendar', function ($scope) {
  console.log('calendar')
})

