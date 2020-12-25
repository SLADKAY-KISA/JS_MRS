const Struct = (...keys) => ((...v) => keys.reduce((o, k, i) => {o[k] = v[i]; return o} , {}))
		const Item = Struct('marker', 'speed')
		

		let BS = [];
		let NumberBS = 5;
		let markers = [];
		var interval1;
		var flag = 0;
		var chicago = { lat: 55.014690, lng: 82.959608 };
		/**


		*/
		function randomInRange(min, max) {
			return Math.random() < 0.5 ? ((1-Math.random()) * (max-min) + min) : (Math.random() * (max-min) + min);
		} 

		/**
			 * 
			 * 
			 */
		function randomizeInteger(min, max) {
			if(max == null) {
				max = (min == null ? Number.MAX_SAFE_INTEGER : min);
			min = 0;
			}
			min = Math.ceil(min);  // inclusive min
			max = Math.floor(max); // exclusive max
			if(min > max - 1) {
				throw new Error("Incorrect arguments.");
			}
			return min + Math.floor((max - min) * Math.random());
		}

		/**
		 * Функция установки маркера на новую позицию с координатами широты(х) и долготы(у)
		 * 
		 * @param {Object} marker - указатель на структуру, содержащую 
		 * @param {number} x - широта, в которую надо переместить маркер
		 * @param {number} y - долгота, в которую надо переместить маркер
		 * 
		 * 
		 * 
		 * function set(ing?) new coordinates for one unit (marker) at map
		 * @param {Object} marker - 
		 * @param {number} x - lalitude
		 * @param {number} y - longitude
		 */
		function setNewPosition(marker, x, y){
			var latlng = new google.maps.LatLng(x, y);
			marker.setPosition(latlng);
		}

		/**
		 * Функция изменения позиции маркера на карте, в зависимости от выбранного направления
		 * 
		 * @param {Object} marker - указатель на структуру
		 * @param {number} x - широта, в которой находится маркер
		 * @param {number} y - долгота, в которой находится маркер
		 * @param {number} speed - смещение координаты на градусов/секунду
		 * @param {number} direction - направление изменения координат маркера
		 * 
		 */
		function changeMarkerPosition(marker, x, y, speed, direction) {
        switch(direction){
          case 1: //right
            setNewPosition(marker, x+speed, y);
            break;
          case 2: //left
            setNewPosition(marker, x-speed, y);
            break;
          case 3: //up
            setNewPosition(marker, x, y+speed);
            break;
          case 4: //down
            setNewPosition(marker, x, y-speed);
            break;
        }
	  }
	  
        /**
         * 
         * 
         */
		function CreateUnits(map, Number, markers) {
			//создание необходимого количества юнитов
			for (var i = 0; i < Number; i++) {
				let x;			//широта
        		let y; 			//долгота
        		let speed;		//гр/сек
				var position;	//направление движения
				var icon1 = 'https://img.icons8.com/plasticine/50/000000/arms-up.png';
				var icon2 = 'https://img.icons8.com/plasticine/60/000000/person-laying-down.png'
				x = randomInRange(55.021465, 55.012316); 	//случайная широта из допустимой области для генерации
				y = randomInRange(82.936089, 82.963985); 	//случайная долгота из допустимой области для генерации
				
				position = { lat: x, lng: y}; 
				if(i < Number/2){
					speed =  randomInRange(0.00000749, 0.00001748);
					
					var marker = new google.maps.Marker({
					position: position,
					map: map,
					title: "people"+i,
					icon: icon1,
					}); 
				}
				else{
					speed =  randomInRange(0.00007494, 0.00017486);
					
					var marker = new google.maps.Marker({
					position: position,
					map: map,
					title: "people"+i,
					icon: icon2,
					});
				}			//объект, содержащий координаты маркера
				markers.push(Item(marker, speed));	//добавление в массив со всеми маркерами
			}
			console.log(markers);
			console.log(markers.length);
		}
        
        /**
         * 
         * 
         */
		function UnitsMovement(map, Number, markers) {
			let direction1 = [];	//массив для хранения текущего направления у каждого юнита
			for (var i = 0; i < Number; i++) {	//начальное направление задается случайным образом
				direction1.push(randomizeInteger(1,5));
			}
			var t1 = 0;	//таймер (текущая секунда)
			interval1 =  setInterval(function() {

				t1++;

				//при достигнутом количестве выполнений функции - завершить ее работа
				if(flag == 1){ //Если была нажата кнопка остановки движения, то остановить движение и снова опустить флаг
					clearInterval(interval1);
					flag = 0;
				}
				//каждые 100мс изменять позицию всех юнитов в нужном направлении и на нужное расстояние
				for (var i = 0; i < Number; i++) {
					if(t1 % 30 == 0){	//менять напрвление случайным образом каждые 30 тиков функции
						direction1[i] = randomizeInteger(1,5);
					}

					changeMarkerPosition(markers[i].marker, markers[i].marker.getPosition().lat(), markers[i].marker.getPosition().lng(), markers[i].speed, direction1[i]);
				}
			}, 100); //Every 1000ms = 1sec
		}

        /**
         * 
         * 
         */
		function UI_ForButtons(controlUI){
			controlUI.style.backgroundColor = "#fff";
			controlUI.style.border = "2px solid #fff";
			controlUI.style.borderRadius = "3px";
			controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
			controlUI.style.cursor = "pointer";

			controlUI.style.textAlign = "center";
			controlUI.style.color = "rgb(25,25,25)";
			controlUI.style.fontFamily = "Roboto,Arial,sans-serif";
			controlUI.style.fontSize = "16px";
			controlUI.style.lineHeight = "38px";
			controlUI.style.paddingLeft = "5px";
			controlUI.style.paddingRight = "5px";

		}

		/**
		 * 
		 * Функция создания и обраотки нажатия кнопки для генерации необходимого количества юнитов
		 * 
		 * @param {button} controlDIV - кнопка генерации юнитов
		 * @param {google.maps.Map} map - карта
		 * @constructor
		 */
		 function GeneratePeople_Button(controlDiv, map, markers) {

			controlDiv.id = "Generate";
			UI_ForButtons(controlDiv);
			controlDiv.title = "Click to generate Units";
			controlDiv.innerHTML = "Generate Units";
			controlDiv.style.color = "rgb(25,25,25)";

			controlDiv.addEventListener("click", () => {
				var Number = 20;
				var numb = document.getElementById("Number");
				if(numb.value != 0)
					Number = numb.value;
				console.log(numb.value);
				var button = document.getElementById("Start");
				button.removeAttribute("disabled");
				button.style.color = "rgb(25,25,25)";

				var button1 = document.getElementById("Clear");
				button1.removeAttribute("disabled");
				button1.style.color = "rgb(25,25,25)";
				CreateUnits(map, Number, markers);
			});
		}
		
		/**
		 * Функция создания и обработки нажатия кнопки для запуска движения юнитов
		 * 
		 * @param {button} controlDIV - кнопка начала движения
		 * @param {google.maps.Map} map - карта
		 * @param {Array} markers - массив уже созданных маркеров
		 * @constructor
		 */
		function StartMoving_Button(controlDiv, map, markers) {

			controlDiv.id = "Start";
			UI_ForButtons(controlDiv);
			controlDiv.title = "Click to start the Units movement";
			controlDiv.style.color = "rgb(192,192,192)";
			controlDiv.innerHTML = "Start Movement";

			controlDiv.addEventListener("click", () => {

				controlDiv.setAttribute("disabled", "");
				controlDiv.style.color = "rgb(192,192,192)";

				var button = document.getElementById("Generate");
				button.setAttribute("disabled", "");
				button.style.color = "rgb(192,192,192)";

				var button1 = document.getElementById("Clear");
				button1.setAttribute("disabled", "");
				button1.style.color = "rgb(192,192,192)";

				var button2 = document.getElementById("Stop");
				button2.removeAttribute("disabled");
				button2.style.color = "rgb(25,25,25)";

				var Number = markers.length;
				UnitsMovement(map, Number, markers);
			});
		}

		/**
		 * Функция создания и обработки нажатия кнопки для остановки движения юнитов
		 * 
		 * @param {button} controlDIV - кнопка остановки движения
		 * @param {google.maps.Map} map - карта
		 * @param {Array} interval - указатель на функцию с таймеров, для последующей остановки
		 * @constructor
		 */
		function StopMoving_Button(controlDiv, map, interval){

			controlDiv.id = "Stop";
			UI_ForButtons(controlDiv);
			controlDiv.title = "Click to stop the Units movement";
			controlDiv.style.color = "rgb(192,192,192)";
			controlDiv.innerHTML = "Stop Movement";

			controlDiv.addEventListener("click", () => {

				controlDiv.setAttribute("disabled", "");
				controlDiv.style.color = "rgb(192,192,192)";

				var button = document.getElementById("Generate");
				button.removeAttribute("disabled");
				button.style.color = "rgb(25,25,25)";

				var button1 = document.getElementById("Clear");
				button1.removeAttribute("disabled");
				button1.style.color = "rgb(25,25,25)";

				var button2 = document.getElementById("Start");
				button2.removeAttribute("disabled");
				button2.style.color = "rgb(25,25,25)";

				flag = 1;

				console.log("ITS BEEN CLICKED: " + flag);
			});
		}

		/**
		 * Функция создания и обработки нажатия кнопки для очистки юнитов с карты
		 * 
		 * @param {button} controlDIV - кнопка очистки
		 * @param {Array} markers - массив уже созданных маркеров
		 * @constructor
		 */
		function ClearUnits_Button(controlDiv, markers){

			controlDiv.id = "Clear";
			UI_ForButtons(controlDiv);
			controlDiv.title = "Click to clear the Units";
			controlDiv.innerHTML = "Clear Units";
			controlDiv.style.color = "rgb(192,192,192)";

			controlDiv.addEventListener("click", () => {

			controlDiv.setAttribute("disabled", "");
			controlDiv.style.color = "rgb(192,192,192)";

			
			var button1 = document.getElementById("Start");
				button1.setAttribute("disabled", "");
				button1.style.color = "rgb(192,192,192)"

			for (let i = 0; i < markers.length; i++) {
				markers[i].marker.setMap(null);
				}
			markers.length = 0;
				
			});
		}

		/**
		 * 
		 * 
		 */
		function getMAP(temp){
			let URL = "https://geocode-maps.yandex.ru/1.x/?apikey=599d40fb-71b4-47be-b424-072f354f7bb7&geocode=" ;
			let x = temp[0].replace(/ /g, "").replace("'", "%27");   
			// https://geocode-maps.yandex.ru/1.x/?apikey=197f1a96-6ccc-4845-aa21-7bd5de550213&geocode=55°01%2715.0%22N%2082°57%2721.9%22E&format=json",function(data) {
			x=x.concat("N");
			
			let y = temp[1].replace(/ /g, "").replace("'", "%27");
			
			y=y.concat("E");
			let format ="&format=json";
		//55°01%2715.0%22N%20, 82°57%2721.9%22E"
			// let xx = "56°01'55.7"N 92°49'19.7"E"; 56°01%2755.7"N%2092°49%2719.7"E
		// https://geocode-maps.yandex.ru/1.x/?apikey=197f1a96-6ccc-4845-aa21-7bd5de550213&geocode=55°01%2715.0%22N%2082°57%2721.9%22E&format=json",function(data) {
		//           
			let URL1 = URL.concat(x,"%20",y,format);
			console.log(x);
			console.log(y);
			console.log(URL1);
			let way; 
			$.get(URL1,function(data) {
		//          
			// $.get("https://geocode-maps.yandex.ru/1.x/?apikey=197f1a96-6ccc-4845-aa21-7bd5de550213&geocode=&format=json?" + $.param({geocode: "55°01%2715.0%22N%20, 82°57%2721.9%22E"}) ,function(data) {
				way = data.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.kind
						console.log(data.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.kind);
						}, "json");

			return way; 
		}

		/**
		 * 
		 * 
		 */
		function translate_from_lat_lon_to_minutes(lon,lat) {
			var point = new GeoPoint(lon, lat);
			return [point.getLonDeg(),point.getLatDeg()];
		}


		function initMap() {

			//параметры карты
			var pos = { lat: 55.014690, lng: 82.959608 } //координаты позиции центра для отображения карты
			var opt = {
				center: pos,
				zoom: 15,
			}

			//создание объекта типа "Карта"
			var FirstMap = new google.maps.Map(document.getElementById("map"), opt);

			const NumberUnits = document.createElement("input");
			NumberUnits.id = "Number";
			NumberUnits.setAttribute("size", "3");
			NumberUnits.setAttribute("max", "100");
			NumberUnits.setAttribute("placeholder", "Unit")
			UI_ForButtons(NumberUnits);
			//GeneratePeople_Button(NumberUnits, FirstMap, markers);
			FirstMap.controls[google.maps.ControlPosition.TOP_CENTER].push(
				NumberUnits
			);
			

			//Кнопка для генерации юнитов
			const GenerateUnits = document.createElement("button");
			GeneratePeople_Button(GenerateUnits, FirstMap, markers);
			FirstMap.controls[google.maps.ControlPosition.TOP_CENTER].push(
				GenerateUnits
			);

			//Кнопка для запуска движения
			const StartMovement = document.createElement("button");
			StartMoving_Button(StartMovement, FirstMap, markers);
			FirstMap.controls[google.maps.ControlPosition.TOP_CENTER].push(
				StartMovement
			);
			StartMovement.setAttribute("disabled", "");

			//Кнопка для остановки движения
			const StopMovement = document.createElement("button");
			StopMoving_Button(StopMovement, FirstMap, interval1);
			FirstMap.controls[google.maps.ControlPosition.TOP_CENTER].push(
				StopMovement
			);
			StopMovement.setAttribute("disabled", "");

			//Кнопка для удаления всех юнитов
			const ClearUnits = document.createElement("button");
			ClearUnits_Button(ClearUnits, markers);
			FirstMap.controls[google.maps.ControlPosition.TOP_CENTER].push(
				ClearUnits
			);
			ClearUnits.setAttribute("disabled", "");



			for (var i = 0; i < NumberBS; i++) {
				let x;			//широта
        		let y; 			//долгота
				var position;	
				var icon3 = 'https://img.icons8.com/doodle/70/000000/cellular-network.png';
				x = randomInRange(55.021465, 55.012316); 	//случайная широта из допустимой области для генерации
				y = randomInRange(82.936089, 82.963985); 	//случайная долгота из допустимой области для генерации
				
				position = { lat: x, lng: y}; 
					
				var base = new google.maps.Marker({
				position: position,
				map: FirstMap,
				title: "Base Station"+i,
				icon: icon3,
				}); 
				BS.push(Item(base, x));	//добавление в массив со всеми маркерами
			}
			console.log(BS);
			console.log(BS.length);



			// let x;
			// let y;
			// let speed;
			// var position;
			// var types = {};
			// x = randomInRange(55.015465, 55.012316);
			// y = randomInRange(82.956089, 82.963985);
			// speed = 0.00002;
			// position = { lat: x, lng: y};
			// var marker = new google.maps.Marker({
			// 	position: position,
			// 	map: FirstMap,
			// 	title: "person",
			// 	icon: icon1
			// });

			// var temp ;
			// var way_human;
			// temp=translate_from_lat_lon_to_minutes(marker.getPosition().lat(), marker.getPosition().lng());
			// console.log(temp);
			// way_human = getMAP(temp);


			// FirstMap.openInfoWindow(map.getCenter(), document.createTextNode("Hello, world")); 
			// markers[0].marker.openInfoWindowHtml('Москва – лучший город земли!');



			/**
			 * В планах:
			 * 
			 * 	 - 	Определение области генерации юнитов путем тыка четырех точек на карте
			 * 	 - 	Выбор определенного юнита путем тыка и вывод всплывающей характеристики (номер, скорость, текущие координаты мб) 
			 * 	 	на него, которая enabled даже при движении
			 * 	 -	Ну есессна ограничение дорогами
			 * 	 -	Генериться юниты будут случайно, но планируется определять ближайшую дорогу, мувиться на нее 
			 * 		и только потом отображаться на карте
			 * 	 -	Хотелось бы адекватное движение, а не вправо-влево-вверх-вниз
			 * 
			 * *******	ПО МЕРЕ ВЫПОЛНЕНИЯ ВОЗМОЖНЫ ИЗМЕНЕНИЯ	*******
			 */


		}
	  