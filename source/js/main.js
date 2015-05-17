$(function(){
    $('body').scrollspy({
        offset: 80
    });
    $('#chapter-selector').on('change', function(event){
        window.location.href = $(this).val();
    })
});