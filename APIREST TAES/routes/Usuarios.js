/*
Codigo en node.js de la api-rest de la aplicacion de AlacantFit del grupo de TAES 3-5
Este software se restringe a la licencia GNU General Public License, version 3 
Jorge Segovia Tormo
Javier Erro Garcia
Javier Molpeceres Gómez
Alberto Sapiña Mora
*/
var express = require('express');
var validator = require("email-validator");
var usuarios = express.Router();
module.exports = usuarios;

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'jsadevtech.com',
  user     : 'afit',
  password : '1234567',
  database : 'AlacantFit'
});

usuarios.get('/',function(req,res){
  connection.query('SELECT * from Usuario', function(err, rows, fields) {
    if (rows ==null){
      res.status(404).send('Usuario no encontrado');
    }else{
      res.status(200).send(rows);
    }
  });
});

usuarios.get('/:id',function(req,res){
  var login = req.params.id;
  connection.query('SELECT * from Usuario u where u.usuario=\''+login+'\'', function(err, rows, fields) {
    if (rows ==null){
      res.status(404).send('Usuario no encontrado');
    }else{
      res.status(200).send(rows[0]);
    }
  });
});

usuarios.post('/',function(req,res){
  var Usuario = req.body.Usuario;
  var Pass = req.body.Pass;
  var Correo = req.body.Correo;

  if (!comprobarEmail(Correo)){
    res.status(404).send('Error de Email: \''+Correo+'\'no es valido. Usuario no Registrado');
  }else if(!comprobarPass(Pass)){
    res.status(404).send('Error de Contraseña: \''+Pass+'\'no es valido. Usuario no Registrado');
  }
  else
  connection.query('INSERT IGNORE INTO Usuario(Usuario, Correo, Pass) VALUES (\''+Usuario+'\',\''+Correo+'\',\''+Pass+'\');', function(err, rows, fields) {
    if (err || rows.affectedRows==0){
      res.status(500).send('Usuario no insertado');
    }else{
      res.status(200).send('Usuario insertado');
    }
  });
});

usuarios.put('/:id',function(req,res){
  var login = req.params.id;
  var Nombre = req.body.Nombre;
  var Usuario = req.body.Usuario;
  var Pass = req.body.Pass;
  var Correo = req.body.Correo;
  var Ciudad = req.body.Ciudad;
  var Pais = req.body.Pais;
  var Edad = req.body.Edad;
  var Altura = req.body.Altura;
  var Peso = req.body.Peso;
  var Imagen = req.body.Imagen;
  var Genero = req.body.Genero;

  if (!comprobarEmail(Correo)){
    res.status(404).send('Error de Email: \''+Correo+'\'no es valido. Usuario no modificado');
  }else if(!comprobarPass(Pass)){
    res.status(404).send('Error de Contraseña: \''+Pass+'\'no es valido. Usuario no modificado');
  }
  else
  connection.query('CALL perfil(\''+Nombre+'\',\''+Usuario+'\',\''+Pass+'\',\''+Correo+'\',\''+Ciudad+'\',\''+Pais+'\','+Edad+','+Altura+','+Peso+','+Imagen+','+Genero+');', function(err, rows, fields) {

    if (err || rows.affectedRows==0){
      res.status(500).send('Usuario no modificado');
    }else{
      res.status(200).send('Usuario modificado');
    }
  });
});

usuarios.put('/sinPassCorreo/:id',function(req,res){
  var login = req.params.id;
  var Nombre = req.body.Nombre;
  var Usuario = req.body.Usuario;
  var Ciudad = req.body.Ciudad;
  var Pais = req.body.Pais;
  var Edad = req.body.Edad;
  var Altura = req.body.Altura;
  var Peso = req.body.Peso;
  var Imagen = null;
  var Genero = req.body.Genero;

  connection.query('CALL PerfilSinPassCorreo(\''+Nombre+'\',\''+Usuario+'\',\''+Ciudad+'\',\''+Pais+'\','+Edad+','+Altura+','+Peso+','+Imagen+','+Genero+');', function(err, rows, fields) {

    if (err || rows.affectedRows==0){
      res.status(500).send('Usuario no modificado');
    }else{
      res.status(200).send('Usuario modificado');
    }
  });
});

function comprobarEmail(email){
  return validator.validate(email);
}
//function comprobarGenero(genero){
//  if(genero == "1" || genero == "0" || genero == ""){
//    return true;
//  }
//  }
//}
function comprobarPass(pass){
  if(pass.length >= 5 && pass.length <= 25){
    return true;
  }else {
    return false;
  }
}

usuarios.delete('/:id',function(req,res){
  var iduser = req.params.id;
  connection.query('CALL borraUsuario(\''+iduser+'\');', function(err, rows, fields) {
    if (err || rows.affectedRows==0){
      res.status(500).send('Usuario no Borrado');
    }else{
      res.status(200).send('Usuario Borrado');
    }
  });
});
