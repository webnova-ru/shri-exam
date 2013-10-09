;(function ($, undefined) {
    "use strict";
    var pluginName = 'formNova';
    var defaults = {
            showInlineErrorOnChange: true,
            showInlineErrorsOnSubmit: true,
            showErrorsOnSubmit: false,
            showInputErrorClass: true,
            isInputShake: true,

            inputClassError: '-input--error',
            inputShakeClass: '-input-shake',
            dataAttrNote: 'fieldError',
            dataAttrRules: 'validRules',
            dataAttrValidMsgPos: 'validMsgPos',

            temp_errorNote: '<span class="-input-note-error"></span>',
            temp_onSubmitError: '<div class="-form-errors" id="formErrors"><h2 class="-form-errors_title" /><ul class="-form-errors_list" /></div>',
            temp_onSubmitErrorItem: '<li class="-form-errors_list_item" />',

            afterValidate: function(fieldObj) {

            },
            isSubmit: true,
            beforeSubmit: function() {

            }
        };
    var messages = {
        defaults: {
            commonFormErrorNote: 'В форме есть ошибки!',
            errorNoteInline: 'Заполнено неверно',
            errorNoteOnSubmit: 'Поле «%n» заполнено некорректно'
        },
        inline: {
            required: 'Обязательно для заполнения',
            matches: 'Не совпадает с «%p»',
            validEmail: 'Электронная почта не верна',
            validEmails: 'Электронные адреса не верны',
            minLength: 'Минимальная длина %p символа',
            maxLength: 'Максимальная длина %p символа',
            exactLength: 'Длина должна быть ровно %p',
            greaterThan: 'Значение дложно быть больше чем %p',
            lessThan: 'Значение должно быть меньше чем %p',
            alpha: 'Только буквы алфавита',
            alphaRU: 'Только буквы русского алфавита',
            alphaRUdash: 'Только буквы русского алфавита и дефис',
            alphaNumeric: 'Только буквы и цифры',
            alphaDash: 'Только буквы, цифры и тире',
            numeric: 'Только цифры',
            numericDash: 'Только цифры и тире',
            integer: 'Только положителные и отрицательные цифры',
            decimal: 'Только цифры с плавающей точкой',
            isNatural: 'Натуральные числа',
            isNaturalNoZero: 'Натуральное число без ведущего нуля'
        },
        onSubmit: {
            required: 'Поле «%n» обязательно для заполнения',
            matches: 'Поле «%n» не совпадает с «%p»',
            validEmail: 'Поле «%n» содержить не верный емайл',
            validEmails: 'Поле «%n» содержить не верные емайлы',
            minLength: 'Поле «%n» должно содержать минимум %p символа',
            maxLength: 'Поле «%n» должно содержать не больше %p символов',
            exactLength: 'Поле «%n» должно быть ровно %p символа',
            greaterThan: 'Значение поля «%n» должно быть больше чем %p',
            lessThan: 'Значение поля «%n» должно быть меньше чем %p',
            alpha: 'Поле «%n» должно содержать только буквы алфавита',
            alphaRU: 'Поле «%n» должно содержать только буквы русского алфавита',
            alphaRUdash: 'Поле «%n» должно содержать только буквы русского алфавита и дефис',
            alphaNumeric: 'Поле «%n» должно содержать только буквы и цифры',
            alphaDash: 'Поле «%n» должно содержать только цифры, знаки подчёркивания и тире',
            numeric: 'Поле «%n» должно содержать только цифры',
            numericDash: 'Поле «%n» должно содержать только цифры и тире',
            integer: 'Поле «%n» должно содержать положителные и отрицательные цифры',
            decimal: 'Поле «%n» должно содержать только цифры с плавающей точкой',
            isNatural: 'Поле «%n» должно быть только натуральным числом',
            isNaturalNoZero: 'Поле «%n» должно содержать только натуральное число без ведущего нуля'
        }
    };
    var regex = {
        rule: /^(.+?)\[(.+)\]$/,
        numeric: /^[0-9]+$/,
        integer: /^\-?[0-9]+$/,
        decimal: /^\-?[0-9]*\.?[0-9]+$/,
        email: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,6}$/i,
        alpha: /^[a-z]+$/i,
        alphaRU: /^[а-я]+$/i,
        alphaRUdash: /^[а-я-]+$/i,
        alphaNumeric: /^[a-z0-9]+$/i,
        alphaDash: /^[a-z0-9_-]+$/i,
        natural: /^[0-9]+$/i,
        numericDash: /^[0-9-]+$/i,
        naturalNoZero: /^[1-9][0-9]*$/i
    }

    var validFunctions = {
        required: function() {
            var $el = $(this);
            var value = $el.val();
            if($el.attr('type') === 'checkbox')
                return ($el.is(':checked') === true);
            return (value !== null && value !== '');
        },

        matches: function(matchName) {
            var $el = $(this);
            var el = $el.parents('form').find("[name='" + matchName + "']");
            if(el.length)
                return $el.val() === el.val();
            return false;
        },

        validEmail: function() {
            return regex.email.test(this.value);
        },

        validEmails: function() {
            var result = this.value.split(",");
            for (var i = 0; i < result.length; i++)
            {
                if(!regex.email.test(result[i]))
                    return false;
            }
            return true;
        },

        minLength: function(length) {
            if(!regex.numeric.test(length))
                return false;
            return (this.value.length >= parseInt(length, 10));
        },

        maxLength: function(length) {
            if(!regex.numeric.test(length))
                return false;
            return (this.value.length <= parseInt(length, 10));
        },

        exactLength: function(length) {
            if(!regex.numeric.test(length))
                return false;
            return (this.value.length === parseInt(length, 10));
        },

        greaterThan: function(param) {
            if (!regex.decimal.test(this.value))
                return false;
            return (parseFloat(this.value) > parseFloat(param));
        },

        lessThan: function(param) {
            if (!regex.decimal.test(this.value))
                return false;
            return (parseFloat(this.value) < parseFloat(param));
        },

        alpha: function() {
            return (regex.alpha.test(this.value));
        },

        alphaRU: function() {
            return (regex.alphaRU.test(this.value));
        },
        alphaRUdash: function() {
            return (regex.alphaRUdash.test(this.value));
        },
        alphaNumeric: function() {
            return (regex.alphaNumeric.test(this.value));
        },

        alphaDash: function() {
            return (regex.alphaDash.test(this.value));
        },

        numeric: function() {
            return (regex.decimal.test(this.value));
        },
        numericDash: function() {
            return (regex.numericDash.test(this.value));
        },
        integer: function() {
            return (regex.integer.test(this.value));
        },

        decimal: function() {
            return (regex.decimal.test(this.value));
        },

        isNatural: function() {
            return (regex.natural.test(this.value));
        },

        isNaturalNoZero: function() {
            return (regex.naturalNoZero.test(this.value));
        }
    };
    var FormNova = function(element, opt) {
        this.form = element;
        this.$form = $(this.form);
        this.options = $.extend({}, defaults, opt);
        this._name = pluginName;

        this.messages = {
            inline: {},
            onSubmit: {}
        };
        this.init();
    }

    FormNova.prototype = {
        init: function() {
            var me = this;
            if(this.options.showInlineErrorOnChange)
            {
                this._getInputsWithValidRule().change(function() {
                    var fieldObj = me._validate(this);
                    me._showInlineError(me._getInlineError(fieldObj));
                    me.options.afterValidate(fieldObj);
                });
            }
            this.$form.submit(function() {
                var errors = [];
                me._getInputsWithValidRule().each(function() {
                    var fieldObj = me._validate(this);
                    fieldObj.isFailed && errors.push(me._getOnSubmitError(fieldObj).error);
                    me.options.showInlineErrorsOnSubmit && me._showInlineError(me._getInlineError(fieldObj));
                    $.isFunction(me.options.afterValidate) && me.options.afterValidate(fieldObj);
                });
                if(errors.length)
                {
                    me.options.showErrorsOnSubmit && me._showErrorsOnSubmit(errors);
                    return false;
                }

                $.isFunction(me.options.beforeSubmit) && me.options.beforeSubmit();
                if(!me.options.isSubmit)
                {
                    return false;
                }

            });
        },
        _getInputsWithValidRule: function() {
            return $("[data-" + this.options.dataAttrRules + "][name]", this.form);
        },
        _showErrorsOnSubmit: function(errors) {
            var $errorsBlock = $(this.options.temp_onSubmitError);

            $('h2', $errorsBlock).text(messages.defaults.commonFormErrorNote);

            var $errorsList = $('ul', $errorsBlock);
            for(var i = 0, len = errors.length; i < len; i++)
                $errorsList.append($(this.options.temp_onSubmitErrorItem).text(errors[i]));

            var errorsBlockId = $errorsBlock.attr('id');
            if(errorsBlockId)
                $('#' + errorsBlockId, this.form).remove();
            this.$form.prepend($errorsBlock);
        },
        _showInlineError: function(fieldObj) {
            var $input = $(fieldObj.this_);

            // если есть пользовательские конфиги применяем их
            var customConfig = $input.data('plugin_' + pluginName + '_config');
            if(customConfig && $.isFunction(customConfig.showInlineError))
            {
                customConfig.showInlineError.call(this, fieldObj);
                return;
            }

            // удаляем старые сообщения с ошибками
            $('[data-' + this.options.dataAttrNote + ' = "' + fieldObj.name + '"]', this.form).remove();
            this.options.showInputErrorClass && $input.removeClass(this.options.inputClassError);

            if(fieldObj.error)
            {
                this.options.showInputErrorClass && $input.addClass(this.options.inputClassError);
                this.options.isInputShake && this._shake($input);
                var noteError = $(this.options.temp_errorNote).text(fieldObj.error).attr('data-' + this.options.dataAttrNote, fieldObj.name);
                $input.after(noteError);
            }
        },
        _shake: function($element) {
            var timer = null,
                shakeClass = this.options.inputShakeClass;
            $element.addClass(shakeClass);
            clearTimeout(timer);
            timer = setTimeout(function() {
                                            $element.removeClass(shakeClass);
                                            }, 800);
        },
        _validate: function(inputThis) {
            var $input = $(inputThis),
                field = {
                    this_: inputThis,
                    name: inputThis.name || null,
                    display: inputThis.id? $("label[for='" + inputThis.id + "']", this.form).text() || inputThis.name: inputThis.name,
                    error: null,
                    ruleName: null,
                    ruleParam: null,
                    isFailed: false
                },
                rulesString = $input.attr('data-' + this.options.dataAttrRules) || null,
                rules = rulesString.split('|');

            var inputValue = $input.val();
            if(rulesString.indexOf('required') === -1 && (!inputValue || inputValue === '' || inputValue === undefined))
                return field;

            for(var i = 0, ruleLength = rules.length; i < ruleLength; i++)
            {
                var method = $.trim(rules[i]),
                    param = null,
                    parts;
                if(parts = regex.rule.exec(method))
                {
                    method = parts[1];
                    param = parts[2];
                }

                if($.isFunction(validFunctions[method]) && (validFunctions[method].call(inputThis, param) === false))
                {
                    field.isFailed = true;
                    field.ruleName = method;
                    field.ruleParam = param;
                    break;
                }
            }
            return field;
        },
        _getInlineError: function(inputField) {
            return this._getError(inputField, true);
        },
        _getOnSubmitError: function(inputField) {
            return this._getError(inputField, false);
        },
        _getError: function(inputField, isInline) {
            if($.isPlainObject(inputField) && inputField.isFailed === true)
            {
                var message = messages.defaults.errorNoteInline;
                var source = this.messages.inline[inputField.ruleName] || messages.inline[inputField.ruleName];
                if(!isInline)
                {
                    message = messages.defaults.errorNoteOnSubmit.replace('%n', inputField.display);
                    source = this.messages.onSubmit[inputField.ruleName] || messages.onSubmit[inputField.ruleName];
                }

                message = source.replace('%n', inputField.display);

                if(inputField.ruleParam)
                {
                    var replace = inputField.ruleParam;
                    var e = $("[name='" + replace + "']", this.form);
                    if(e.length)
                        replace = e[0].id? $("label[for='" + e[0].id + "']", this.form).text() || e[0].name: e[0].name;
                    message = message.replace('%p', replace);
                }

                inputField.error = message;
            }
            return inputField;
        },
        // public method
        setValidFunctions: function(userHandlers) {
            var userValidFun = {};
            for(var key in userHandlers)
            {
                var obj = userHandlers[key];
                if($.isPlainObject(obj) && $.isFunction(obj.rule))
                    userValidFun[key] = obj.rule;
                if(obj.errors)
                {
                    if($.isPlainObject(obj.errors))
                    {
                        if(obj.errors.inline && typeof obj.errors.inline === 'string')
                            this.messages.inline[key] = obj.errors.inline;
                        if(obj.errors.onSubmit && typeof obj.errors.onSubmit === 'string')
                            this.messages.onSubmit[key] = obj.errors.onSubmit;
                    }
                    else if(typeof obj.errors === 'string')
                        this.messages.inline[key] = obj.errors;
                }
            }
            $.extend(validFunctions, userValidFun);
        },
        setFormElemConfig: function(query, config) {
            if(typeof query !== 'string' || !$.isPlainObject(config))
                return;
            $(query, this.form).each(function() {
                if(!$.data(this, 'plugin_' + pluginName + '_config'))
                    $.data(this, 'plugin_' + pluginName + '_config', config);
            });
        },
        clearErrorsMessage: function() {
            $('.' + this.options.inputClassError, this.$form).removeClass(this.options.inputClassError);
            $('[data-' + this.options.dataAttrNote + ']').remove();
        },
        config: function(options) {
            $.extend(this.options, options);
        }
    };

    $.fn[pluginName] = function(options) {
        var args = arguments;
        if (options === undefined || typeof options === 'object')
        {
            return this.each(function () {
                if(!$.data(this, 'plugin_' + pluginName))
                    $.data(this, 'plugin_' + pluginName, new FormNova(this, options));
            });
        }
        else if(typeof options === 'string' && options[0] !== '_' && options !== 'init')
        {
            return this.each(function () {
                var instance = $.data(this, 'plugin_' + pluginName);
                if(instance instanceof FormNova && typeof instance[options] === 'function')
                    instance[options].apply( instance, Array.prototype.slice.call(args, 1));
            });
        }
    }
})(jQuery);