app.controller('project', function ($scope, $httpController, $http) {


  getProjects()

  function getProjects() {
    $httpController.getProjects(projects => {
      $scope.projects = projects;
      $scope.chosenProject = projects[0];
      // $scope.getPriority = `priority ${$scope.chosenProject.priority.toLowerCase()}`
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
    $scope.getPriority = `priority ${$scope.chosenProject.priority.toLowerCase()}`
  }

  $scope.getChosen = function (x) {
    if ($scope.chosenProject.name == x.name) return 'task selected'
    else return 'task'
  }

  $scope.deleteProject = function (x) {
    $http({
      headers: {
        auth_key: '9d277d84-665a-4c79-9823-6b1d7d41016e'
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

})