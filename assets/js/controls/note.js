define(['can'], function() {
    'use strict';

    // Контроллер уведомлений о событиях работы с моделями данных
    var Note = can.Control.extend({
        defaults: {
            activeClass: 'note--active',
            innerId: 'js-note_inner',
            timeShowMsg: 2800,

            messages: {
                studentAdd: 'Новый студент успешно добавлен',
                studentUpdate: 'Данные о студенте изменены',
                studentDel: 'Студент удалён'
            }
        }
    },{
        init: function() {
            this.$textElem = $('#' + this.options.innerId, this.element);
        },
        '{models.Students} created': function() {
            this.showNote(this.options.messages.studentAdd);
        },
        '{models.Students} updated': function() {
            this.showNote(this.options.messages.studentUpdate);
        },
        '{models.Students} destroyed': function() {
            this.showNote(this.options.messages.studentDel);
        },

        // показывает уведомление с текстом из параметра
        showNote: function(text) {
            this.$textElem.text(text);
            this.element.addClass(this.options.activeClass);

            var self = this;
            setTimeout(function() {
                self.element.removeClass(self.options.activeClass);
            }, this.options.timeShowMsg);
        }
    });

    return Note;
});
