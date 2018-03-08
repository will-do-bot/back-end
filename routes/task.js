
module.exports = function (app){
    app.post('/task',function(req, res){
        console.log(req.body)
        res.status(200).send({nome: req.body.name || 'asd'})
    })
}


