define(["can","fixture"],function(){var e=[{id:1,name:"Инструменты разработки"},{id:2,name:"Технология разработки UI"},{id:3,name:"Языки программирования"}];return can.fixture("GET /category",function(){return e}),can.fixture("GET /category/{id}",function(t){return e[t.data.id-1]}),e});