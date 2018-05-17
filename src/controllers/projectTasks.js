module.exports = function ($scope, $routeParams, $httpController, $http) {
  $httpController.getTasksOfProject($routeParams.id, tasks => {
    $scope.tasks = tasks
    $scope.chosenTask = tasks[0]
    tasks.forEach(element => {
      getTimes(element)
    });
    console.log($scope.chosenTask)
    $httpController.getProjectById($routeParams.id, project => {
      $scope.project = project
    })
  })

  function getTasksOfProject() {
    $httpController.getTasksOfProject($routeParams.id, tasks => {
      $scope.tasks = tasks
      $scope.chosenTask = tasks[0]
      $httpController.getProjectById($routeParams.id, project => {
        $scope.project = project
      })
    })
  }

  function getTimes(task) {
    $http({
      headers: {
        auth_key: '8e8281d3-1a09-452c-b218-a6566a09c7a7'
      },
      method: 'GET',
      url: '/time_tracker?task=' + task._id
    }).then(response => {
      task.times = response.data
    })
  }

  $scope.changeContent = function (task) {
    $scope.chosenTask = task
  }


  $scope.getChosen = function (task) {
    let c = 'task';
    if (task.finished) c += ' finished';
    if ($scope.chosenTask.name == task.name) c += ' selected'
    return c;
  }


  $scope.deleteTask = function (id) {
    $httpController.deleteTask(id, response => {
      getTasksOfProject()
    })

  }

  $scope.showCreateTask = function () {
    $scope.showAddTask = true
    $scope.updateButton = false
    $scope.createButton = true
    $scope.subTitleTask = 'Create Task'
    $scope.selectProject = true
    console.log($scope.startTask)
  }
  $scope.showUpdateTask = function (task) {
    $scope.showAddTask = true
    $scope.updateButton = true
    $scope.createButton = false
    $scope.subTitleTask = 'Update Task'
    $scope.selectProject = false
  }


  $scope.cancelTask = function () {
    $scope.showAddTask = !$scope.showAddTask
  }

  $scope.addTask = function (task) {
    task.project = $scope.project._id
    $httpController.setTask(task, response => {
      getTasksOfProject()
    })
    $scope.showAddTask = !$scope.showAddTask
  }

  $scope.updateTask = function (task, taskId) {
    $httpController.updateTask(task, taskId, response => {
      alert("Task updated!")
      console.log(response)
    })
  }

  $scope.startTask = function (id) {
    $httpController.startTask(id, response => {
      alert("Task created!")
      console.log(response)
    })
  }
  $scope.pauseTask = function (id) {
    $httpController.pauseTask(id, response => {
      console.log(response)
    })
  }

  $scope.finishTask = function (id) {
    $httpController.finishTask(id, response => {
      console.log(response)
    })
  }

}
