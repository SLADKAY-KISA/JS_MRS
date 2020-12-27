const Struct = (...keys) => ((...v) => keys.reduce((o, k, i) => {o[k] = v[i]; return o} , {}))
		const Item = Struct('marker', 'speed')
		
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

	   function getRoadsApi(x, y, option) {
		  
			x1 = randomInRange(55.021465, 55.012316); 	//случайная широта из допустимой области для генерации
			y1 = randomInRange(82.936089, 82.963985); 	//случайная долгота из допустимой области для генерации
			let URL_for_roads = "https://roads.googleapis.com/v1/snapToRoads?path=";
			let URL_x = x;
			let URL_y = y;
			let URL_x1 = x1;
			let URL_y1 = y1;
			let URL_interpolate = "&interpolate=true";
			let URL_key = "&key=AIzaSyC6UyUT2h5LiCC2ClU7WUqoQSGq5EPQOSQ";
			let URL_for_roads1 =  URL_for_roads.concat(URL_x,",",URL_y,"|",URL_x1,",",URL_y1,URL_interpolate,URL_key);
			var x_setNew_possion ;
			var y_setNew_possion ;
			var DATA;
					$.ajax({
						url: URL_for_roads1,
						method: "GET",
						async: false
					}).then(function(dataRoad) {
						console.log(dataRoad);
						x_setNew_possion = dataRoad.snappedPoints[0].location.latitude;
						y_setNew_possion = dataRoad.snappedPoints[0].location.longitude;
						DATA=dataRoad;
					});
			switch(option){
				case 1:
					return [x_setNew_possion,y_setNew_possion];
				case 2:
					return DATA;
			}				
		}

        /**
         * 
         * 
         */
		function CreateUnits(map, Number, markers) {
			//создание необходимого количества юнитов
			for (var j = markers.length, i = 0; i < Number; i++, j++) {
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
					title: "people"+j,
					icon: icon1,
					}); 
				}
				else{
					speed =  randomInRange(0.00007494, 0.00017486);
					
					var marker = new google.maps.Marker({
					position: position,
					map: map,
					title: "people"+j,
					icon: icon2,
					});
				}

				var view_result =  getRoadsApi(x,y, 1);
				var latlng = new google.maps.LatLng({lat: view_result[0], lng: view_result[1]});
				marker.setPosition(latlng);
				markers.push(Item(marker, speed));	//добавление в массив со всеми маркерами


			}

			console.log(markers);
			console.log(markers.length);
		}
		
		function oneStep(markers,view_result, j, i){
				console.log("I'm people №"+j+" and I'm walking "+i+" step!!");
				if(view_result[j].snappedPoints[i].location.latitude===markers[j].marker.getPosition().lat() && view_result[j].snappedPoints[i].location.longitude===markers[j].marker.getPosition().lng()){
					
				} else {
					setNewPosition(markers[j].marker, view_result[j].snappedPoints[i].location.latitude, view_result[j].snappedPoints[i].location.longitude);
					console.log("lat: "+markers[j].marker.getPosition().lat()+"lng: "+markers[j].marker.getPosition().lng());
				}	
		}
		

		function GenerateNewRoad(markers, j, view_result, NumberOfPointsAtRoad){
			view_result[j]=getRoadsApi(markers[j].marker.getPosition().lat(),markers[j].marker.getPosition().lng(), 2);
			console.log("view_result["+j+"]: "+view_result[j]);
			NumberOfPointsAtRoad[j]=view_result[j].snappedPoints.length;
			console.log("view_result["+j+"].snapped: "+view_result[j].snappedPoints.length);
		}

		let NumberOfPointsAtRoad = [];
		var view_result = [];

        /**
         * 
         * 
         */
		function UnitsMovement(map, Number, markers) {	
		for(var j = 0; j < Number; j++){
			view_result.push(getRoadsApi(markers[j].marker.getPosition().lat(),markers[j].marker.getPosition().lng(), 2));
			console.log("view_result["+j+"]: "+view_result[j]);
			NumberOfPointsAtRoad.push(view_result[j].snappedPoints.length);
			console.log("view_result["+j+"].snapped: "+view_result[j].snappedPoints.length);
		}

		var t=1;
		var tt = [];
		for(var j = 0; j < Number; j++){
			tt.push(1);
		}
		interval2 = setInterval(function(){
			for(var j = 0; j < Number; j++){
				if(flag == 1){ //Если была нажата кнопка остановки движения, то остановить движение и снова опустить флаг
					clearInterval(interval2);
					flag = 0;
				}
				if(tt[j] == NumberOfPointsAtRoad[j]){ 
					GenerateNewRoad(markers, j, view_result, NumberOfPointsAtRoad);
					tt[j]=1;
				}
				oneStep(markers,view_result, j, tt[j]);
				tt[j]++;
			}
			t++;
		}, 500);

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

				//console.log(view_result.Promise[1].PromiseResult[0]);

				
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
			$.ajax({
					url: URL1,
					method: "GET",
					async: false
			}).done(function(data) {
				way = data.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.kind;
			});
		
			// $.get("https://geocode-maps.yandex.ru/1.x/?apikey=197f1a96-6ccc-4845-aa21-7bd5de550213&geocode=&format=json?" 
			return way; 
		}


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

		// 	let x;
        // let y;
        // let speed;
        // var position;
        // var types = {};
        //   x = randomInRange(55.015465, 55.012316);
        //   y = randomInRange(82.956089, 82.963985);
        //   speed = 0.00002;
        //   position = { lat: x, lng: y};
        //   var marker = new google.maps.Marker({
        //     position: position,
        //     map: FirstMap,
        //     title: "person",
        //     icon: 'https://img.icons8.com/plasticine/80/000000/person-laying-down.png'
        //    });

		// 	var temp ;
        //   var way_human;
        //    temp=translate_from_lat_lon_to_minutes(marker.getPosition().lat(), marker.getPosition().lng());
        //      console.log(temp);
        //    way_human = getMAP(temp);
        //    console.log(way_human);


			// FirstMap.openInfoWindow(map.getCenter(), document.createTextNode("Hello, world")); 
			// markers[0].marker.openInfoWindowHtml('Москва – лучший город земли!');



			/**
			 * В планах:
			 * 	 - 	Место для ввода генерируемого количества юнитов
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
	  