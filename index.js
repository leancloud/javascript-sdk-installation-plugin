'use strict';

var jstz = require('jstz');

module.exports = function(AV) {

  if (!AV) {
    throw new Error('AV must be specified.');
  }

  var INSTALLATION_KEY = AV._getAVPath('installation');

  var DEFAULT_INSTALLATION = {
    deviceType: 'ios',
  };

  var Installation = AV.Object.extend('_Installation', {
    save: function(arg1, arg2, arg3) {
      var options;
      var attrs = {};
      if (arg3) {
        attrs[arg1] = arg2;
        options = arg3;
      } else {
        attrs = arg1;
        options = arg2;
      }
      options = options || {};
      var newOptions = {};
      // change default endpoint from `/classes/_Installation` to `/installations`
      newOptions._makeRequest = function(route, className, id, method, json) {
        return AV.request({
          service: 'push',
          path: '/installations' + ( id ? '/' + id : '' ),
          method: method,
          data: json
        });
      };

      var promise;
      // installation should be updated once a day.
      var lastUpdateExpired =
        this.id && this.updatedAt &&
        new Date() - new Date(this.updatedAt) > 24 * 3600000;
      if (this.dirty() || lastUpdateExpired) {
        promise = AV.Object.prototype.save
          .call(this, attrs, newOptions)
          .then(function(model) {
            // update local cache.
            AV.localStorage.setItemAsync(
              INSTALLATION_KEY,
              JSON.stringify(model.toFullJSON())
            );
            return model;
          });
      } else {
        promise = AV.Promise.resolve(this);
      }
      return promise;
    }
  });

  return {
    getCurrent: function() {
      return AV.localStorage.getItemAsync(INSTALLATION_KEY)
        .then(function(installationString) {
          var installation;
          if (installationString) {
            try {
              var installationData = JSON.parse(installationString);
              // if local cache exists, installation.objectId exists
              // installation.dirty() will be false
              installation = AV.parseJSON(installationData);
            } catch (e) {}
          }
          if (!installation) {
            // create a new Installation
            // installation.dirty() will be true
            installation = new Installation(DEFAULT_INSTALLATION);
          }
          var timeZone = jstz.determine().name();
          if (installation.get('timeZone') !== timeZone) {
            installation.set('timeZone', timeZone);
          }
          return installation;
        });
    }
  };
};
