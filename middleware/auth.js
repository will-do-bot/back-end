module.exports = {
    
    checkAuth: function(req, res, next) {
        //Inserir lógica aqui
        req.user = 1636208479780756;
        next();
    },

    validate: function(req, res, next) {
        next();
    }

};