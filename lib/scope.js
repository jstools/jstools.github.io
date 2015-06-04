/*
 * css.js
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Jesús Manuel Germade Castiñeiras <jesus@germade.es>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */


(function (root, factory) {
	'use strict';

	if ( typeof module !== 'undefined' ) {
		module.exports = factory();
	} else {
		if ( root.define ) {
			define('Scope', factory );
		} else if ( root.angular ) {
				var Scope = factory();
				angular.module('jstools.scope', [])
					.factory('Scope', factory);
		} else if( !root.Scope ) {
			root.Scope = factory();
		}
	}

})(this, function () {
	'use strict';

    function parseExpression (expression) {
        /* jshint ignore:start */
        return (new Function('model', 'try{ with(model) { return (' + expression + ') }; } catch(err) { return \'\'; }'));
        /* jshint ignore:end */
    }

    var Scope = function (data) {
        if( data instanceof Object ) {
            this.$$extend(data);
        }
    };

    Scope.prototype.$$new = function(data) {
        var S = function () {
            this.$$extend(data);
        };
        S.prototype = this;
        return new S(data);
    };

    Scope.prototype.$$extend = function(data) {
        for( var key in data ) {
            this[key] = data[key];
        }
        return this;
    };

    Scope.prototype.$$eval = function ( expression ) {
        return parseExpression(expression)(this);
    };

    return Scope;
});
