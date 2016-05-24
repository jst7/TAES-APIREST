/*
Codigo en node.js de la api-rest de la aplicacion de AlacantFit del grupo de TAES 3-5
Este software se restringe a la licencia GNU General Public License, version 3 
Jorge Segovia Tormo
Javier Erro Garcia
Javier Molpeceres Gómez
Alberto Sapiña Mora
*/
var express = require('express');
var amigos = express.Router();
module.exports = amigos;

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'jsadevtech.com',
  user     : 'afit',
  password : '1234567',
  database : 'AlacantFit'
});


//Funciona
amigos.post('/Relacion',function(req,res){
  var Usuario = req.body.Usuario;
  var Amigo = req.body.Amigo;

  connection.query('CALL nuevoAmigo(\''+Usuario+'\',\''+Amigo+'\');', function(err, rows, fields) {
    if (err){
      res.status(500).send('Amigo no insertado');
    }else{
      res.status(200).send('Amigo Insertado');
    }
  });
});

//Funciona
amigos.post('/Romper',function(req,res){
  var Usuario = req.body.Usuario;
  var Amigo = req.body.Amigo;

  connection.query('CALL borrarAmigo(\''+Usuario+'\',\''+Amigo+'\');', function(err, rows, fields) {
    if (err){
      res.status(500).send('Amigo no Borrado');
    }else{
      res.status(200).send('Amigo Borrado');
    }
  });
});

//Funciona, envia algo raro pero funciona
amigos.get('/LeerAmigos/:id',function(req,res){
var login = req.params.id;
    connection.query('CALL getAmigos(\''+login+'\')', function(err, rows, fields) {
    if (err){
      res.status(500).send('No tiene Amigos');
    }else{
      res.status(200).send(rows[0]);
    }
  });
});
