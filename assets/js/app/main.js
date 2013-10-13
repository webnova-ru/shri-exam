require.config({

    baseUrl: 'assets/js/app',

    paths : {
        can: '../libs/can.jquery',
        canObject: '../libs/can.object',
        fixture: '../libs/can.fixture',
        canLocalStorage: '../libs/can.localstorage',
        formNova: '../plugins/formNova/formNova'
    },

    shim: {
        'can': {
            exports: 'can'
        },
        'canObject' : {
            deps: ['can']
        },
        'fixture': {
            deps: ['canObject']
        },
        'canLocalStorage': {
            deps: ['can']
        }
    }
});

// запучкаем приложение из файла app.js
require(['app'], function () {});



