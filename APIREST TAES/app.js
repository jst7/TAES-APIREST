/*
Codigo en node.js de la api-rest de la aplicacion de AlacantFit del grupo de TAES 3-5
Este software se restringe a la licencia GNU General Public License, version 3
Jorge Segovia Tormo
Javier Erro Garcia
Javier Molpeceres Gómez
Alberto Sapiña Mora
*/
var bodyParser = require('body-parser');
//API REST
var express = require('express');
var app = express();
app.use(bodyParser());

//USUARIOS
var usuarios = require('./routes/Usuarios');
app.use('/usuarios',usuarios);
//RUTAS
var rutas = require('./routes/Rutas');
app.use('/rutas',rutas);
//RANKING
var ranking = require('./routes/Ranking');
app.use('/ranking',ranking);
//AMIGOS
var amigos = require('./routes/Amigos');
app.use('/amigos',amigos);


var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'jsadevtech.com',
  user     : 'afit',
  password : '1234567',
  database : 'AlacantFit'
});

function ComprobacionLogin(pass){ //aqui cambiar al gusto de cada uno
if(pass.length >= 5 && pass.length <= 25){
  return true;
}else {
  return false;
}

}

app.post('/login',function(req,res){
  var login = req.body.login;
  var password = req.body.password;
  try{
      connection.query('CALL Loguearse(\''+login+'\',\''+password+'\');', function(err, rows, fields) {
            if(rows==null || err){
              res.status(500).send();
            }else{
              if(rows[0][0].login=="1"){
                res.status(200).send();
              }else{
                res.status(401).send();
              }
            }
      });
  }catch(Ex){
    console.log(Ex);
      res.status(401).send(Ex);
  }
});

app.listen(process.env.PORT || 80, function(){
    console.log('Express en el puerto 80');
})
