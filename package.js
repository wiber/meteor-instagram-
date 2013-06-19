Package.describe({
  summary: "Login service for Instagram accounts. Adapts Meteor v0.6.4 Facebook OAuth flow",
  // internal for now. Should be external when it has a richer API to do
  // actual API things with the service, not just handle the OAuth flow.
  internal: true
});

Package.on_use(function(api) {
  // this is present in old instagram-acounts , necessary?
  //api.use('accounts-base', ['client', 'server']);
  api.use('oauth2', ['client', 'server']);
  api.use('http', ['client', 'server']);
  api.use('templating', 'client');

  api.add_files(
    ['instagram_configure.html', 'instagram_configure.js'],
    'client');

  api.add_files('instagram_common.js', ['client', 'server']);
  api.add_files('instagram_server.js', 'server');
  api.add_files('instagram_client.js', 'client');
});

