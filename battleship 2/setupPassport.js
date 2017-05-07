passport.use(new LocalStrategy(
  function(username, password, done) {
    Model.User.findOne({
      where: {
        'username': username
      }
    }).then(function (user) {
      if (user == null) {
        return done(null, false, { message: 'Incorrect credentials.' })
      }

      var hashedPassword = bcrypt.hashSync(password, user.salt)

      if (user.password === hashedPassword) {
        return done(null, user)
      }

      return done(null, false, { message: 'Incorrect credentials.' })
    })
  }
));
