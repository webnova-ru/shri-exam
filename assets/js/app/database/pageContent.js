define(['can', 'fixture'], function() {
    'use strict';

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
        },
        students: {
            titlePromoText: 'Cтуденты нашей школы'
        }
    };

    // ставим задержку на фейковый ответ сервера
    can.fixture.delay = 600;

    can.fixture('GET /info', function(){
        return [PAGE_CONTENT];
    });
    can.fixture('GET /info/{pageName}', function(request){
        return PAGE_CONTENT[request.data.pageName];
    });
});
