// adapted from facebook_client.js
// Request Instagram credentials for the user
// @param options {optional}
// @param credentialRequestCompleteCallback {Function} Callback function to call on
//   completion. Takes one argument, credentialToken on success, or Error on
//   error.
Instagram.requestCredential = function (options, credentialRequestCompleteCallback) {
  // support both (options, callback) and (callback).
  if (!credentialRequestCompleteCallback && typeof options === 'function') {
    credentialRequestCompleteCallback = options;
    options = {};
  }

  var config = ServiceConfiguration.configurations.findOne({service: 'instagram'});
  if (!config) {
    credentialRequestCompleteCallback && credentialRequestCompleteCallback(new ServiceConfiguration.ConfigError("Service not configured"));
    return;
  }

  var credentialToken = Random.id();
  var mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
  var display = mobile ? 'touch' : 'popup';

  var scope = "basic+relationships+likes+comments";
  if (options && options.requestPermissions)
    scope = options.requestPermissions.join('+');

  var loginUrl =
        'https://instagram.com/oauth/authorize' +
        '?client_id=' + config.appId +
        '&redirect_uri=' +  Meteor.absoluteUrl('_oauth/instagram?close=close', {replaceLocalhost: true}) +
        // from prior 
        '&response_type=code' +
        '&display=' + display + 
        '&scope=' + scope +
        '&state=' + credentialToken;
  Oauth.initiateLogin(credentialToken, loginUrl, credentialRequestCompleteCallback);
};

