
  $.plugin('code', function() {
    if( this.parentNode.nodeName !== 'A' ) {
      hljs.highlightBlock(this);
    }
  } );


  (function () {

    var jBody = $(document.body);

    jBody.click(function (e) {
      jBody.removeClass('show-nav');
    });

    $('#libs-nav').click(function (e) {
      e.stopPropagation();
    });

    $('#header .logo-link').click(function (e) {

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

  })();
