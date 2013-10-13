define(['database/students', 'database/pageContent', 'database/lessons', 'canLocalStorage'], function(STUDENTS) {
    'use strict';

    // пространство имён для моделей
    var models = {};

    // Модель текстовки сайта
    models.PageContent = can.Model({
        findAll: 'GET /info',
        findOne: 'GET /info/{pageName}'
    }, {});

    // Модель взятия лектора
    models.Teachers = can.Model({
        findAll: 'GET /teachers',
        findOne: 'GET /teacher/{id}'
    }, {});

    // Модель взятия категорий лекций
    models.LessonsCategory = can.Model({
        findAll: 'GET /category',
        findOne: 'GET /category/{id}'
    }, {});

    // Модель взятия лекций
    models.Lessons = can.Model({
        findAll: 'GET /lessons',
        findOne: 'GET /lesson/{id}'
    }, {});

    // Модель студентов
    models.Students = can.Model.LocalStorage({
        storageName: 'students_tag',
        initLocalStorageData: function(data) {
            var storageName = this.storageName;

            if(!window.localStorage[storageName])
                window.localStorage[storageName] = JSON.stringify(data);
        }
    },{});
    models.Students.initLocalStorageData(STUDENTS);

    // Модель комментария
    models.Comments = can.Model.LocalStorage({
        storageName: 'comment_tag'
    },{});

    return models;
});
