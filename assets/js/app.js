define(
['config',
 'controls/menu',
 'controls/content',
 'controls/note',
 'models/models',
 'can'
], function(config, Menu, Content, Note, models) {
    "use strict";

    $(function() {

        var App = {
            init: function() {
                new Content('.js-content', {pages: config.pages, models: models, viewPath: config.viewPath});
                new Menu('.js-menu', {menu: config.menu, viewPath: config.viewPath});
                new Note('#js-note', {models: models});
            }
        };

        // запускаем приложение
        can.route.ready(false);
        App.init();
        can.route.ready(true);
    });
});