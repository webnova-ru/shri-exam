define(["can","fixture"],function(){var t=[{id:1,name:"Виктор Ашик"},{id:2,name:"Сергей Сергеев"},{id:3,name:"Игорь Новак"},{id:4,name:"Роман Андриади"},{id:5,name:"Евгений Дорошенко"},{id:6,name:"Алексей Бережной"},{id:7,name:"Денис Бугарчев"}];return can.fixture("GET /teachers",function(){return t}),can.fixture("GET /teacher/{id}",function(e){return t[e.data.id-1]}),t});