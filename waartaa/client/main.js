Template.header.events({
  'click #signout': function(){
    Meteor.logout(function (err) {
      Meteor.Router.to('/');
    });
  }
});

Template.content.events({
  'click .close[data-dismiss="alert"]': function (event) {
    Session.set($(event.currentTarget).data('sessionkey')); 
  }
});

Template.user_loggedout_content.show_signup_form = function(){
  return Session.get('showSignupFrom');
};

Template.signin_form.SigninError = function () {
  return Session.get('SigninFormError');
};

Template.signin_form.events({
  'click #signup-link': function (e){
    e.preventDefault();
    Session.set('showSignupFrom', true);
    Session.set('SigninFormError');
  },
  'submit form': function (e) {
    e.preventDefault();
    var user = $('#user-signin-username').val();
    var password = $('#user-signin-password').val();
    Meteor.loginWithPassword(user, password, function (err) {
      if (err)
        Session.set('SigninFormError', err);
      else
        Session.set('SigninFormError');
      Meteor.Router.to('/home');
    });
  }
});

Template.signup_form.events({
  'click #signin-link': function(e){
    e.preventDefault();
    Session.set('showSignupFrom', false);
    Session.set('SignupFormError');
  },
  'submit form': function(e){
    e.preventDefault();
    var username = $('#user-signup-username').val();
    var password = $('#user-signup-password').val();
    var email = $('#user-signup-email').val();
    var options = {username: username, email: email, password: password, profile: {}};
    Accounts.createUser(options, function(err){
      if (err) {
        Session.set('SignupFormError', err);
      } else {
        Session.set('SignupFormError');
      }
    });
  },
});

Template.signup_form.SignupError = function(){
  var err = Session.get('SignupFormError');
  if (err)
    return err;
};

updateHeight();

$(window).resize(updateHeight);


Meteor.Router.add({
  '': function () {
    GAnalytics.pageview();
    if (Meteor.userId()) {
      location.href = "/chat";
    } else
      return 'user_loggedout_content';
  },
  '/chat': function () {
    if (Meteor.userId()) {
      GAnalytics.pageview('/chat');
      Session.set('currentPage', 'chat');
      return 'chat';
    } else
      location.href = '/';
  }
});

Meteor.Router.filters({
  'login_required': function (page) {
    if (Meteor.user()) {
      return page;
    } else {
      return 'user_loggedout_content';
    }
  }
});

Meteor.Router.filter('login_required', {only: ['user_dashboard', 'chat']});

Handlebars.registerHelper("isCurrentPageHome", function () {
  return Session.get('currentPage') === 'home';
});
Handlebars.registerHelper("isUserLoggedIn", function () {
  return Meteor.user();
});
Handlebars.registerHelper("isCurrentPageChat", function () {
  return Session.get('currentPage') === 'chat';
});

Accounts.ui.config({
  requestPermissions: {
    github: ['user', 'repo']
  },
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});
