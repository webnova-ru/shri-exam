var LESSONS_CATEGORY = [
    {
        id: 1,
        name: 'Инструменты разработки'
    },
    {
        id: 2,
        name: 'Технология разработки UI'
    },
    {
        id: 3,
        name: 'Языки программирования'
    }
];
var TEACHERS = [
    {
        id: 1,
        name: 'Виктор Ашик'
    },
    {
        id: 2,
        name: 'Сергей Сергеев'
    },
    {
        id: 3,
        name: 'Игорь Новак'
    },
    {
        id: 4,
        name: 'Роман Андриади'
    },
    {
        id: 5,
        name: 'Евгений Дорошенко'
    },
    {
        id: 6,
        name: 'Алексей Бережной'
    },
    {
        id: 7,
        name: 'Денис Бугарчев'
    }
];
var LESSONS = [
    {
        id: 1,
        categoryId: 1,
        name: 'Командная строка Unix',
        teacherId: 1,
        time: '68:00',
        videoSize: '1.3 ГБ',
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
        videoLink: 'http://video.yandex.ru/iframe/ya-events/uery0fxkg2.7247/?player-type=custom&show-info=false&show-logo=false&hd=1',
        pressLink: 'http://yadi.sk/d/my2Yax_s9pX7Y',
        downloadLink: 'http://yadi.sk/d/m1QrFolf9o43i'
    }];
var STUDENTS = {

};

var PAGE_CONTENT = {
    index: {
        titlePromoText: 'Мы «Школа разработки интерфейсов» — специализированные курсы по&nbsp;front-end программированию веб-сервисов',
        titleText: 'Что такое ШРИ?',
        aboutSHRI: '<p>Школа разработки интерфейсов (ШРИ) организована компанией Яндекс в 2012 году для студентов старших курсов и недавних выпускников вузов, желающих развиваться в области фронтенд-разработки веб-сервисов.</p>'
                 + '<p>Обучение в Школе разработки интерфейсов включает в себя две части. Курс лекций, посвященных различным аспектам промышленной фронтенд-разработки, и более практическую часть, связанную непосредственно с разработкой. Тех, кто успешно пройдёт практику, мы с удовольствием пригласим на работу или стажировку в Яндекс.</p>'
                 + '<p>На занятиях сотрудники Яндекса рассказывают об инструментах разработчика, о том, как лучше и эффективнее вести работу в команде, о приёмах, которые позволяют сэкономить время, немного о дизайне. Практику ведут ведущие фронтенд-разработчики Яндекса, разрабатывающие интерфейсы для Поиска, Почты, Карт, Маркета и других сервисов Яндекса.</p>'
                 + '<p>Все вопросы о Школе присылайте на адрес: <a title="intern@yandex-team.ru" href="mailto:intern@yandex-team.ru">intern@yandex-team.ru</a></p>'
    },
    lessons: {
        titlePromoText: 'Все лекции школы разработки интерфейсов'
    }
};
