const express = require('express');
const db = require('../db/db.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const router = express.Router();


router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/login', function (req, res, next) {
  res.render('index');
});

router.get('/register', function (req, res, next) {
  res.render('register');
});

router.get('/game', function (req, res, next) {
  res.render('game');
});

router.post('/login', function (req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  db.battleshipDB.one("select * from player where username=$1", [username])
    .then(function (data) {
      bcrypt.compare(password, data.password, function (err, passwordValid) {
        if (!passwordValid)
            res.json({success: false, user: data, message: "Login failed"});
        else{
              res.json({success: true, user: data})
        }
      });

    })
    .catch(function (error) {
      res.status(403).json({
          title: 'Login', login_result: error,
          message: "Login failed", success: false
      });
    });
});

router.post('/register', function (req, res, next) {
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;

    bcrypt.hash(password, saltRounds, function (err, encryptedPassword) {
      if(password === '' || password2 === '' || password2 !== password){
        res.status(403).json({
          title: 'Register',
          message: "Register failed",
          success: false
        });
        return
      }
      db.battleshipDB.one("insert into player(username, password) values($1, $2) returning *",
          [username, encryptedPassword])
          .then(function (data) {
            res.json({
                title: 'Login',
                user: data,
                success:true,
                message: "Registration successful"
            });
              db.battleshipDB.none("INSERT INTO high_score(user_id) VALUES ($1)", [data.id])
                .then(function (success) {
                    console.log("Success: added user_id to high_score table", success);
                })
                .catch(function (err) {
                    console.log("Error: failed to add to high_score table", err);
                })
          })
          .catch(function (error) {
            res.status(403).json({
                title: 'Register',
                login_result: error,
                message: "Register failed",
                success: false
            });
          })
    });
});

module.exports = router;
