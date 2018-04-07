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