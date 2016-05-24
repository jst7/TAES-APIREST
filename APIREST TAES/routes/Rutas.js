/*
Codigo en node.js de la api-rest de la aplicacion de AlacantFit del grupo de TAES 3-5
Este software se restringe a la licencia GNU General Public License, version 3 
Jorge Segovia Tormo
Javier Erro Garcia
Javier Molpeceres Gómez
Alberto Sapiña Mora
*/

var express = require('express');
var rutas = express.Router();
module.exports = rutas;
var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var mysql      = require('mysql');
var mime = require('mime');
var connection = mysql.createConnection({
  host     : 'jsadevtech.com',
  user     : 'afit',
  password : '1234567',
  database : 'AlacantFit'
});
var multer  =   require('multer');
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './rutas/');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now()+'.jpg');
  }
});
var upload = multer({ storage : storage}).single('userPhoto');



rutas.get('/', function(req,res){
  connection.query('select * from Ruta;', function(err, rows, fields){
    if(rows[0]==null){
      res.status(404).send(rows);
    }else{
      res.status(200).send(rows);
    }
  });
});

rutas.get('/MayorMenor', function(req,res){
  connection.query('CALL RutasMayorMenor();', function(err, rows, fields){
    if(rows == null){
      res.status(404).send('No hay rutas disponibles');
    }else{
      res.status(200).send(rows[0]);
    }
  });
});

rutas.get('/MenorMayor', function(req,res){
  connection.query('CALL RutasMenorMayor();', function(err, rows, fields){
    if(rows == null){
      res.status(404).send('No hay rutas disponibles');
    }else{
      res.status(200).send(rows[0]);
    }
  });
});


rutas.get('/amigos/:id',function(req,res){
  connection.query('select r.Nombre,r.Ciudad,r.Distancia,r.TiempoEst,r.usuario,r.VecesDescargadas  from Ruta r,Amigo a where a.usuario=\''+req.params.id+'\'and a.amigo=r.usuario and a.amigo not in(\''+req.params.id+'\');', function(err, rows, fields) {
    if (err){
      res.status(500).send('No existen rutas');
    }else{
      res.status(200).send(rows);
    }
  });
});


rutas.get('/info/:id',function(req,res){
  connection.query('SELECT * FROM Ruta where nombre=\''+req.params.id+'\'', function(err, rows, fields){
    if(rows == null){
      res.status(404).send('No hay rutas disponibles');
    }else{
      res.status(200).send(rows);
    }
  });
});

rutas.get('/kml/:nombre',function(req,res){
  var encontrado=true;
  connection.query('call Descargar(\''+req.params.nombre+'\');', function(err, rows, fields){
    if(err){
      encontrado=false;
      res.status(500).send()
    }else if(rows==null){
      encontrado=false;
      res.status(404).send('Ruta no encontrada');
    }else{
      try{
        var filePath = path.join(__dirname, '../rutas/'+req.params.nombre+'.kml');
        var stat = fs.statSync(filePath);
        res.writeHead(200, {
            'Content-Type': 'text',
            'Content-Length': stat.size
        });
        var readStream = fs.createReadStream(filePath);

        readStream.pipe(res);
      }catch(ex){
        res.status(404).send();
      }
    }
  });
});

rutas.post('/kml',function(req,res){
  connection.query('insert into Ruta values(\''+req.body.NombreRuta+ '\',\'Alicante\','+(parseInt(Math.random()*(50-1)+1))+','+(parseInt(Math.random()*(90-1)+1))+',\''+req.body.Usuario+'\',\''+req.body.NombreRuta+'\',0);',function(err,rows,fields){
    if(err){
      res.status(500).send("Ruta duplicada");
      console.log(err);
    }else{
      fs.writeFile("rutas/"+req.body.NombreRuta+".kml", req.body.Xml, function(err) {
        if(err) {
          res.status(500).send();
          console.log(err);
        }else{
          res.status(200).send();
        }
      });
    }
  });
});

rutas.get('/info/:id/imagenes/:id2',function(req,res){
  try{
    var filePath = path.join(__dirname, '../imagenes/'+req.params.id2+'.PNG');
    var stat = fs.statSync(filePath);
    res.writeHead(200, {
        'Content-Type': 'text',
        'Content-Length': stat.size
    });
    var readStream = fs.createReadStream(filePath);

    readStream.pipe(res);
  }catch(ex){
    res.status(404).send();
  }
});

rutas.delete('/:id',function(req,res){
  var iduser = req.params.id;
  connection.query('CALL BorrarRuta(\''+iduser+'\');', function(err, rows, fields) {
    if (err || rows.affectedRows==0){
      res.status(500).send('Ruta no Borrado');
    }else{
      res.status(200).send('Ruta Borrado');
    }
  });
});
