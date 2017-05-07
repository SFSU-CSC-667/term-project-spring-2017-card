const bodyParser = require('body-parser'),
      express = require('express'),
      pg = require('pg'),
      conString = "postgres://darelogbonna@localhost/battleshipdb",
      client = new pg.Client(conString),
      LocalStrategy = require('passport-local'),
      bcrypt = require('bcrypt'),
      User = sequelize.define('user', {
        firstName: {
          type: Sequelize.STRING
        },
        lastName: {
          type: Sequelize.STRING
        }
      }),

      app = express();


//view engine set-up
app.set('view engine', 'pug');

//middleware
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res){
  res.render('index');
});

app.get('/register', function(req, res){
  res.render('register');
});

app.get('/login', function(req, res){
  res.render('login');
});

app.get('/lobby', function(req, res){
  res.render('lobby');
});

app.get('/logout', function(req, res){
  res.redirect('/');
});


sequelize
  .authenticate()
  .then(function(err) {
    console.log('Connection has been established successfully.');
  })
  .catch(function (err) {
    console.log('Unable to connect to the database:', err);
  });


  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
  
  /*User.sync({force: true}).then(function () {
    // Table created
    return User.create({
      firstName: 'Darel',
      lastName: 'Ogbonna'
    });
  });*/









//test connection to the database
/*client.connect(function(err){
  if(err){
    return console.error('could not connect to postgres', err);
  }
  client.query('SELECT NOW() AS "theTime"', function(err, result){
    if(err){
      return console.error('error running query', err);
    }
    console.log(result.rows[0].theTime);
    client.end();
  });
});
*/


module.exports = app;
