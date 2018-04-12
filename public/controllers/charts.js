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
});
