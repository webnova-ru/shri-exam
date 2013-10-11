define(['can', 'fixture'], function(){
    'use strict';

    var LESSONS_CATEGORY = [
        {
            id: 1,
            name: 'Инструменты разработки'
        },
        {
            id: 2,
            name: 'Технология разработки UI'
        },
        {
            id: 3,
            name: 'Языки программирования'
        }
    ];

    can.fixture('GET /category', function(){
        return LESSONS_CATEGORY;
    });
    can.fixture('GET /category/{id}', function(request){
        return LESSONS_CATEGORY[request.data.id - 1];
    });

    return LESSONS_CATEGORY;
});
