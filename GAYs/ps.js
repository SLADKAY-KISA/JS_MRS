function initMap() {

function getSomebody(speed, from, to, step) { // Функция инициализации информации по точке (не считая google.maps.Marker())

var newOnebody = { // Переменная с данными

speed: speed,

from: from,

to: to,

step: step

}

return newOnebody;

}

var Somebodies = [];// Массив для сбора "onebody" (см. выше)

var Markers = [];// Массив для сбора маркеров (google.maps.Marker())

var route = { // Маршрут

points : [ // Точки маршрута
{

late:55.040597,

lng:82.921787

},

{

late:55.039595,

lng:82.921963

},

{

late:55.038705,

lng:82.922188

},

{

late:55.038652,

lng:82.922091

},

{

late:55.038561,

lng:82.920813

},

{

late:55.038388,

lng:82.918731

},

{

late:55.038396,

lng:82.918471
},

{

late:55.038373,

lng:82.917986

},

{

late:55.038313,

lng:82.917503

},

{

late:55.037697,

lng:82.917669

},

{

late:55.037662,

lng:82.917650

},

{

late:55.037601,

lng:82.917325

},

{

late:55.037558,

lng:82.916821

},

{

late:55.037398,
lng:82.915367

},

{

late:55.038119,

lng:82.915187

},

{

late:55.038170,

lng:82.915748

},

{

late:55.038172,

lng:82.916166

},

{

late:55.038550,

lng:82.916059

}

]

}

var element = document.getElementById("map")

var opt = { // Информация для карты при создании

center: {lat: 55.038888, lng: 82.918325},// Центр наведения

zoom: 17, // Приближение

mapId: '1234'

};
var myMap = new google.maps.Map(element, opt); // Наша карта

initMarkers(14); // Запуск функции создания маркеров

setInterval( function() { // С интервалом 1 секунда двигаем созданные маркеры

moveMarkers()

}, 1000);

function latlng2distance(lat1, long1, lat2, long2) { // Функция вычисления расстояния в метрах по координатам

var R = 6372795; // Радиус земли

// Перевод коордитат в радианы

lat1 *= Math.PI / 180;

lat2 *= Math.PI / 180;

long1 *= Math.PI / 180;

long2 *= Math.PI / 180;

// Вычисление косинусов и синусов широт и разницы долгот

var cl1 = Math.cos(lat1);

var cl2 = Math.cos(lat2);

var sl1 = Math.sin(lat1);

var sl2 = Math.sin(lat2);

var delta = long2 - long1;

var cdelta = Math.cos(delta);

var sdelta = Math.sin(delta);

// Вычисления длины большого круга
var y = Math.sqrt(Math.pow(cl2 * sdelta, 2) + Math.pow(cl1 * sl2 - sl1 * cl2 * cdelta, 2));

var x = sl1 * sl2 + cl1 * cl2 * cdelta;

var ad = Math.atan2(y, x);

var dist = ad * R; // Расстояние между двумя координатами в метрах

return dist

}

function random(min, max) { // Функция генерации случайного числа

return min + Math.random() * (max - min);

}

function addMarker(data) { // Функция создания маркера

var marker = new google.maps.Marker({

position: new google.maps.LatLng(data.coordinates),

map: myMap

});

if (data.info)

{

var infoWindow = new google.maps.InfoWindow({ // infoWindow со скоростью движения

content: data.info.toFixed(1) + ' km/h'

});

marker.addListener("mouseover", function(){ // Открытие infoWindow при наведении на маркер

infoWindow.open(myMap, marker);

});

marker.addListener('mouseout', function(){ // Закрытие infoWindow при убирании курсора с маркера

infoWindow.close()

});

}

Markers.push(marker); // Добавление полученного маркера в Markers

}

function initMarker(speed) // Инициализация onebody+google.map.marker()

{

// Получение случайной координаты старта

var randJ = Math.round(random(0, route.points.length - 1));

var from = [route.points[randJ].late, route.points[randJ].lng];

var to;

// Выбор координаты следования из маршрута

if(randJ > 0 && randJ < route.points.length - 1)

{

if(Math.round( random(0,1) ) )

to = [route.points[randJ+1].late, route.points[randJ+1].lng];

else

to = [route.points[randJ-1].late, route.points[randJ-1].lng];

}

if(randJ == 0)

to = [route.points[randJ+1].late, route.points[randJ+1].lng];

if(randJ == (route.points.length - 1))

to = [route.points[randJ-1].late, route.points[randJ-1].lng];

// Вызов функции создания google.maps.Marker(), передаются координата старта и скорость

addMarker({

coordinates: {

//lat: route.points[randJ].late,

//lng: route.points[randJ].lng

lat: from[0],

lng: from[1]

},

info: speed

});

var onebody = getSomebody(speed, from, to, [0, 0]); // Запись onebody с информацией о скорости, точке отправления, назначения и (нулевом) шаге

Somebodies.push(onebody); // Запись onebody в Somebodies

}

function initMarkers(ammount) { // Функция инициализации маркеров (Здесь определяются случайные скорости для ammount маркеров, далее вызывается функция инициализации marker+onebody для каждого

    for(var i = 0; i < ammount; i++) {

    if(i < ammount/2) // Разделение на две группы

    initMarker(random(2,7)); // Пешеходы (Или особо неторопливые водители)

    else

    initMarker(random(30,50)); // Водители (Или особо быстрые бегуны)

    }

}

function moveMarkers() // Функция движения маркеров

{

for(var j = 0; j < Markers.length; j++) // В Markers...

{

var step = Somebodies[j].step; // Выгрузка шага

var to = Somebodies[j].to; // Выгрузка назначения

var from = Somebodies[j].from; // Выгрузка точки отправления
if(step[0] == 0 && step[1] == 0) { // Если шаг нулевой, получаем новый

var dist = latlng2distance(from[0], from[1], to[0], to[1]);

var speed = Somebodies[j].speed*1000/3600;

step = [(to[0]-from[0])*(speed/dist), (to[1]-from[1])*(speed/dist)]

Somebodies[j].step = step;

}

var currentPosition = Markers[j].getPosition(); // Выгрузка текущей позиции

if(Math.abs(currentPosition.lat() - to[0]) < Math.abs(step[0]) && Math.abs(currentPosition.lng() - to[1]) < Math.abs(step[1])) // Если за следующий шаг мы уйдем за место назначения

{

Markers[j].setPosition(new google.maps.LatLng(to[0], to[1])); // Встаем в место назначения

Somebodies[j].from = to; // Выставляем движение из места назначения

Somebodies[j].step = [0, 0]; // Ставим шаг = 0 (для дальнейшего пересчета)

var numFrom, numTo, i; // Переменные для поиска номера точек отправления и назначения в маршруте

for(i = 0; i < route.points.length; i++)

{

    if(from[0] == route.points[i].late && from[1] == route.points[i].lng)

    numFrom = i;

    if(to[0] == route.points[i].late && to[1] == route.points[i].lng)

    numTo = i;

}

if(numTo == route.points.length-1) // Если мы в конце пути, движемся в сторону начала

    Somebodies[j].to = [route.points[(route.points.length-2)].late, route.points[(route.points.length-2)].lng];

if(numTo == 0) // Если мы в начале пути, движемся в конец

Somebodies[j].to = [route.points[1].late, route.points[1].lng];

if(numTo > 0 && numTo < (route.points.length-1)) // Если мы не там, и не там

{

if(numTo > numFrom) // Продолжаем двигаться в конец

Somebodies[j].to = [route.points[numTo+1].late, route.points[numTo+1].lng];

else // Продолжаем двигаться в начало

Somebodies[j].to = [route.points[numTo-1].late, route.points[numTo-1].lng];

}

}

else

Markers[j].setPosition(new google.maps.LatLng(currentPosition.lat() + step[0], currentPosition.lng() + step[1])); // Если не выйдем за точку назначения, то просто продолжаем движение

}

}}