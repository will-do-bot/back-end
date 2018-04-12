

app.service('$httpController', ['$http', function($http) {
  this.getProjects = function (cb) {
    $http({
      headers: {
        auth_key: 'a5f0d15d-cd12-4d33-8212-7ddd9f2cb6b8'
      },
      method: 'GET',
      url: '/project'
    })
    .then(response => cb(response.data))
  }

  this.getTasksOfProject = function (id, cb) {
    $http({
      headers: {
        auth_key: 'a5f0d15d-cd12-4d33-8212-7ddd9f2cb6b8'
      },
      method: 'GET',
      url: '/task/project/' + id
    })
    .then(response => cb(response.data))
  }

  this.getProjectById = function (id, cb) {
    $http({
      headers: {
        auth_key: 'a5f0d15d-cd12-4d33-8212-7ddd9f2cb6b8'
      },
      method: 'GET',
      url: '/project/' + id
    })
    .then(response => cb(response.data))
  }

  this.getTasks = function (cb) {
    $http({
      headers: {
        auth_key: 'a5f0d15d-cd12-4d33-8212-7ddd9f2cb6b8'
      },
      method: 'GET',
      url: '/task'
    })
    .then(response => {
      cb(response.data)
    })
  }
 }])