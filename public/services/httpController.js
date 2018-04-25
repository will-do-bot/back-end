const auth_key = "9d277d84-665a-4c79-9823-6b1d7d41016e";

app.service('$httpController', ['$http', function($http) {
  this.getProjects = function (cb) {
    $http({
      headers: {
        auth_key: auth_key
      },
      method: 'GET',
      url: '/project'
    })
    .then(response => cb(response.data))
  }

  this.getTasksOfProject = function (id, cb) {
    $http({
      headers: {
        auth_key: auth_key
      },
      method: 'GET',
      url: '/task/project/' + id
    })
    .then(response => cb(response.data))
  }

  this.getProjectById = function (id, cb) {
    $http({
      headers: {
        auth_key: auth_key
      },
      method: 'GET',
      url: '/project/' + id
    })
    .then(response => cb(response.data))
  }

  this.getTasks = function (cb) {
    $http({
      headers: {
        auth_key: auth_key
      },
      method: 'GET',
      url: '/task/'
    })
    .then(response => {
      cb(response.data)
    })
  }
 }])