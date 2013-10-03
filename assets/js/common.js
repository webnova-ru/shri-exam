$(function(){
    $('[data-validate="formNova"]').formNova();

    // перейти на редактирование
    $('#js-edit-student').on('click', function(e){
        $('#js-view-student').toggleClass('-btn--active');
        $(this).toggleClass('-btn--active');
        $('.student-info-full').hide();
        $('.student-edit').show();
        return false;
    });

    // перейти на просмотр
    $('#js-view-student').on('click', function(e){
        $('#js-edit-student').toggleClass('-btn--active');
        $(this).toggleClass('-btn--active');
        $('.student-edit').hide();
        $('.student-info-full').show();
        return false;
    });
});
