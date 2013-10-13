({
    appDir:'.',
    mainConfigFile: 'assets/js/app/main.js',
    dir: "_build",
    modules: [
        {
            name: 'main'
        }
    ],
    fileExclusionRegExp: /^(\.git|\.idea|less|app\.build\.js|README\.md)$/,
    optimizeCss: "standard",
    optimize: "uglify2"
})
