define(["can","formNova"],function(){var e=can.Control.extend({defaults:{preloaderClass:"preloader",hideClass:"_hide",innerClass:"js-content_inner"}},{init:function(){can.route(":page/:action/:param"),this.$preloader=$("."+this.options.preloaderClass,this.element),this.$contentInner=$("."+this.options.innerClass,this.element)},"{pages.student.routeName}/{pages.student.routeMethod.create} route":function(){this.toggleLoadAndContent();var e=this.options.pages,t=this,n={urlPageInfo:e,state:"create",tempEditForm:this.options.viewPath+e.student.templateEditStudent,listUrl:"#!"+e.students.routeName},o=can.view(this.options.viewPath+e.student.templateNewStudent,n);t.toggleLoadAndContent(o),t.setValidatorForForm(void 0);var s=$("#js-go-to-view",this.element);s.on("click",function(t){t.preventDefault(),location.hash="#!"+e.students.routeName})},"{pages.student.routeName}/:action/:param route":function(e){this.toggleLoadAndContent();var t=this.options.pages,n=this.options.models,o=this,s=parseInt(e.param);n.Students.findAll({},function(n){for(var a=null,i=0,r=n.length;r>i;i++)if(n[i].id===s){a=n[i];break}if(null===a)return console.log("такого студента нет"),void 0;var l={studentInfo:a,state:"view",tempEditForm:o.options.viewPath+t.student.templateEditStudent,viewUrl:can.route.url({page:t.student.routeName,action:t.student.routeMethod.view,param:a.id}),editUrl:can.route.url({page:t.student.routeName,action:t.student.routeMethod.edit,param:a.id}),listUrl:"#!"+t.students.routeName},d=can.view(o.options.viewPath+t.student.template,l);o.toggleLoadAndContent(d),o.setValidatorForForm(a);var u=$("#js-delete-student",this.element);u.on("click",function(e){e.preventDefault(),a.destroy(function(){location.hash="#!"+t.students.routeName})});var m=$("#js-view-student",o.element),c=$("#js-edit-student",o.element),p=$("#js-student-edit",o.element),h=$("#js-student-info",o.element);e.action===t.student.routeMethod.view&&(p.hide(),m.addClass("-btn--active")),e.action===t.student.routeMethod.edit&&(h.hide(),c.addClass("-btn--active"))})},setValidatorForForm:function(e){var t=this.options.pages,n=this.options.models,o=$('[data-validate="formNova"]');o.formNova(),o.formNova("config",{isSubmit:!1,beforeSubmit:function(){var s={};can.each(o.serializeArray(),function(e){s[e.name]=e.value});var a=e;a?a.attr(s).save():(a=new n.Students(s),a.save()),location.hash=can.route.url({page:t.student.routeName,action:t.student.routeMethod.view,param:a.id})}})},"{pages.students.routeName} route":function(){var e=this.options.pages,t=this.options.models,n=this;this.toggleLoadAndContent(),can.when(t.PageContent.findOne({pageName:"students"}),t.Students.findAll()).then(function(t,o){for(var s=[],a=[null,null,null],i=[null,null,null,null],r=0,l=o.length,d=1,u=1,m=0;l>r;r++){var c=o[r];d%4?(a[d-1]=c,d++,m++):(1==u&&console.log(a),u%5?(i[u-1]=c,u++,m++):(console.log(i),u=d=1,m=0,r--,s.push([a,i]),a=[null,null,null],i=[null,null,null,null]))}r&&m&&s.push([a,i]),console.log(r);var p={pageContent:t,studentsArray:s,pagesInfo:e,tempForHexagon:n.options.viewPath+e.students.templateForHexagon},h=can.view(n.options.viewPath+e.students.template,p);n.toggleLoadAndContent(h)})},"{pages.lesson.routeName}/{pages.lesson.routeMethod}/:param route":function(e){var t=this.options.pages,n=this.options.models,o=this,s=parseInt(e.param);this.toggleLoadAndContent(),can.when(n.Lessons.findOne({id:e.param}),n.Comments.findAll()).then(function(e,a){var i=[];a.length&&a.each(function(e){e.lessonId==s&&i.push(e)});var r={lessonInfo:e,comments:i,commentViewUrl:o.options.viewPath+t.lesson.templateComment},l=can.view(o.options.viewPath+t.lesson.template,r);o.toggleLoadAndContent(l);var d=$(".js-comments_inner",o.element),u="js-del-comment",m="js-comment";d.on("click","."+u,function(e){e.preventDefault();var t=$(this).closest("."+m);t.data("comment").destroy(),t.remove()});var c=$('[data-validate="formNova"]');c.formNova(),c.formNova("config",{isSubmit:!1,beforeSubmit:function(){var e={};can.each(c.serializeArray(),function(t){e[t.name]=t.value});var t=new Date;e.date=t.getDate()+"."+(t.getMonth()+1)+"."+t.getFullYear();var o=new n.Comments(e);o.save(function(e){$(".js-no-comment-note",d).remove();var t=can.view(r.commentViewUrl,e);d.append(t)})}})})},"{pages.lessons.routeName} route":function(){var e=this.options.pages,t=this.options.models,n=this;this.toggleLoadAndContent(),can.when(t.PageContent.findOne({pageName:"lessons"}),t.LessonsCategory.findAll(),t.Lessons.findAll()).then(function(t,o,s){var a={pageContent:t,lessonsCategoryArray:o,lessonsArray:s,pagesInfo:e},i=can.view(n.options.viewPath+e.lessons.template,a);n.toggleLoadAndContent(i)})},route:function(){this.renderIndexPage()},"{pages.index.routeName} route":function(){this.renderIndexPage()},renderIndexPage:function(){var e=this.options.pages,t=this.options.models,n=this;this.toggleLoadAndContent(),t.PageContent.findOne({pageName:"index"},function(t){var o=can.view(n.options.viewPath+e.index.template,t);n.toggleLoadAndContent(o)})},toggleLoadAndContent:function(e){e?(this.$preloader.addClass(this.options.hideClass),this.$contentInner.html(e)):(this.$contentInner.empty(),this.$preloader.removeClass(this.options.hideClass))}});return e});