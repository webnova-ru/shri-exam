define(["config","controls/menu","controls/content","controls/note","models/models","can"],function(n,e,o,t,i){$(function(){var a={init:function(){new o(".js-content",{pages:n.pages,models:i,viewPath:n.viewPath}),new e(".js-menu",{menu:n.menu,viewPath:n.viewPath}),new t("#js-note",{models:i})}};can.route.ready(!1),a.init(),can.route.ready(!0)})});