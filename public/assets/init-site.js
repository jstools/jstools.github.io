
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
      e.stopPropagation();
      e.preventDefault();
      jBody.addClass('show-nav');
    });

  });
