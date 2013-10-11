define(['can'], function(){
    'use strict';

    var Menu = can.Control.extend({
        defaults: {
            menuItemClass: 'js-menu_item',
            activeClassName: 'menu_item--active',
            arrowActiveMenuClassName: 'menu_item_arrow',
            hideClass: '_hide'
        }
    }, {
        init: function() {
            var opt = this.options;

            var menuFragment = can.view(opt.viewPath + opt.menu.template, opt.menu.menuItems);
            this.element.html(menuFragment);

            can.route.bind('change', can.proxy(this.setActiveMenuItem, this));
        },

        // устанавливает активный пунк меню в зависимости от текущего хеша
        setActiveMenuItem: function() {
            var opt = this.options;
            $('.' + opt.activeClassName, this.element).removeClass(opt.activeClassName);
            $('.' + opt.arrowActiveMenuClassName, this.element).addClass(opt.hideClass);

            var hash = can.route._getHash();
            if(hash === '')
            {
                this.lightActiveItem(opt.menu.menuItems[0].id);
                return;
            }
            var self = this;
            can.each(opt.menu.menuItems, function(item) {
                if(item.url && (hash === item.url || hash.indexOf(item.url + '/') !== -1))
                    self.lightActiveItem(item.id);
            });

        },

        // назначает подсветку пункта меню по id элемента
        lightActiveItem: function(id) {
            var $el = $('#' + id, this.element);
            var opt = this.options;
            $el.addClass(opt.activeClassName);
            $('.' + opt.arrowActiveMenuClassName, $el).removeClass(opt.hideClass);
        }
    });

    return Menu;
});
