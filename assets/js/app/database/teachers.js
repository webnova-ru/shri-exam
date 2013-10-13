define(['can', 'fixture'], function(){
    'use strict';

    var TEACHERS = [
        {
            id: 1,
            name: 'Виктор Ашик'
        },
        {
            id: 2,
            name: 'Сергей Сергеев'
        },
        {
            id: 3,
            name: 'Игорь Новак'
        },
        {
            id: 4,
            name: 'Роман Андриади'
        },
        {
            id: 5,
            name: 'Евгений Дорошенко'
        },
        {
            id: 6,
            name: 'Алексей Бережной'
        },
        {
            id: 7,
            name: 'Денис Бугарчев'
        }
    ];

    can.fixture('GET /teachers', function(){
        return TEACHERS;
    });
    can.fixture('GET /teacher/{id}', function(request){
        return TEACHERS[request.data.id - 1];
    });

    return TEACHERS;
});
