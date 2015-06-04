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


(function (root) {

  if( !root.$ ) {
    return;
  }

  var jq = root.$,
      $doc = jq(document);

  jq.plugin = function (selector, handler, collection) {
    if( typeof selector === 'string' && handler instanceof Function ) {
      jq.plugin.cache[selector] = handler;
      jq.plugin.cache[selector]._collection = !!collection;
    }

    if( jq.plugin.ready ) {
      jq.plugin.run($doc, selector);
    } else if( !jq.plugin.loading ) {
      jq.plugin.loading = true;
      jq.plugin.init($doc);
    }
  };
  jq.plugin.loading = false;
  jq.plugin.cache = {};
  jq.plugin.run = function (jBase, pluginSelector) {

    var handler = jq.plugin.cache[pluginSelector],
        elements = jBase.find(pluginSelector);

    if( elements.length ) {
      if( handler._collection ) {
        handler( elements );
      } else {
        elements.each(handler);
      }
    }
  };

  jq.plugin.init = function (jBase) {
    jq(function () {
      for( var pluginSelector in jq.plugin.cache ) {
        jq.plugin.run(jBase, pluginSelector);
      }
      jq.plugin.loading = false;
      jq.plugin.ready = true;
    });
  };

  function jqWidget (widgetName, handler) {
    if( typeof widgetName === 'string' && handler instanceof Function ) {

      jqWidget.widgets[widgetName] = handler;

      if( jqWidget.enabled ) {
        console.log('running widget directly', widgetName);
        jq('[data-widget="' + widgetName + '"]').each(handler);
      } else if( !jqWidget.loading ) {
        jqWidget.loading = true;
        jqWidget.init();
      }
    }
  }

  jqWidget.init = function () {
    jq(function () {
      jq.plugin('[data-widget]', function () {
        var widgetName = this.getAttribute('data-widget');

        console.log('running widget', widgetName);

        if( jqWidget.widgets[widgetName] ) {
          jqWidget.widgets[widgetName].call(this);
        }
      });
      jqWidget.loading = false;
      jqWidget.enabled = true;
    });
  };
  jqWidget.widgets = {};

  jq.widget = jqWidget;

  var jqHtml = jq.fn.html;

  jq.fn.html = function (html) {
    var result = jqHtml.apply(this, arguments);

    if(html) {
      jq.plugin.init(this);
    }

    return result;
  };

})(this);
