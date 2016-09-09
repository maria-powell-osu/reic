'use strict';

App.directive('googleSignInButton', function() {
  return {
      scope: {
        buttonId: '@',
        options: '&'
      },
      template: '<div></div>',
      link: function(scope, element, attrs) {
        var div = element.find('div')[0];
        div.id = attrs.buttonId;
        gapi.signin2.render(div.id, scope.options()); //render a google button, first argument is an id, second options
      }
    };
});