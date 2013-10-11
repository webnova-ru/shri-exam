define(['database/teachers', 'database/lessonsCategory', 'can', 'fixture'], function(TEACHERS, LESSONS_CATEGORY) {
    'use strict';

    var LESSONS = [
        {
            id: 1,
            categoryId: 1,
            name: 'Командная строка Unix',
            teacherId: 1,
            time: '68:00',
            videoSize: '1.3 ГБ',
            tags: 'Unix, console',
            videoLink: 'http://video.yandex.ru/iframe/ya-events/yc39l9dh0a.4723/?player-type=custom&show-info=false&show-logo=false&hd=1',
            pressLink: 'http://yadi.sk/d/hDGgd0Ri9R9hV',
            downloadLink: 'http://yadi.sk/d/GbLf_m8W9NMMz'
        },
        {
            id: 2,
            categoryId: 1,
            name: 'Cистемы контроля версий',
            teacherId: 2,
            time: '66:00',
            videoSize: '660 МБ',
            tags: 'Git, GitHub',
            videoLink: 'http://video.yandex.ru/iframe/ya-events/oeunffeksq.5100/?player-type=custom&show-info=false&show-logo=false&hd=1',
            pressLink: 'http://yadi.sk/d/_BZt0nfx9XwPb',
            downloadLink: 'http://yadi.sk/d/_BZt0nfx9XwPb'
        },
        {
            id: 3,
            categoryId: 1,
            name: 'Изучение и редактирование кода',
            teacherId: 3,
            time: '68:00',
            videoSize: '1.6 ГБ',
            tags: 'HTML, CSS, Vim',
            videoLink: 'http://video.yandex.ru/iframe/ya-events/nvby8zm0d8.3121/?player-type=custom&show-info=false&show-logo=false&hd=1',
            pressLink: 'http://yadi.sk/d/DllB56WW9R9Zs',
            downloadLink: 'http://yadi.sk/d/2Mb2aQqz9NMcD'
        },
        {
            id: 4,
            categoryId: 2,
            name: 'Развертывание верстки',
            teacherId: 4,
            time: '44:00',
            videoSize: '486 МБ',
            tags: 'HTML, CSS, Server',
            videoLink: 'http://video.yandex.ru/iframe/ya-events/gmhj6jhjbq.7339/?player-type=custom&show-info=false&show-logo=false&hd=1',
            pressLink: 'http://yadi.sk/d/NAt_q4h69p8jq',
            downloadLink: 'http://yadi.sk/d/iGfZDEk39XxEj'
        },
        {
            id: 5,
            categoryId: 2,
            name: 'Кеширование на клиенте и сервере',
            teacherId: 5,
            time: '72:00',
            videoSize: '614 МБ',
            tags: 'HTML, CSS',
            videoLink: 'http://video.yandex.ru/iframe/ya-events/0tk8ubi12b.7216/?player-type=custom&show-info=false&show-logo=false&hd=1',
            pressLink: 'http://yadi.sk/d/arbrbY-b9pTMD',
            downloadLink: 'http://yadi.sk/d/u5oT64VL9mV7d'
        },
        {
            id: 6,
            categoryId: 3,
            name: 'Регулярные выражения',
            teacherId: 6,
            time: '43:34',
            videoSize: '378 МБ',
            tags: 'Javascript, RegEx',
            videoLink: 'http://video.yandex.ru/iframe/ya-events/x79ax18q9w.3802/?player-type=custom&show-info=false&show-logo=false&hd=1',
            pressLink: 'http://yadi.sk/d/5uaBj1Kh9pYRV',
            downloadLink: 'http://yadi.sk/d/AU6yRkm89oATJ'
        },
        {
            id: 7,
            categoryId: 3,
            name: 'Языки программирования',
            teacherId: 7,
            time: '51:45',
            videoSize: '384 МБ',
            tags: 'Javascript, Haskell',
            videoLink: 'http://video.yandex.ru/iframe/ya-events/uery0fxkg2.7247/?player-type=custom&show-info=false&show-logo=false&hd=1',
            pressLink: 'http://yadi.sk/d/my2Yax_s9pX7Y',
            downloadLink: 'http://yadi.sk/d/m1QrFolf9o43i'
        }];

    can.fixture('GET /lessons', function() {
        return getFullLessonsInfo(LESSONS, LESSONS_CATEGORY, TEACHERS);
    });
    can.fixture('GET /lesson/{id}', function(request) {
        return getFullLessonsInfo(LESSONS[request.data.id - 1], LESSONS_CATEGORY, TEACHERS)[0];
    });

    // функция получения полной информации о лекции. Подобие JOIN-а таблиц из SQL
    function getFullLessonsInfo(lessons, category, teachers) {
        var lessonsArray = $.isPlainObject(lessons)? [lessons]: lessons;
        return lessonsArray.map(function(lesson) {
            var lessonCopy = can.extend({}, lesson);
            lessonCopy.category = category.filter(function(cat){
                return cat.id === lessonCopy.categoryId
            })[0];
            lessonCopy.category = lessonCopy.category.name;
            lessonCopy.teacher = teachers.filter(function(teacher){
                return teacher.id === lessonCopy.teacherId
            })[0];
            lessonCopy.teacher = lessonCopy.teacher.name;
            return lessonCopy;
        });
    }
});
