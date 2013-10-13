define(['can', 'formNova'], function() {
    'use strict';

    // Контроллер контента страницы, отслеживание изменения хеша и обработка событий по ним
    var Content = can.Control.extend({
            defaults: {
                preloaderClass: 'preloader',
                hideClass: '_hide',
                innerClass: 'js-content_inner'
            }
        },
        {
            init: function() {
                can.route(":page/:action/:param");

                this.$preloader = $('.' + this.options.preloaderClass, this.element);
                this.$contentInner = $('.' + this.options.innerClass, this.element);
            },

            // Страница создания нового студента
            '{pages.student.routeName}/{pages.student.routeMethod.create} route' : function(){
                this.toggleLoadAndContent();
                var pages = this.options.pages;
                var self = this;

                // собираем данные для шаблона, рендрим его и пихаем на страницу
                var tempParam = {
                    urlPageInfo: pages,
                    state: 'create',
                    tempEditForm: this.options.viewPath + pages.student.templateEditStudent,
                    listUrl: '#!' + pages.students.routeName
                };
                var pageFragment = can.view(this.options.viewPath + pages.student.templateNewStudent, tempParam);
                self.toggleLoadAndContent(pageFragment);

                // назначаем валидатор на форму
                self.setValidatorForForm(undefined);

                // назначаем кнопку назад
                var goBackButton = $('#js-go-to-view', this.element);
                goBackButton.on('click', function(e){
                    e.preventDefault();
                    location.hash = '#!' + pages.students.routeName;
                });
            },

            // Страница просмотра анкеты студента
            '{pages.student.routeName}/:action/:param route' : function(urlParam) {
                this.toggleLoadAndContent();
                var pages = this.options.pages;
                var models = this.options.models;
                var self = this;
                var studId = parseInt(urlParam.param);

                models.Students.findAll({}, function(studentsArray) {

                    // находим нужный нам объект студента с id из параметра урла
                    var studentInfo = null;
                    for(var i = 0, len = studentsArray.length; i < len; i++)
                    {
                        if(studentsArray[i].id === studId)
                        {
                            studentInfo = studentsArray[i];
                            break;
                        }
                    }
                    if(studentInfo === null)
                    {
                        console.log('такого студента нет');
                        return;
                    }

                    // собираем данные для шаблона, рендрим его и пихаем на страницу
                    var tempParam = {
                        studentInfo: studentInfo,
                        state: 'view',
                        tempEditForm: self.options.viewPath + pages.student.templateEditStudent,

                        viewUrl: can.route.url({ page: pages.student.routeName, action: pages.student.routeMethod.view, param: studentInfo.id}),
                        editUrl: can.route.url({ page: pages.student.routeName, action: pages.student.routeMethod.edit, param: studentInfo.id}),
                        listUrl: '#!' + pages.students.routeName
                    };
                    var pageFragment = can.view(self.options.viewPath + pages.student.template, tempParam);
                    self.toggleLoadAndContent(pageFragment);

                    // назначаем валидатор на форму редактирования анкеты
                    self.setValidatorForForm(studentInfo);

                    // удаление студента
                    var deleteStudentButton = $('#js-delete-student', this.element);
                    deleteStudentButton.on('click', function(e){
                        e.preventDefault();
                        studentInfo.destroy(function() {
                            location.hash = '#!' + pages.students.routeName;
                        });
                    });

                    // назначаем кнопки просмотра/редактирования анкеты студента
                    var $viewButton = $('#js-view-student', self.element);
                    var $editButton = $('#js-edit-student', self.element);
                    var $studentEditForm = $('#js-student-edit', self.element);
                    var $studentFullInfo = $('#js-student-info', self.element);

                    if(urlParam.action === pages.student.routeMethod.view)
                    {
                        $studentEditForm.hide();
                        $viewButton.addClass('-btn--active');
                    }
                    if(urlParam.action === pages.student.routeMethod.edit)
                    {
                        $studentFullInfo.hide();
                        $editButton.addClass('-btn--active');
                    }
                });
            },

            // валидатор для формы
            setValidatorForForm: function(studItem) {
                var pages = this.options.pages;
                var models = this.options.models;

                var form = $('[data-validate="formNova"]');
                form.formNova();
                form.formNova('config', {
                    isSubmit: false,
                    beforeSubmit: function() {
                        var resFormValue = {};
                        can.each(form.serializeArray(), function(obj) {
                            resFormValue[obj.name] = obj.value;
                        });

                        var studItemCopy = studItem;

                        if(studItemCopy)
                            studItemCopy.attr(resFormValue).save();
                        else
                        {
                            studItemCopy = new models.Students(resFormValue);
                            studItemCopy.save();
                        }
                        location.hash = can.route.url({ page: pages.student.routeName, action: pages.student.routeMethod.view, param: studItemCopy.id})
                    }
                });
            },

            // страница со списком студентов
            '{pages.students.routeName} route' : function() {
                var pages = this.options.pages;
                var models = this.options.models;
                var self = this;

                this.toggleLoadAndContent();

                can.when(models.PageContent.findOne({pageName: 'students'}), models.Students.findAll())
                    .then(function(reqPageContent, reqStudentsArray) {

                        // подготавливаем массив данных для шаблона (нужно для вывода сетки из сот)
                        var studentsArray = [];
                        var stud1 = [null, null, null];
                        var stud2 = [null, null, null, null];
                        for(var i = 0, len = reqStudentsArray.length, rowCounter1 = 1, rowCounter2 = 1, flag = 0; i < len; i++)
                        {
                            var studItem  = reqStudentsArray[i];
                            if(rowCounter1 % 4)
                            {
                                stud1[rowCounter1 - 1] = studItem;
                                rowCounter1++;
                                flag++;
                            }
                            else
                            {
                                if(rowCounter2 % 5)
                                {
                                    stud2[rowCounter2 - 1] = studItem;
                                    rowCounter2++;
                                    flag++;
                                }
                                else
                                {
                                    rowCounter2 = rowCounter1 = 1;
                                    flag = 0;
                                    i--;
                                    studentsArray.push([stud1, stud2]);
                                    stud1 = [null, null, null];
                                    stud2 = [null, null, null, null];
                                }
                            }
                        }
                        if(i && flag)
                            studentsArray.push([stud1, stud2]);

                        // собираем данные для шаблона, рендрим его и пихаем на страницу
                        var tempParam = {
                            pageContent: reqPageContent,
                            studentsArray: studentsArray,
                            pagesInfo: pages,
                            tempForHexagon: self.options.viewPath + pages.students.templateForHexagon
                        };
                        var pageFragment = can.view(self.options.viewPath + pages.students.template, tempParam);
                        self.toggleLoadAndContent(pageFragment);
                    });
            },

            // страница показа одной лекции
            '{pages.lesson.routeName}/{pages.lesson.routeMethod}/:param route' : function(urlParam) {
                var pages = this.options.pages;
                var models = this.options.models;
                var self = this;
                var lessonId = parseInt(urlParam.param);

                this.toggleLoadAndContent();

                can.when(models.Lessons.findOne({id: urlParam.param}), models.Comments.findAll())
                   .then(function(lessonReq, commentsReq) {

                        var comments = [];
                        if(commentsReq.length)
                        {
                            commentsReq.each(function(elem) {
                                if(elem.lessonId == lessonId)
                                    comments.push(elem);
                            });
                        }

                        // собираем данные для шаблона и довавляем его dom
                        var tempParam = {
                            lessonInfo: lessonReq,
                            comments: comments,
                            commentViewUrl: self.options.viewPath + pages.lesson.templateComment
                        };

                        var pageFragment = can.view(self.options.viewPath + pages.lesson.template, tempParam);
                        self.toggleLoadAndContent(pageFragment);

                        // назначаем обработчик на ссылку удаления комментария
                        var commentsInner = $('.js-comments_inner', self.element);
                        var delLinkClass = 'js-del-comment';
                        var commentClass = 'js-comment';
                        commentsInner.on('click', '.' + delLinkClass, function(e) {
                            e.preventDefault();
                            var commentRootElement = $(this).closest('.' + commentClass);
                            commentRootElement.data('comment').destroy();
                            commentRootElement.remove();
                        });

                        // определяем валидатор для формы комментариев
                        var form = $('[data-validate="formNova"]');
                        form.formNova();
                        form.formNova('config', {
                            isSubmit: false,
                            beforeSubmit: function() {
                                var resFormValue = {};
                                can.each(form.serializeArray(), function(obj) {
                                    resFormValue[obj.name] = obj.value;
                                });
                                var date = new Date();
                                resFormValue['date'] = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();

                                var newComment = new models.Comments(resFormValue);
                                newComment.save(function(comment) {
                                    // пихаем новый комментарий на страницу
                                    $('.js-no-comment-note', commentsInner).remove();
                                    var commentFragment = can.view(tempParam.commentViewUrl, comment);
                                    commentsInner.append(commentFragment);
                                });
                            }
                        });

                    });
            },

            // страница со списком лекций
            '{pages.lessons.routeName} route' : function() {
                var pages = this.options.pages;
                var models = this.options.models;
                var self = this;

                this.toggleLoadAndContent();

                can.when(models.PageContent.findOne({pageName: 'lessons'}), models.LessonsCategory.findAll(), models.Lessons.findAll())
                    .then(function(reqPageContent, reqLessonsCategoryArray, reqLessonsArray) {

                        // собираем данные для шаблона, рендрим его и пихаем на страницу
                        var tempParam = {
                            pageContent: reqPageContent,
                            lessonsCategoryArray: reqLessonsCategoryArray,
                            lessonsArray: reqLessonsArray,
                            pagesInfo: pages
                        };
                        var pageFragment = can.view(self.options.viewPath + pages.lessons.template, tempParam);
                        self.toggleLoadAndContent(pageFragment);
                    });

            },
            'route': function() {
                this.renderIndexPage();
            },
            '{pages.index.routeName} route': function() {
                this.renderIndexPage();
            },

            // функция показа главной страницы
            renderIndexPage: function() {
                var pages = this.options.pages;
                var models = this.options.models;
                var self = this;

                this.toggleLoadAndContent();

                // идём за данными для страницы, пихаим их в шаблон и рендрим страницу
                models.PageContent.findOne({pageName: 'index'}, function(pageContent){
                    var pageFragment = can.view(self.options.viewPath + pages.index.template, pageContent);
                    self.toggleLoadAndContent(pageFragment);
                });
            },

            // переключаемся между состоянием загрузки страницы и наличием контента на ней
            toggleLoadAndContent: function(fragment) {
                if(fragment)
                {
                    this.$preloader.addClass(this.options.hideClass);
                    this.$contentInner.html(fragment);
                }
                else
                {
                    this.$contentInner.empty();
                    this.$preloader.removeClass(this.options.hideClass);
                }
            }
        });

    return Content;
});
