$(function(){
   $('#chapter-selector').on('change', function(event){
       window.location.href = $(this).val();
   })
});