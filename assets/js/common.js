require.config({

    baseUrl: 'assets/js',

    paths : {
        jquery : "//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min",
        can: 'libs/can.jquery',
        canObject: 'libs/can.object',
        fixture: 'libs/can.fixture',
        canLocalStorage: 'libs/can.localstorage',
        formNova: 'plugins/formNova/formNova'
    },

    shim: {
        'can': {
            deps: ['jquery'],
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
        },
        'formNova': {
            deps: ['jquery']
        }
    }
});

// запучкаем приложение из файла app.js
define(['app'], function () {});



