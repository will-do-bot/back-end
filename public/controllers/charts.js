app.controller('chart', function ($scope, $httpController, $http) {

    console.log('charts');

    var ctx = document.getElementById("chartTasks");

    Chart.defaults.global.legend.display = false;

    $scope.tasks = {
        name : "Tasks",
        tasks : [
            {
                name: 'Talk to the boss',
                description: 'Talk to the boss about TIS',
                priority: 'High'
            }
        ]
    };

    getProjects()

    function getProjects() {
        $httpController.getProjects(projects => {
            $scope.projects = projects;
            $scope.chosenProject = projects[0];

            $httpController.getTasksOfProject($scope.projects[0]['_id'], tasks => {
                $scope.projects[0].tasks = tasks;
                $scope.createChart(0);
            });

            for (let i = 0; i < $scope.projects.length; i++) $scope.getTasks(i);
        });
    }

    $scope.getTasks = function (i) {
        $httpController.getTasksOfProject($scope.projects[i]['_id'], tasks => {
            $scope.projects[i].tasks = tasks;
        });
    };

    $scope.chosenTask = $scope.tasks.tasks[0];

    $scope.createChart = function (i) {
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ["No prazo", "Atrasadas"],
                datasets: [{
                    label: 'Time Tracking (Tarefas)',
                    data: [$scope.projects[i].tasks.length, $scope.projects[i].tasks.length+3],
                    backgroundColor: [
                        '#f8bbd0',
                        '#e91e63'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)'
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
    };

    $scope.getChosen = function(x){
        let resposta;

        if($scope.chosenProject.name === x.name) {
            resposta = 'task selected';
        }
        else {
            resposta = 'task';
        }

        return resposta;

    };

    $scope.changeContent = (x) => {
        $scope.chosenProject = x;
        console.log(x);
        $scope.createChart(1);
    }
});
