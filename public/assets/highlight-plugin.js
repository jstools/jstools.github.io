
$(function () {
  $.plugin('code', function() {
    console.log(this);
    hljs.highlightBlock(this);
  } );
});
