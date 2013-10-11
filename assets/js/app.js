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
                view: 'view',
                edit: 'edit'
            },
            template: 'student.ejs',
            templateEditStudent: 'studentEdit.ejs',
            templateNewStudent: 'studentNew.ejs'
        }
    };

    var Menu = can.Control.extend({
            defaults: {
                template: 'menu.ejs',

                menuItemClass: 'js-menu_item',
                activeClassName: 'menu_item--active',
                arrowActiveMenuClassName: 'menu_item_arrow',
                hideClass: '_hide',

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
                can.each(opt.menuItems, function(item) {
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

    // пространство имён для моделей
    var models = {};

    // Модель текстовки сайта
    models.PageContent = can.Model({
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
    models.Teachers = can.Model({
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
    models.LessonsCategory = can.Model({
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
     models.Lessons = can.Model({
        findAll: 'GET /lessons',
        findOne: 'GET /lesson/{id}'
    }, {});
    can.fixture('GET /lessons', function() {
        return getFullLessonsInfo(LESSONS, LESSONS_CATEGORY, TEACHERS);
    });
    can.fixture('GET /lesson/{id}', function(request) {
        return getFullLessonsInfo(LESSONS[request.data.id - 1], LESSONS_CATEGORY, TEACHERS)[0];
    });

    // функция получения полной информации о лекции. Подобие JOIN-а таблиц из SQL
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

    // Модель студентов
    models.Students = can.Model.LocalStorage({
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
    models.Students.initLocalStorageData(STUDENTS);

    can.fixture('GET /students/full-info', function() {
        return STUDENTS;
    });

    // Контроллер уведомлений о событиях работы с моделями данных
    var Note = can.Control.extend({
        defaults: {
            activeClass: 'note--active',
            innerId: 'js-note_inner',
            timeShowMsg: 2800,

            messages: {
                studentAdd: 'Новый студент успешно добавлен',
                studentUpdate: 'Данные о студенте изменены',
                studentDel: 'Студент удалён'
            }
        }
    },{
        init: function() {
            this.$textElem = $('#' + this.options.innerId, this.element);
        },
        '{models.Students} created': function() {
            this.showNote(this.options.messages.studentAdd);
        },
        '{models.Students} updated': function() {
            this.showNote(this.options.messages.studentUpdate);
        },
        '{models.Students} destroyed': function() {
            this.showNote(this.options.messages.studentDel);
        },

        // показывает уведомление с текстом из параметра
        showNote: function(text) {
            this.$textElem.text(text);
            this.element.addClass(this.options.activeClass);

            var self = this;
            setTimeout(function() {
                self.element.removeClass(self.options.activeClass);
            }, this.options.timeShowMsg);
        }
    });

    // Контроллер контента страницы, отслеживание изменения хеша и обработка событий по ним
    var Content = can.Control.extend({
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
                tempEditForm: config.pathViewFolder + pages.student.templateEditStudent,
                listUrl: '#!' + pages.students.routeName
            };
            var pageFragment = can.view(config.pathViewFolder + pages.student.templateNewStudent, tempParam);
            self.toggleLoadAndContent(pageFragment);

            // назначаем валидатор на форму
            self.setValidatorForForm(undefined);

            // назначаем кнопку назад
            var goBackButton = $('#js-go-to-view', this.element);
            goBackButton.on('click', function(e){
                e.preventDefault();
                location.hash = '#!' + pages.students.routeName;
            });
        },

        // Страница просмотра анкеты студента
        '{student.routeName}/:action/:param route' : function(urlParam) {
            this.toggleLoadAndContent();
            var pages = this.options;
            var self = this;
            var studId = parseInt(urlParam.param);

            models.Students.findAll({}, function(studentsArray) {

                // находим нужный нам объект студента с id из параметра урла
                var studentInfo = null;
                for(var i = 0, len = studentsArray.length; i < len; i++)
                {
                    if(studentsArray[i].id === studId)
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
                    state: 'view',
                    tempEditForm: config.pathViewFolder + pages.student.templateEditStudent,

                    viewUrl: can.route.url({ page: pages.student.routeName, action: pages.student.routeMethod.view, param: studentInfo.id}),
                    editUrl: can.route.url({ page: pages.student.routeName, action: pages.student.routeMethod.edit, param: studentInfo.id}),
                    listUrl: '#!' + pages.students.routeName
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

                // назначаем кнопки просмотра/редактирования анкеты студента
                var $viewButton = $('#js-view-student', self.element);
                var $editButton = $('#js-edit-student', self.element);
                var $studentEditForm = $('#js-student-edit', self.element);
                var $studentFullInfo = $('#js-student-info', self.element);

                if(urlParam.action === pages.student.routeMethod.view)
                {
                    $studentEditForm.hide();
                    $viewButton.addClass('-btn--active');
                }
                if(urlParam.action === pages.student.routeMethod.edit)
                {
                    $studentFullInfo.hide();
                    $editButton.addClass('-btn--active');
                }
            });
        },

        // валидатор для формы
        setValidatorForForm: function(studItem) {
            var pages = this.options;

            var form = $('[data-validate="formNova"]');
            form.formNova();
            form.formNova('config', {
                isSubmit: false,
                beforeSubmit: function() {
                    var resFormValue = {};
                    can.each(form.serializeArray(), function(obj) {
                        resFormValue[obj.name] = obj.value;
                    });

                    var studItemCopy = studItem;

                    if(studItemCopy)
                        studItemCopy.attr(resFormValue).save();
                    else
                    {
                        studItemCopy = new models.Students(resFormValue);
                        studItemCopy.save();
                    }
                    location.hash = can.route.url({ page: pages.student.routeName, action: pages.student.routeMethod.view, param: studItemCopy.id})
                }
            });
        },

        // страница со списком студентов
        '{students.routeName} route' : function() {
            var pages = this.options;
            var self = this;

            this.toggleLoadAndContent();

            can.when(models.PageContent.findOne({pageName: 'students'}), models.Students.findAll())
               .then(function(reqPageContent, reqStudentsArray) {

                    // подготавливаем массив данных для шаблона (нужно для вывода сетки из сот)
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

        // страница показа одной лекции
        '{lesson.routeName}/{lesson.routeMethod}/:param route' : function(urlParam){
            var pages = this.options;
            var self = this;

            this.toggleLoadAndContent();

            models.Lessons.findOne({id: urlParam.param}, function(lessonInfo){
                var pageFragment = can.view(config.pathViewFolder + pages.lesson.template, lessonInfo);
                self.toggleLoadAndContent(pageFragment);

                var form = $('[data-validate="formNova"]');
                form.formNova();
                form.formNova('config', {
                    isSubmit: false,
                    beforeSubmit: function() {

                    }
                });
            });
        },

        // страница со списком лекций
        '{lessons.routeName} route' : function() {
            var pages = this.options;
            var self = this;

            this.toggleLoadAndContent();

            can.when(models.PageContent.findOne({pageName: 'lessons'}), models.LessonsCategory.findAll(), models.Lessons.findAll())
               .then(function(reqPageContent, reqLessonsCategoryArray, reqLessonsArray) {

                    // собираем данные для шаблона, рендрим его и пихаем на страницу
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
        'route': function() {
            this.renderIndexPage();
        },
        '{index.routeName} route': function() {
            this.renderIndexPage();
        },

        // функция показа главной страницы
        renderIndexPage: function() {
            var pages = this.options;
            var self = this;

            this.toggleLoadAndContent();

            // идём за данными для страницы, пихаим их в шаблон и рендрим страницу
            models.PageContent.findOne({pageName: 'index'}, function(pageContent){
                var pageFragment = can.view(config.pathViewFolder + pages.index.template, pageContent);
                self.toggleLoadAndContent(pageFragment);
            });
        },

        // переключаемся между состоянием загрузки страницы и наличием контента на ней
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
            menuClass: 'js-menu',
            noteId: 'js-note'
        },
        init: function() {
            new Content('.' + this.config.contentClass, pages);
            new Menu('.' + this.config.menuClass);
            new Note('#' + this.config.noteId, {models: models});
        }
    };
    App.init();
});
