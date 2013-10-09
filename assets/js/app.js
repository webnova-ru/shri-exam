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
                edit: 'edit',
                view: 'view'
            },
            template: 'student.ejs'
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
        storageName: 'students',
        initLocalStorageData: function() {
            var storageName = this.storageName;
            if(!window.localStorage[storageName])
            {
               /* can.ajax({
                    url: '/students/full-info',
                    success: function(data) {
                        console.log('--' + data);
                        window.localStorage[storageName] = JSON.stringify(data);
                    }
                }); */
                window.localStorage[storageName] = JSON.stringify(STUDENTS);
            }
        }
    },{});
    StudentsModel.initLocalStorageData();
    can.fixture('GET /students/full-info', function() {
        return STUDENTS;
    });

    //StudentsModel.initLocalStorageData(STUDENTS);
    StudentsModel.findAll({}, function(data){
       /* data[0].attr({
            first_name: 'Хуита'
        });
        data[0].save();*/
        //console.log(data[0]);
    });
   /* var tt = new StudentsModel({
        about: 'ffgg',
        first_name: 'dfdf',
        last_name: 'yjjk'
    });
    console.log(tt);*/
    //console.log(StudentsModel);

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
        '{student.routeName}/{student.routeAction.create} route' : function(){
            this.toggleLoadAndContent();
            console.log("the hash is #!active");
        },
        '{student.routeName}/{student.routeAction.view}/:param route' : function(urlParam){
            this.toggleLoadAndContent();
            console.log("the hash is #!active" + urlParam.param);
        },
        '{student.routeName}/{student.routeAction.edit}/:param route' : function(urlParam){
            this.toggleLoadAndContent();
            console.log("the hash is #!active" + urlParam.param);
        },
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
                    for(var i = 0, len = reqStudentsArray.length, flag1 = 1, flag2 = 1; i < len; i++)
                    {
                        if(flag1 % 4)
                        {
                            stud1[flag1 - 1] = reqStudentsArray[i];
                            flag1++;
                        }
                        else
                        {
                            if(flag2 % 5)
                            {
                                stud2[flag2 - 1] = reqStudentsArray[i];
                                flag2++;
                            }
                            else
                            {
                                flag2 = flag1 = 1;
                                studentsArray.push([stud1, stud2]);
                                stud1 = [null, null, null];
                                stud2 = [null, null, null, null];
                            }
                        }
                    }

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
