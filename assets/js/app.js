$(function(){
    "use strict";
    var config = {
        pathViewFolder: '/assets/views/',
        ServerRequestDelay: 1000
    };
    var pages = {
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
            template: 'lesson.ejs'
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
                view: 'view'
            },
            template: 'student.ejs',
            templateEditStudent: 'studentEdit.ejs',
            templateNewStudent: 'studentNew.ejs'
        }
    }

    var menuData = {
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
            },{
                text: 'Лекции',
                desc: 'Записи видео лекций',
                id: 'js-menu-lessons',
                iconClass: 'icon-film',
                url: 'lessons'
            }]
    };

    var Menu = can.Control.extend({
            defaults: {
                menuItemClass: 'js-menu_item',
                activeClassName: 'menu_item--active',
                arrowActiveMenuClassName: 'menu_item_arrow',
                hideClass: '_hide'
            }
        }, {
            init: function(element, menuData) {
                var menuFragment = can.view(config.pathViewFolder + menuData.template, menuData.menuItems);
                this.element.html(menuFragment);

                can.route.bind('change', can.proxy(this.setActiveMenuItem, this));
            },
            setActiveMenuItem: function() {
                var opt = this.options;
                $('.' + opt.activeClassName, this.element).removeClass(opt.activeClassName);
                $('.' + opt.arrowActiveMenuClassName, this.element).addClass(opt.hideClass);

                var hash = can.route._getHash();
                if(hash === '')
                {
                    this.lightActiveItem(opt.menuItems[0].id);
                    return;
                }
                var self = this;
                can.each(opt.menuItems, function(item){
                    if(item.url && (hash === item.url || hash.indexOf(item.url + '/') !== -1))
                        self.lightActiveItem(item.id);
                });

            },
            lightActiveItem: function(id) {
                var $el = $('#' + id, this.element);
                var opt = this.options;
                $el.addClass(opt.activeClassName);
                $('.' + opt.arrowActiveMenuClassName, $el).removeClass(opt.hideClass);
            }
    });

    // Модель текстовки сайта
    var PageContentModel = can.Model({
        findAll: 'GET /info',
        findOne: 'GET /info/{pageName}'
    }, {});
    can.fixture.delay = config.ServerRequestDelay;
    can.fixture('GET /info', function(){
        return [PAGE_CONTENT];
    });
    can.fixture('GET /info/{pageName}', function(request){
        return PAGE_CONTENT[request.data.pageName];
    });

    // Модель взятия лектора
    var TeachersModel = can.Model({
        findAll: 'GET /teachers',
        findOne: 'GET /teacher/{id}'
    }, {});
    can.fixture('GET /teachers', function(){
        return TEACHERS;
    });
    can.fixture('GET /teacher/{id}', function(request){
        return TEACHERS[request.data.id - 1];
    });

    // Модель взятия категорий лекций
    var LessonsCategoryModel = can.Model({
        findAll: 'GET /category',
        findOne: 'GET /category/{id}'
    }, {});
    can.fixture('GET /category', function(){
        return LESSONS_CATEGORY;
    });
    can.fixture('GET /category/{id}', function(request){
        return LESSONS_CATEGORY[request.data.id - 1];
    });

    // Модель взятия лекций
    var LessonsModel = can.Model({
        findAll: 'GET /lessons',
        findOne: 'GET /lesson/{id}'
    }, {});
    function getFullLessonsInfo(lessons, category, teachers) {
        var lessonsArray = $.isPlainObject(lessons)? [lessons]: lessons;
        return lessonsArray.map(function(lesson) {
            var lessonCopy = can.extend({}, lesson);
            lessonCopy.category = category.filter(function(cat){
                return cat.id === lessonCopy.categoryId
            })[0];
            lessonCopy.category = lessonCopy.category.name;
            lessonCopy.teacher = teachers.filter(function(teacher){
                return teacher.id === lessonCopy.teacherId
            })[0];
            lessonCopy.teacher = lessonCopy.teacher.name;
            return lessonCopy;
        });
    }
    can.fixture('GET /lessons', function() {
        return getFullLessonsInfo(LESSONS, LESSONS_CATEGORY, TEACHERS);
    });
    can.fixture('GET /lesson/{id}', function(request) {
        return getFullLessonsInfo(LESSONS[request.data.id - 1], LESSONS_CATEGORY, TEACHERS)[0];
    });

    // Модель студентов
    var StudentsModel = can.Model.LocalStorage({
        storageName: 'LS_Tags',
        initLocalStorageData: function(data) {
            var storageName = this.storageName;
            if(!window.localStorage[storageName])
            {
                /*can.ajax({
                    url: '/students/full-info',
                    success: function(data) {
                        window.localStorage[storageName] = JSON.stringify(data);
                    }
                }); */
                window.localStorage[storageName] = JSON.stringify(data);
            }
        }
    },{});
    StudentsModel.initLocalStorageData(STUDENTS);
    can.fixture('GET /students/full-info', function() {
        return STUDENTS;
    });

    // Отслеживание изменения хеша и обработка событий по ним
    var Router = can.Control.extend({
        defaults: {
            preloaderClass: 'preloader',
            hideClass: '_hide',
            innerClass: 'js-content_inner'
        }
    },
    {
        init: function() {
            can.route(":page/:action/:param");

            this.$preloader = $('.' + this.options.preloaderClass, this.element);
            this.$contentInner = $('.' + this.options.innerClass, this.element);
        },

        // Страница создания нового студента
        '{student.routeName}/{student.routeMethod.create} route' : function(){
            this.toggleLoadAndContent();
            var pages = this.options;
            var self = this;

            // собираем данные для шаблона, рендрим его и пихаем на страницу
            var tempParam = {
                urlPageInfo: pages,
                state: 'create',
                tempEditForm: config.pathViewFolder + pages.student.templateEditStudent
            };
            var pageFragment = can.view(config.pathViewFolder + pages.student.templateNewStudent, tempParam);
            self.toggleLoadAndContent(pageFragment);

            // назначаем валидатор на форму
            self.setValidatorForForm();

            // назначаем кнопку назад
            var goBackToViewButton = $('#js-go-to-view', this.element);
            goBackToViewButton.on('click', function(e){
                e.preventDefault();
                location.hash = '#!' + pages.students.routeName;
            });
        },

        // Страница просмотра анкеты студента
        '{student.routeName}/{student.routeMethod.view}/:param route' : function(urlParam) {
            this.toggleLoadAndContent();
            var pages = this.options;
            var self = this;
            var studId = urlParam.param;

            StudentsModel.findAll({}, function(studentsArray) {

                // находим нужным нам объект студента по id
                var studentInfo = null;
                for(var i = 0, len = studentsArray.length; i < len; i++)
                {
                    if(studentsArray[i].id == studId)
                    {
                        studentInfo = studentsArray[i];
                        break;
                    }
                }
                if(studentInfo === null)
                    return;

                // собираем данные для шаблона, рендрим его и пихаем на страницу
                var tempParam = {
                    studentInfo: studentInfo,
                    urlPageInfo: pages,
                    state: 'view',
                    tempEditForm: config.pathViewFolder + pages.student.templateEditStudent
                };
                var pageFragment = can.view(config.pathViewFolder + pages.student.template, tempParam);
                self.toggleLoadAndContent(pageFragment);

                // назначаем валидатор на форму редактирования анкеты
                self.setValidatorForForm(studentInfo);

                // удаление студента
                var deleteStudentButton = $('#js-delete-student', this.element);
                deleteStudentButton.on('click', function(e){
                    e.preventDefault();
                    studentInfo.destroy(function() {
                        location.hash = '#!' + pages.students.routeName;
                    });
                });

                // назначаем действия на кнопки просмотра/редактирования анкеты студента
                var $viewEditGoBackButtons = $('#js-view-student, #js-edit-student, #js-go-to-view', self.element);
                var $studentEditForm = $('#js-student-edit', self.element);

                $studentEditForm.hide();
                $viewEditGoBackButtons.on('click', function(e) {
                    e.preventDefault();
                    $viewAndEditButton.toggleClass('-btn--active');
                    $studentEditForm.toggle();
                    $('#js-student-info').toggle();
                });
            });
        },

        // валидатор для формы
        setValidatorForForm: function(studItem) {
            var pages = this.options;

            var editStudentForm = $('[data-validate="formNova"]');
            editStudentForm.formNova();
            editStudentForm.formNova('config', {
                isSubmit: false,
                beforeSubmit: function() {
                    var resFormValue = {};
                    can.each(editStudentForm.serializeArray(), function(obj) {
                        resFormValue[obj.name] = obj.value;
                    });
                    if(studItem)
                        studItem.attr(resFormValue).save();
                    else
                        new StudentsModel(resFormValue).save();
                    location.hash = '#!' + pages.students.routeName;
                }
            });
        },

        // страница со списком студентов
        '{students.routeName} route' : function(){
            this.toggleLoadAndContent();

            var pages = this.options;
            var self = this;
            can.when(PageContentModel.findOne({pageName: 'students'}), StudentsModel.findAll())
               .then(function(reqPageContent, reqStudentsArray) {

                    // подготавливаем массив данных для шаблона
                    var studentsArray = [];
                    var stud1 = [null, null, null];
                    var stud2 = [null, null, null, null];
                    for(var i = 0, len = reqStudentsArray.length, rowCounter1 = 1, rowCounter2 = 1, flag = 0; i < len; i++)
                    {
                        var studItem  = reqStudentsArray[i];
                        if(rowCounter1 % 4)
                        {
                            stud1[rowCounter1 - 1] = studItem;
                            rowCounter1++;
                            flag++;
                        }
                        else
                        {
                            if(rowCounter2 % 5)
                            {
                                stud2[rowCounter2 - 1] = studItem;
                                rowCounter2++;
                                flag++;
                            }
                            else
                            {
                                rowCounter2 = rowCounter1 = 1;
                                flag = 0;
                                studentsArray.push([stud1, stud2]);
                                stud1 = [null, null, null];
                                stud2 = [null, null, null, null];
                            }
                        }
                    }
                    if(i && flag)
                        studentsArray.push([stud1, stud2]);

                    // собираем данные для шаблона, рендрим его и пихаем на страницу
                    var tempParam = {
                        pageContent: reqPageContent,
                        studentsArray: studentsArray,
                        pagesInfo: pages,
                        tempForHexagon: config.pathViewFolder + pages.students.templateForHexagon
                    };
                    var pageFragment = can.view(config.pathViewFolder + pages.students.template, tempParam);
                    self.toggleLoadAndContent(pageFragment);
               });
        },
        '{lesson.routeName}/{lesson.routeMethod}/:param route' : function(urlParam){
            var pages = this.options;
            this.toggleLoadAndContent();
            var self = this;
            LessonsModel.findOne({id: urlParam.param}, function(lessonInfo){
                var pageFragment = can.view(config.pathViewFolder + pages.lesson.template, lessonInfo);
                self.toggleLoadAndContent(pageFragment);
                $('[data-validate="formNova"]').formNova();
            });
        },
        '{lessons.routeName} route' : function(){
            this.toggleLoadAndContent();
            var pages = this.options;
            var self = this;
            can.when(PageContentModel.findOne({pageName: 'lessons'}), LessonsCategoryModel.findAll(), LessonsModel.findAll())
               .then(function(reqPageContent, reqLessonsCategoryArray, reqLessonsArray){
                    var tempParam = {
                        pageContent: reqPageContent,
                        lessonsCategoryArray: reqLessonsCategoryArray,
                        lessonsArray: reqLessonsArray,
                        pagesInfo: pages
                    };
                    var pageFragment = can.view(config.pathViewFolder + pages.lessons.template, tempParam);
                    self.toggleLoadAndContent(pageFragment);
                });

        },
        'route': function(){
            this.renderIndexPage();
        },
        '{index.routeName} route': function(){
            this.renderIndexPage();
        },
        renderIndexPage: function() {
            var pages = this.options;
            this.toggleLoadAndContent();
            var self = this;
            PageContentModel.findOne({pageName: 'index'}, function(pageContent){
                var pageFragment = can.view(config.pathViewFolder + pages.index.template, pageContent);
                self.toggleLoadAndContent(pageFragment);
            });
        },
        toggleLoadAndContent: function(fragment) {
            if(fragment)
            {
                this.$preloader.addClass(this.options.hideClass);
                this.$contentInner.html(fragment);
            }
            else
            {
                this.$contentInner.empty();
                this.$preloader.removeClass(this.options.hideClass);
            }
        }
    });

    var App = {
        config: {
            contentClass: 'js-content',
            menuClass: 'js-menu'
        },
        init: function() {
            new Router('.' + this.config.contentClass, pages);
            new Menu('.' + this.config.menuClass, menuData);
        }
    }
    App.init();
});
