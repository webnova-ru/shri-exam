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
            routeMethod: 'list'
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
                url: ''
            },
            {
                text: 'Студенты',
                desc: 'Список учащихся',
                id: 'js-menu-students',
                url: 'students'
            },{
                text: 'Лекции',
                desc: 'Записи видео лекций',
                id: 'js-menu-lessons',
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
            console.log("the hash is #!active");
           // this.element.remove();
        },
        '{lessons.routeName} route' : function(){
            console.log("the hash is #!project/create")
        },
        renderIndexPage: function() {
            var pages = this.options;
            var contentFragment = can.view(config.pathViewFolder + pages.index.template, INFO_PAGE_CONTENT);
            this.element.html(contentFragment);
        }
    });

    var App = {
        config: {
            contentClass: 'content',
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
