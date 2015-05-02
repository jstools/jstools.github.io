
  $.plugin('code', function() {
    if( this.parentNode.nodeName !== 'A' ) {
      hljs.highlightBlock(this);
    }
  } );
