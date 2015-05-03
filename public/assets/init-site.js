
  $.plugin('code', function() {
    if( this.parentNode.nodeName !== 'A' ) {
      hljs.highlightBlock(this);
    }
  } );


  $(function () {

    var jBody = $(document.body);

    jBody.click(function (e) {
      jBody.removeClass('show-nav');
    });

    $('#header .logo-link').click(function (e) {

      if (window.matchMedia("(max-width: 768px)").matches) {
        e.stopPropagation();
        e.preventDefault();
        jBody.addClass('show-nav');
      }
    });

  });
