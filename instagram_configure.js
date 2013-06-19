// adapted from facebook_configure.js
Template.configureLoginServiceDialogForInstagram.siteUrl = function () {
  return Meteor.absoluteUrl();
};

Template.configureLoginServiceDialogForInstagram.fields = function () {
  return [
    {property: 'appId', label: 'App ID'},
    {property: 'secret', label: 'App Secret'},
    {property: 'scope', label: "Scope (separated by a '+')"}
  ];
};
