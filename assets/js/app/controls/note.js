define(['can'], function() {
    'use strict';

    // Контроллер уведомлений о событиях работы с моделями данных
    var Note = can.Control.extend({
        defaults: {
            activeClass: 'note--active',
            innerId: 'js-note_inner'
        }
    },{
        init: function() {
            this.$textElem = $('#' + this.options.innerId, this.element);
        },
        '{models.Students} created': function() {
            this.showNote(this.options.note.messages.studentAdd);
        },
        '{models.Students} updated': function() {
            this.showNote(this.options.note.messages.studentUpdate);
        },
        '{models.Students} destroyed': function() {
            this.showNote(this.options.note.messages.studentDel);
        },
        '{models.Comments} created': function() {
            this.showNote(this.options.note.messages.commentCreate);
        },
        '{models.Comments} destroyed': function() {
            this.showNote(this.options.note.messages.commentDel);
        },
        // показывает уведомление с текстом из параметра
        showNote: function(text) {
            this.$textElem.text(text);
            this.element.addClass(this.options.activeClass);

            var self = this;
            setTimeout(function() {
                self.element.removeClass(self.options.activeClass);
            }, this.options.note.timeShowMsg);
        }
    });

    return Note;
});
