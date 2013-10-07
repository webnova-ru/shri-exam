$(function(){
    "use strict";
    var config = {
        pathViewFolder: '/assets/views/'
    };
    var pages = {
        index: {
            routeName: 'info'
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
                url: pages.index.routeName
            },
            {
                text: 'Студенты',
                desc: 'Список учащихся',
                id: 'js-menu-students',
                url: pages.students.routeName
            },{
                text: 'Лекции',
                desc: 'Записи видео лекций',
                id: 'js-menu-lessons',
                url: pages.lessons.routeName
            }]
    };

    can.route(":page/:action/:param");

    var Menu = can.Control.extend({
            defaults: {
                menuItemClass: 'js-menu',
                activeClassName: 'menu_item--active',
                arrowActiveMenuClassName: 'menu_item_arrow'
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
                //console.log(can.route());
                //can.route.attr( "type", "songs" );
            },
            setActiveMenuItem: function($el) {
                var opt = this.options;
                $('.' + opt.activeClassName, this.element).removeClass(opt.activeClassName);
                $('.' + opt.arrowActiveMenuClassName, this.element).addClass('_hide');
                $el.addClass(opt.activeClassName);
                $('.' + opt.arrowActiveMenuClassName, $el).removeClass('_hide');
            }
    });
    var menu = new Menu('.menu', menuData);

    var Router = can.Control({
        "content/:type route" : function(){
            alert('fffdfvv');
        },
        "active route" : function(){
            console.log("the hash is #!active")
        },
        "project/create" : function(){
            console.log("the hash is #!project/create")
        }
    });

// make sure to initialize the Control
    new Router(document);


   // can.route( "#!content/:type" );
   // can.route.attr( "type", "songs" );

    //can.route.ready(false);
    //can.route.ready(true);
    //    can.route.attr({type: 'pages', id: 5}, true)

    //can.route("content/:type");

});
