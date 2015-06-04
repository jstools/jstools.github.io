/*
 * utils.js
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
			root.define('$utils', factory );
		} else if ( root.angular ) {
			root.angular.module('jstools.utils', []).factory(factory);
		} else if( !root.$utils ) {
			root.$utils = factory();
			if( !root._ ) {
				root._ = root.$utils;
			}
		}
	}

})(this, function () {
	'use strict';

		function _isType (type) {
        return function (o) {
            return (typeof o === type);
        };
    }

    function _instanceOf (_constructor) {
        return function (o) {
            return ( o instanceof _constructor );
        };
    }

		var _isObject = _isType('object'),
				_isFunction = _isType('function'),
				_isString = _isType('string'),
				_isNumber = _isType('number'),
				_isArray = Array.isArray || _instanceOf(Array),
				_isDate = _instanceOf(Date),
				_isRegExp = _instanceOf(RegExp),
				_isElement = function(o) {
			    return o && obj.nodeType === 1;
			  };

    function _key (o, fullKey, value){
        if( !_isObject(o) ) return false;
        var oKey, keys = fullKey.split('.');
        if(value !== undefined) {
            if(keys.length) {
                oKey = keys.shift();
                var nextKey = keys.shift();
                while( nextKey ) {
                    if( !o[oKey] ) o[oKey] = {};
                    o = o[oKey];
                    oKey = nextKey;
                    nextKey = keys.shift();
                }
                o[oKey] = value;
                return value;
            }
            return false;
        } else {
            for(var k = 0, len = keys.length, inKeys = o || {}; k < len ; k++ ) {
                oKey = keys[k];
                if( oKey in inKeys ) inKeys = inKeys[keys[k]] || {};
                else return false;
            }
            return inKeys;
        }
    }

    var RE_$$ = /^\$\$/,
        arrayShift = [].shift;

        function _merge () {
            var dest = arrayShift.call(arguments),
                src = arrayShift.call(arguments),
                key;

            while( src ) {

                if( typeof dest !== typeof src ) {
                    dest = _isArray(src) ? [] : ( _isObject(src) ? {} : src );
                }

                if( _isObject(src) ) {

                    for( key in src ) {
                        if( src[key] !== undefined ) {
                            if( typeof dest[key] !== typeof src[key] ) {
                                dest[key] = _merge(undefined, src[key]);
                            } else if( _isArray(dest[key]) ) {
                                [].push.apply(dest[key], src[key]);
                            } else if( _isObject(dest[key]) ) {
                                dest[key] = _merge(dest[key], src[key]);
                            } else {
                                dest[key] = src[key];
                            }
                        }
                    }
                }
                src = arrayShift.call(arguments);
            }

            return dest;
        }

        function _extend () {
            var dest = arrayShift.call(arguments),
                src = arrayShift.call(arguments),
                key;

            while( src ) {
                for( key in src) {
                    if( typeof dest[key] !== typeof src[key] ) {
                        dest[key] = src[key];
                    } else {
                        dest[key] = src[key];
                    }
                }
                src = arrayShift.call(arguments);
            }

            return dest;
        }

        function _copy (o) {
            return _merge(undefined, o);
        }


    function joinPath () {
        var path = (arguments[0] || '').replace(/\/$/, '');

        for( var i = 1, len = arguments.length - 1 ; i < len ; i++ ) {
            path += '/' + arguments[i].replace(/^\/|\/$/, '');
        }
        if( len ) {
            path += arguments[len] ? ( '/' + arguments[len].replace(/^\//, '') ) : '';
        }

        return path;
    }

    function _proccessPipe (pipe, args) {
        var result = pipe[0].apply(null, args);

        for( var i = 1, len = pipe.length; i < len; i++ ) {
            result = pipe[i](result);
        }

        return result;
    }

    function _addToPipe (pipe, args) {
        for( var i = 0, len = args.length; i < len; i++ ) {
            if( !_isFunction(args[i]) ) {
                throw 'only Functions are allowed as pipe arguments';
            } else {
                pipe.push(args[i]);
            }
        }
    }

    function _eachInList( list, iteratee, thisArg ) {
        for( var i = 0, len = list.length; i < len ; i++ ) {
            iteratee.apply(thisArg, [ list[i], i ]);
        }
    }

    function _eachInObject( o, iteratee, thisArg ) {
        for( var key in o ) {
            iteratee.call(thisArg, [o[key], key]);
        }
    }

    function each (o, iteratee, thisArg) {
        if( _isArray(o) ) {
            _eachInList(o, iteratee, thisArg);
        } else if( _isObject(o) ) {
            _eachInObject(o, iteratee, thisArg);
        }
    }

    function indexOf (list, comparator) {

        if( _isFunction(comparator) ) {
            for( var i = 0, len = list.length; i < len; i++ ) {
                if( comparator(list[i]) ) {
                    return i;
                }
            }
        } else return list.indexOf(comparator);

        return -1;
    }

    function remove (list, comparator) {

        var i, len;

        if( _isFunction(comparator) ) {
            for( i = 0, len = list.length; i < len; i++ ) {
                if( comparator(list[i]) ) {
                    list.splice(i, 1);
                    i--;
                }
            }
        } else {
            for( i = 0, len = list.length; i < len; i++ ) {
                if( list[i] === comparator ) {
                    list.splice(i, 1);
                    i--;
                }
            }
        }
    }

    function matchAll (o, filters) {
        for( var key in filters ) {
            if( o[key] !== filters[key] ) {
                return false;
            }
        }
        return true;
    }

    function matchAny (o, filters) {
        for( var key in filters ) {
            if( o[key] === filters[key] ) {
                return true;
            }
        }
        return false;
    }

    function find (list, filters) {
        for( var i = 0, len = list.length ; i < len ; i++ ) {
            if( matchAll(list[i], filters) ) {
                return list[i];
            }
        }

        return false;
    }

    function filter (list, filters) {
        var newList = [];

        for( var i = 0, len = list.length ; i < len ; i++ ) {
            if( matchAll(list[i], filters) ) {
                newList.push(list[i]);
            }
        }

        return newList;
    }

    var _Funcs = {

			// Type Functions
				isType: _isType,
				isObject: _isObject,
				isFunction: _isFunction,
				isString: _isString,
				isNumber: _isNumber,
				isArray: _isArray,
				isDate: _isDate,
				isRegExp: _isRegExp,
				isElement: _isElement,

				key: _key,
    		keys: Object.keys,

        extend: _extend,
    		merge: _merge,
        copy: _copy,

        matchAll: matchAll,
        matchAny: matchAny,
        find: find,
        filter: filter,

        joinPath: joinPath,

        each: each,
        indexOf: indexOf,
        remove: remove,

        pipe: function () {
            var pipe = [];

            _addToPipe(pipe, arguments);

            var pipeFn = function () {
                return _proccessPipe(pipe, arguments);
            };

            pipeFn.pipe = function () {
                _addToPipe(pipe, arguments);
                return pipeFn;
            };

            return pipeFn;
        },
        chain: function (value) {
            return new Chain(value);
        }
		};

    function Chain (value) {
        this.value = value;
    }

    _eachInList(['key', 'keys', 'each', 'indexOf', 'remove'], function (nameFn) {
        Chain.prototype[nameFn] = function () {
            [].unshift.call(arguments, this.value);
            _[nameFn].apply(null, arguments);
        };
    });

    function _ (value) {
        return new Chain(value);
    }

    _extend(_, _Funcs);

	return _;

});
