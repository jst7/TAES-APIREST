/*
Codigo en node.js de la api-rest de la aplicacion de AlacantFit del grupo de TAES 3-5
Este software se restringe a la licencia GNU General Public License, version 3 
Jorge Segovia Tormo
Javier Erro Garcia
Javier Molpeceres Gómez
Alberto Sapiña Mora
*/
var express = require('express');
var ranking = express.Router();
module.exports = ranking;

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'jsadevtech.com',
  user     : 'afit',
  password : '1234567',
  database : 'AlacantFit'
});

//Funciona
ranking.post('/Puntuacion',function(req,res){
  var Usuario = req.body.Usuario;
  var Puntuacion = req.body.Puntuacion;

  connection.query('CALL NuevoRanker(\''+Usuario+'\',\''+Puntuacion+'\');', function(err, rows, fields) {
    if (err){
      res.status(500).send('Puntuacion no insertado');
    }else{
      res.status(200).send('Puntuacion Insertado');
    }
  });
});

//Funciona
ranking.get('/',function(req,res){
  var login = req.params.id;
  connection.query('CALL RankingGlobal()', function(err, rows, fields) {
    if (rows == null){
      res.status(404).send('RankingGlobal no disponible');
    }else{
      res.status(200).send(rows[0]);
    }
  });
});

//Funciona
ranking.get('/:id',function(req,res){
  var usuario = req.params.id;
  connection.query('CALL RankingAmigos(\''+usuario+'\')', function(err, rows, fields) {
    if (rows ==null){
      res.status(404).send('RankingAmigos no disponible');
    }else{
      res.status(200).send(rows[0]);
    }
  });
});

//Funciona
ranking.get('/Personal/:id',function(req,res){
  var usuario = req.params.id;
  connection.query('CALL RankingPersonal(\''+usuario+'\')', function(err, rows, fields) {
    if (rows ==null){
      res.status(404).send('RankingPersonal no disponible');
    }else{
      res.status(200).send(rows[0]);
    }
  });
});

//Funciona
ranking.get('/Posicion/:id',function(req,res){
  var usuario = req.params.id;

  connection.query('CALL PosicionRanker(\''+usuario+'\')', function(err, rows, fields) {
    if (rows ==null){
      res.status(404).send('Posicion no disponible');
    }else{
      res.status(200).send(rows[0]);
    }
  });
});
