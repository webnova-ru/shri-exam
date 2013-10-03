$(function(){
    $('[data-validate="formNova"]').formNova();

    $('#js-edit-student').on('click', function(){
        $('#js-view-student').toggleClass('-btn--active');
        $(this).toggleClass('-btn--active');
        $('.student-info-full').hide();
        $('.student-edit').show();
        return false;
    });
    $('#js-view-student').on('click', function(){
        $('#js-edit-student').toggleClass('-btn--active');
        $(this).toggleClass('-btn--active');
        $('.student-edit').hide();
        $('.student-info-full').show();
        return false;
    });
});
