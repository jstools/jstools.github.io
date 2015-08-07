
  $.plugin('code', function() {
    if( this.parentNode.nodeName !== 'A' ) {
      hljs.highlightBlock(this);
    }
  } );

  (function () {

    var RE_origin = new RegExp('^' + location.origin.replace(/\\/, '\\').replace(/\//, '\\\/') ),
        jBody = $(document.body);

    $.plugin('a', function (jLinks) {
      jLinks.click(function (e) {
        var link = this;

        if( RE_origin.test(link.href) ) {

            e.preventDefault();

            $('article.article').addClass('is-loading');
            $http(link.href).get()
              .then(function (response) {
                var bodyHTML = response.data.split(/\<\/?body[^>]*\>/)[1];
                jBody.html(bodyHTML);
                history.pushState({
                  body: bodyHTML
                }, 'jsTools', link.href.replace(RE_origin, '') );
              })
              .finally(function () {
                $('article.article').removeClass('is-loading');
              });
        }
      });
    }, true);

    $(window).on('popstate', function(event) {
      if( event.state && event.state.body ) {
        jBody.html(event.state.body);
      }
    });

  })();



  (function () {

    var jBody = $(document.body);

    jBody.click(function (e) {
      jBody.removeClass('show-nav');
    });

    // $.plugin('#libs-nav', function (jLinks) {
    //   jLinks.click(function (e) {
    //     e.stopPropagation();
    //   });
    // }, true);

    $.plugin('#header .logo-link', function (jLogoLink) {

      jLogoLink.click(function (e) {

        if (window.matchMedia("(max-width: 768px)").matches) {
          e.stopPropagation();
          e.preventDefault();

          if( jBody.hasClass('show-nav') ) {
            jBody.removeClass('show-nav');
          } else {
            jBody.addClass('show-nav');
          }
        }
      });

    }, true);


  })();
