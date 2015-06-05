/*
 * promise.js
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

  if ( typeof module !== 'undefined' ) {
    module.exports = factory(root);
  } else {
    if ( root.define ) {
      root.define('$promise', function () { return factory(root); } );
    } else if ( root.angular ) {
        var $promise = factory(root);
        root.angular.module('jstools.promise', [])
          .provider('$promise', function () {
            this.config = function (configFn) {
              configFn.call(null, $promise);
            };

            this.$get = function () {
              return $promise;
            };
          });
    } else if( !root.$promise ) {
      root.$promise = factory(root);
    }
  }

})(this, function (root) {

	function processPromise (promise, handler) {
		if( handler instanceof Function ) {
			setTimeout(function () {
				handler.apply(promise, [function (result) {
					promise.resolve(result);
				}, function (result) {
					promise.reject(result);
				}]);
			}, 0);
		}
	}

	function getStep(queue, action) {
		var step = queue.shift();

		while( queue.length ) {
			if( step[action] ) {
				return step;
			}
			step = queue.shift();
		}

		return (step && step[action]) ? step : false;
	}

	var actionByStatus = {
		fulfilled: 'then',
		rejected: 'catch'
	};

	function processResult (promise, status, value) {


		var action = actionByStatus[ status ],
			  step = getStep(promise.queue, action);

    if( step ) {
			promise['[[PromiseStatus]]'] = status;
			if( value !== undefined ) {
				promise['[[PromiseValue]]'] = value;
			}
		} else if( promise['[[PromiseStatus]]'] === 'rejected' ) {
			throw new Error('unhandled promise');
		} else {
			step = promise.queue.finally.shift();

			while( step ) {
				step(value);
				step = promise.queue.finally.shift();
			}

			step = false;
		}

		if( step && step[action] ) {

			try {
				var newValue = step[action].call(promise, value);
				promise['[[PromiseStatus]]'] = 'fulfilled';
			} catch(err) {
				promise['[[PromiseStatus]]'] = 'rejected';
				promise['[[PromiseValue]]'] = err;
				newValue = err;
			}

			if( newValue && newValue.then instanceof Function ) {

				newValue.then(function (result) {
					promise.resolve( result );
				}, function (reason) {
					promise.reject( reason );
				});

			} else {

				switch ( promise['[[PromiseStatus]]'] ) {
					case 'fulfilled':
						promise.resolve( newValue === undefined ? value : newValue );
						break;
					case 'rejected':
						promise.reject( newValue === undefined ? value : newValue );
						break;
				}
			}

		}

		return promise;
	}

	function initPromise(promise, handler) {
		promise.queue = [];
		promise.queue.finally = [];

		/*jshint validthis: true */
		promise['[[PromiseStatus]]'] = 'pending';
		promise['[[PromiseValue]]'] = undefined;

		processPromise(promise, handler);
	}

	function P(handler) {

		/*jshint validthis: true */
		if( this === undefined || this === root ) {
			return new P(handler);
		} else {
			initPromise(this, handler);
		}
	}

	P.prototype.then = function (onFulfilled, onRejected) {
		this.queue.push({
			then: ( onFulfilled instanceof Function ) ? onFulfilled : false,
			catch: ( onRejected instanceof Function ) ? onRejected : false
		});

		return this;
	};

	P.prototype.catch = function (onRejected) {
		this.then(undefined, onRejected);

		return this;
	};

	P.prototype.finally = function (onFulfilled) {
		if( onFulfilled instanceof Function ) {
			this.queue.finally.push(onFulfilled);
		}

		return this;
	};

	P.prototype.resolve = function (value) {
		return processResult(this, 'fulfilled', value);
	};

	P.prototype.reject = function (reason) {
		return processResult(this, 'rejected', reason);
	};

  P.resolve = function (value) {
    return P(function (resolve, reject) {
      resolve(value);
    });
  };

  P.reject = function (reason) {
    return P(function (resolve, reject) {
      reject(reason);
    });
  };

	P.defer = function () {
		var deferred = new P();
		deferred.promise = deferred;
		return deferred;
	};

	P.when = function (promise) {
		return P(function (resolve, reject) {
			if( promise && promise.then ) {
				promise.then(resolve, reject);
			} else {
				resolve(promise);
			}
		});
	};

	P.all = function (promisesList) {

		promisesList = ( promisesList instanceof Array ) ? promisesList : [];

    var pending = promisesList.length, promisesResult = [];
    promisesResult.length = promisesList.length;

		return new P(function (resolve, reject) {

			if( !pending ) {
				resolve([]);
				return;
			}

			promisesList.forEach(function (promise, index) {
				if( promise instanceof Object && promise.then ) {

          if( promise['[[PromiseStatus]]'] === 'fulfilled' ) {
            promisesResult[index] = promise['[[PromiseValue]]'];
            pending--;

            if( !pending ) {
                resolve(promisesResult);
            }
      		} else if( promise['[[PromiseStatus]]'] === 'reject' ) {
            reject(promise['[[PromiseValue]]']);
      		} else {
  					promise.then(function (result) {

  						promisesResult[index] = result;
              pending--;

  						if( !pending ) {
              		resolve(promisesResult);
  						}

  					}, reject);
          }

				} else {
          promisesResult[index] = promise;
          pending--;

          if( !pending ) {
              resolve(promisesResult);
          }
				}
			});
		});

	};

	return P;

});
