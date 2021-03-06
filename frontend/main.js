const chatClass = require('./chat')
const userClass = require('./user')
const events = require('../constants/events')
const socket = io.connect();
var user;
var chat;
var clientIO;

function showErrorMessage(error) {
  $('#login-error').text(error.message);
  $('#login-error').show();
}
$(document).ready(() => {
  function populateHeader(user) {
    $('#header').show();
    $('#header #user').append('<a href=.>Log out as ' + user.username + '</a>');
  }

  function login(result) {
    if (!result.success) {
      showErrorMessage(result);
      return;
    }
    clientIO = io();
    user = new userClass.User(result.user);
    chat = new chatClass.Chat(user, clientIO);

    socket.emit(events.USER_LOGIN, result.user.username)
    socket.on(events.USER_LOGIN_MESSAGE, function(data){
      $('#messages').append('<p style= "color: red' + '"">' +"System: " + data + " is online.</p>");
    })

    $('.page').hide();
    $('#lobby').show();
    populateHeader(user.user);
  }

  $('.login-tab').click(function (event) {
    $('#register-error').hide();
    $('#login-error').hide();
  });

  $('input#login-submit').click(function (event) {
    event.preventDefault();
    $.post('/login', $('form#login-form').serialize(), function () {
    }, 'json')
      .done(function (result) {
        login(result);
      })
      .fail(function (error) {
        showErrorMessage(JSON.parse(error.responseText));
      });
  });

  $('input#register-submit').click(function (event) {
    event.preventDefault();
    $.post('/register', $('form#register-form').serialize(), function () {
    }, 'json')
      .done(function (result) {
        login(result);
      })
      .fail(function (error) {
        $('#register-error').text("Error registering");
        $('#register-error').show();
      });
  });

  $('button#createGame').click(function (event) {
    "use strict";
    clientIO.emit(events.CREATE_GAME, {user: user.user});
  });
});
