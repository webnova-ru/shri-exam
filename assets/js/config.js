define([], function() {
    'use strict';

    var config = {
        viewPath: '/assets/views/',
        ServerRequestDelay: 1000,

        pages: {
            index: {
                routeName: '',
                template: 'info.ejs'
            },
            lessons: {
                routeName: 'lessons',
                routeMethod: 'list',
                template: 'lessons.ejs'
            },
            lesson: {
                routeName: 'lesson',
                routeMethod: 'view',
                template: 'lesson.ejs',
                templateComment: 'comment.ejs'
            },
            students: {
                routeName: 'students',
                template: 'students.ejs',
                templateForHexagon: 'hexagon.ejs'
            },
            student: {
                routeName: 'student',
                routeMethod: {
                    create: 'new',
                    view: 'view',
                    edit: 'edit'
                },
                template: 'student.ejs',
                templateEditStudent: 'studentEdit.ejs',
                templateNewStudent: 'studentNew.ejs'
            }
        },

        menu: {
            template: 'menu.ejs',
            menuItems: [
                {
                    text: 'О ШРИ',
                    desc: 'Информация о школе',
                    id: 'js-menu-info',
                    iconClass: 'icon-info-sign',
                    url: ''
                },
                {
                    text: 'Студенты',
                    desc: 'Список учащихся',
                    id: 'js-menu-students',
                    iconClass: 'icon-group',
                    url: 'students'
                },
                {
                    text: 'Лекции',
                    desc: 'Записи видео лекций',
                    id: 'js-menu-lessons',
                    iconClass: 'icon-film',
                    url: 'lessons'
                }
            ]
        },

        note: {
            timeShowMsg: 3000,

            messages: {
                studentAdd: 'Новый студент успешно добавлен',
                studentUpdate: 'Данные о студенте изменены',
                studentDel: 'Студент удалён',
                commentCreate: 'Комментарий добавлен',
                commentDel: 'Комментарий удалён'
            }
        }
    };

    return config;
});
