
module.exports = function ($scope, $http, $httpController) {

  getProjects()
  var ctx = document.getElementById("chartTasks");
  var myChart;

  Chart.defaults.global.legend.display = false;
  $scope.teste = 'This is just a test'

  function getProjects() {
    $httpController.getProjects(projects => {
      $scope.projects = projects;
      $scope.chosenProject = projects[0];
      getReports()
      for (let i = 0; i < $scope.projects.length; i++) $scope.getTasks(i);
    })
  }

  $scope.addProject = function (project) {
    $httpController.setProject(project)
  }

  $scope.getTasks = function (i) {
    $httpController.getTasksOfProject($scope.projects[i]['_id'], tasks => {
      $scope.projects[i].tasks = tasks;
    })
  }

  $scope.changeContent = (x) => {
    $scope.chosenProject = x
    getReports()
  }

  $scope.getChosen = function (x) {
    if ($scope.chosenProject.name == x.name) return 'task selected'
    else return 'task'
  }

  $scope.deleteProject = function (x) {
    $http({
      headers: {
        auth_key: '8e8281d3-1a09-452c-b218-a6566a09c7a7'
      },
      method: 'DELETE',
      url: '/project/' + x['_id']
    })
      .then(response => {
        getProjects()
      })
  }

  $scope.cancelProject = function () {
    $scope.showAddProject = !$scope.showAddProject
  }

  function getReports() {
    let p = [];
    let count = 0;
    $httpController.getReports($scope.chosenProject._id, (p) => {
      console.log(p)
      $scope.createChart(p);
    })
  }

  $scope.createChart = function (i) {
    if (myChart) myChart.destroy();
    myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ["No prazo", "Atrasadas"],
        datasets: [{
          label: 'Time Tracking (Tarefas)',
          data: [i.prazo, i.foraPrazo],
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
              beginAtZero: true
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

}
