module.exports = {

    //Id do Lucas: 5a9e8d4e352d3d00148e24c3

    checkAuth: function(req, res, next) {
        //Inserir lógica aqui
        req.user = 1636208479780756;
        next();
    },

    validate: function(req, res, next) {
        next();
    }

};