
// cookies.js library from https://developer.mozilla.org/en-US/docs/Web/API/document.cookie
// adapted to be used with jstools-core

(function (root, factory) {

  if ( typeof module !== 'undefined' ) {
    module.exports = factory();
  } else {
    if ( root.define ) {
        define('$cookie', factory);
    } else if ( root.angular ) {
        var $cookie = factory();
        angular.module('jstools.cookie', [])
          .provider('$cookie', function () {

            this.config = function (configFn) {
              configFn.call(null, $cookie);
            };

            this.$get = function () {
              return $cookie;
            };
          });
    } else if( !root.$cookie ) {
      root.$cookie = factory();
    }
  }

})(this, function(){
    'use strict';

    function cookie (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if( sValue ) {
            cookie.set(sKey, sValue, vEnd, sPath, sDomain, bSecure);
        } else {
            return cookie.get(sKey);
        }
    }

    cookie.get = function (sKey) {
        if (!sKey) { return null; }
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    };

    cookie.set = function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
        var sExpires = "";
        if (vEnd) {
            switch (vEnd.constructor) {
                case Number:
                    sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                break;
                case String:
                    sExpires = "; expires=" + vEnd;
                break;
                case Date:
                    sExpires = "; expires=" + vEnd.toUTCString();
                break;
            }
        }
        document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
        return true;
    };

    cookie.remove = function (sKey, sPath, sDomain) {
        if (!cookie.hasKey(sKey)) { return false; }
        document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
        return true;
    };

    cookie.hasKey = function (sKey) {
        if (!sKey) { return false; }
        return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    };

    cookie.keys = function () {
        var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
        for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
        return aKeys;
    }

    return cookie;
});
