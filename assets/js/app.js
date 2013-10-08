$(function(){
    "use strict";
    var config = {
        pathViewFolder: '/assets/views/'
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
            routeName: 'lesson'
        },
        students: {
            routeName: 'students'
        },
        student: {
            routeName: 'student',
            routeMethod: ['edit', 'view']
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
                var hash = can.route._getHash();
                var idActiveMenuItem = menuData.menuItems[0].id;
                if(hash !== '')
                {
                    can.each(menuData.menuItems, function(item){
                        if(hash.indexOf(item.url) !== -1)
                            idActiveMenuItem = item.id;
                    });
                }
                this.setActiveMenuItem($('#' + idActiveMenuItem, this.element));
            },
            '.{menuItemClass} click': function($el) {
                this.setActiveMenuItem($el);
            },
            setActiveMenuItem: function($el) {
                var opt = this.options;
                $('.' + opt.activeClassName, this.element).removeClass(opt.activeClassName);
                $('.' + opt.arrowActiveMenuClassName, this.element).addClass(opt.hideClass);
                $el.addClass(opt.activeClassName);
                $('.' + opt.arrowActiveMenuClassName, $el).removeClass(opt.hideClass);
            }
    });

    // Модель текстовки сайта
    var PageContentModel = can.Model({
        findAll: 'GET /info',
        findOne: 'GET /info/{pageName}'
    }, {});
    can.fixture('GET /info', function(){
        return [PAGE_CONTENT];
    });
    can.fixture('GET /info/{pageName}', function(request){
        return PAGE_CONTENT[request.data.pageName];
    });

    // Модель взятия лекций
    var LessonsModel = can.Model({
        findAll: 'GET /lessons',
        findOne: 'GET /lesson/{id}'
    }, {});
    can.fixture('GET /lessons', function(){
        return LESSONS;
    });
    can.fixture('GET /lesson/{id}', function(request){
        return LESSONS[request.data.id - 1];
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

    // Отслеживание изменения хеша и обработка событий по ним
    var Router = can.Control.extend({
        init: function() {
            can.route(":page/:action/:param");
        },
        'route': function(){
            this.renderIndexPage();
        },
        '{index.routeName} route': function(){
            this.renderIndexPage();
        },
        '{students.routeName} route' : function(){
            this.element.empty();
            console.log("the hash is #!active");
        },
        '{lessons.routeName} route' : function(){
            var pages = this.options;
            var $el = this.element;
            $el.empty();
            can.when(PageContentModel.findOne({pageName: 'lessons'}), LessonsCategoryModel.findAll(), LessonsModel.findAll())
               .then(function(reqPageContent, reqLessonsCategoryArray, reqLessonsArray){
                    var tempParam = {
                        pageContent: reqPageContent,
                        lessonsCategoryArray: reqLessonsCategoryArray,
                        lessonsArray: reqLessonsArray
                    };
                    var pageFragment = can.view(config.pathViewFolder + pages.lessons.template, tempParam);
                    $el.html(pageFragment);
                });

        },
        renderIndexPage: function() {
            var pages = this.options;
            var $el = this.element;
            $el.empty();
            PageContentModel.findOne({pageName: 'index'}, function(pageContent){
                var pageFragment = can.view(config.pathViewFolder + pages.index.template, pageContent);
                $el.html(pageFragment);
            });
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

   // can.route( "#!content/:type" );
   // can.route.attr( "type", "songs" );

    //can.route.ready(false);
    //can.route.ready(true);
    //    can.route.attr({type: 'pages', id: 5}, true)

});
