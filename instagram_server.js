/// adapted from facebook_server.js 

var querystring = Npm.require('querystring');


Oauth.registerService('instagram', 2, null, function(query) {

  var response = getTokenResponse(query);
  var accessToken = response.accessToken;
  var identity = getIdentity(accessToken);

  var serviceData = {
    accessToken: accessToken,
    expiresAt: (+new Date) + (1000 * response.expiresIn)
  };

  // include all fields from instagram.. follow facebook package as closely as possible
  // http://developers.instagram.com/docs/reference/login/public-profile-and-friend-list/
  var whitelisted = ['id', 'email', 'name', 'first_name',
      'last_name', 'link', 'username', 'gender', 'locale', 'age_range'];

  var fields = _.pick(identity, whitelisted);
  _.extend(serviceData, fields);

  return {
    serviceData: serviceData,
    options: {profile: {name: identity.name}}
  };
});

// checks whether a string parses as JSON
var isJSON = function (str) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

// returns an object containing:
// - accessToken
// - expiresIn: lifetime of token in seconds
var getTokenResponse = function (query) {
  var config = ServiceConfiguration.configurations.findOne({service: 'instagram'});
  if (!config)
    throw new ServiceConfiguration.ConfigError("Service not configured");

  var responseContent;
  try {
    // Request an access token
    responseContent = Meteor.http.get(
      "https://api.instagram.com/oauth/access_token", {
        params: {
          client_id: config.appId,
          client_secret: config.secret,
          redirect_uri: Meteor.absoluteUrl("_oauth/instagram?close=close", {replaceLocalhost: true}),
          code: query.code,
          grant_type: 'authorization_code'
        }
      }).content;
  } catch (err) {
    throw new Error("Failed to complete OAuth handshake with Instagram. " + err.message);
  }

  // If 'responseContent' parses as JSON, it is an error.
  // XXX which (instagram)  error causes this behvaior?
  if (isJSON(responseContent)) {
    throw new Error("Failed to complete OAuth handshake with Instagram. " + responseContent);
  }

  // Success!  Extract the instagram access token and expiration
  // time from the response
  var parsedResponse = querystring.parse(responseContent);
  //TODO rename these variables
  var igAccessToken = parsedResponse.access_token;
  var igExpires = parsedResponse.expires;

  if (!igAccessToken) {
    throw new Error("Failed to complete OAuth handshake with instagram " +
                    "-- can't find access token in HTTP response. " + responseContent);
  }
  return {
    //TODO fix var names 
    accessToken: igAccessToken,
    expiresIn: igExpires
  };
};

var getIdentity = function (accessToken) {
  try {
    return Meteor.http.get("https://api.instagram.com/users/"+accessToken.user.id, {
      params: {access_token: accessToken}}).data;
  } catch (err) {
    throw new Error("Failed to fetch identity from Instagram. " + err.message);
  }
};

Instagram.retrieveCredential = function(credentialToken) {
  return Oauth.retrieveCredential(credentialToken);
};

