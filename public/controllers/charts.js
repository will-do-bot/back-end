app.controller('chart', function ($scope) {

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

    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["No prazo", "Atrasadas"],
            datasets: [{
                label: 'Time Tracking (Tarefas)',
                data: [4, 10],
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

    $scope.chosenTask = $scope.tasks.tasks[0]

    $scope.changeContent = function (task) {
        $scope.chosenTask = task
    };

    $scope.getPriority = function () {
        return "priority " + $scope.chosenTask.priority.toLowerCase()
    };

    $scope.getChosen = function(x){
        if($scope.chosenTask.name == x.name) return 'task selected'
        else return 'task'
    };
});
