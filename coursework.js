const Struct = (...keys) => ((...v) => keys.reduce((o, k, i) => {o[k] = v[i]; return o} , {}))
		const Item = Struct('marker', 'speed')
		const Step = Struct('step_lat', 'step_lng')
		
		let markers = [];
		var interval1;
		var flag = 0;
		var chicago = { lat: 55.014690, lng: 82.959608 };
		
		let NumberOfPointsAtRoad = [];
		var view_result = [];

		
		/**
		 * Функция для генерации случайного вещественного числа с двойной точностью из заданного диапазона
		 * @param {number} min минимальная граница диапазона
		 * @param {number} max максимальная граница диапазона
		 * @return {number} возвращает сгенерированное вещественное число
		 */
		function randomInRange(min, max) {
			return Math.random() < 0.5 ? ((1-Math.random()) * (max-min) + min) : (Math.random() * (max-min) + min);
		} 

		/**
		 * Функция для генерации случайного натурального числа из заданного диапазона
		 * @param {number} min минимальная граница диапазона
		 * @param {number} max максимальная граница диапазона
		 * @return {number} возвращает сгенерированное натуральное число
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
		 * Функция для перевода заданного числа в значение угла
		 * @param {number} x число, которое необходимо перевести в радианы
		 * @return {number} возвращает значение заданного числа в радианах
		 */
		function rad(x) {
			return x * Math.PI / 180;
		}

		
		
		function PointsDifference(point1_lat, point1_lng, point2_lat, point2_lng){
			var LatitudeDifference = point2_lat-point1_lat;
			var LongitudeDifference = point2_lng-point1_lng;
			return [LatitudeDifference, LongitudeDifference];
		}

		
		function StepBetweenPoints(PointsDifferences, speed_kph, distance){
			var speed_mps = speed_kph*1000/3600;
			var step_lat = (PointsDifferences[0])*speed_mps/distance;
			var step_lng = (PointsDifferences[1])*speed_mps/distance;
			return [step_lat, step_lng];
		}
		
		function GenerateNewRoad(markers, j, view_result, NumberOfPointsAtRoad){
			view_result[j]=getRoadsApi(markers[j].marker.getPosition().lat(),markers[j].marker.getPosition().lng(), 2);
			//console.log("view_result["+j+"]: "+view_result[j]);
			NumberOfPointsAtRoad[j]=view_result[j].snappedPoints.length;
			// console.log("view_result["+j+"].snapped: "+view_result[j].snappedPoints.length);
		}

		/**
			 * 
			 * 
			 */
		function DistanceBetweenTwoPoints(point1_lat, point1_lng, point2_lat, point2_lng){
			//marker1, marker2) {
			var R = 6378137;
			var dLat = rad(point2_lat - point1_lat);
			var dLong = rad(point2_lng - point1_lng);
			var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + 
			Math.cos(rad(point1_lat)) * Math.cos(rad(point2_lat)) *
			Math.sin(dLong / 2) * Math.sin(dLong / 2);
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
			var d = R * c;
			return d;
			// console.log(d);
		};

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
			 * 
			 * 
			 */
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
					speed =  randomizeInteger(3,7);
					var marker = new google.maps.Marker({
					position: position,
					map: map,
					title: "people #"+j +"\nspeed: " + speed + "km/h",
					icon: icon1,
					}); 
				}
				else{
					speed =  randomizeInteger(30,70);

					var marker = new google.maps.Marker({
					position: position,
					map: map,
					title: "people #"+j +"\nspeed: " + speed + "km/h",
					icon: icon1,
					});
				}

				var positionAtRoad =  getRoadsApi(x, y, 1);
				var latlng = new google.maps.LatLng({lat: positionAtRoad[0], lng: positionAtRoad[1]});
				marker.setPosition(latlng);
				markers.push(Item(marker, speed));	//добавление в массив со всеми маркерами
				view_result.push();
				NumberOfPointsAtRoad.push(0);

			}

			// console.log(markers);
			// console.log(markers.length);
		}

        /**
         * 
         * 
         */
		function UnitsMovement(map, Number, markers, Speed) {

			if(Speed != 0 ){
				for(var j = 0; j < Number; j++){
					markers[j].marker.title = "people #"+j +"\nspeed: " + Speed + "km/h";
					markers[j].speed = Speed;
				}
			}
			for(var j = 0; j < Number; j++){
				// console.log("Units Movement numb: "+Number);			
				// console.log("Begin movement!!! unit: "+j+"      lat == "+markers[j].marker.getPosition().lat()+" lng == "+markers[j].marker.getPosition().lng());
				
				console.log("speed for unit#"+j+": "+markers[j].speed+" km/h");
				GenerateNewRoad(markers, j, view_result, NumberOfPointsAtRoad);
				//console.log("view_result["+j+"]: "+view_result[j]);
				//console.log("view_result["+j+"].snapped: "+view_result[j].snappedPoints.length);
			}

			var t=1;
			var tt = []; //текущая точка в маршруте для каждого юнита
			currentstep = []; //структура типа [шаг по широте, шаг по долготе]
			for(var j = 0; j < Number; j++){
				tt.push(1);
				var diff = PointsDifference(
						markers[j].marker.getPosition().lat(),
						markers[j].marker.getPosition().lng(),
						view_result[j].snappedPoints[1].location.latitude,
						view_result[j].snappedPoints[1].location.longitude);
				var distance = DistanceBetweenTwoPoints(
						markers[j].marker.getPosition().lat(),
						markers[j].marker.getPosition().lng(),
						view_result[j].snappedPoints[1].location.latitude,
						view_result[j].snappedPoints[1].location.longitude);
				var beginstep = StepBetweenPoints(diff, markers[j].speed, distance);
				currentstep.push(Step(beginstep[0], beginstep[1]));
			}
			console.log(currentstep);

			interval2 = setInterval(function(){
				for(j = 0; j < Number; j++){
					if(flag == 1){ //Если была нажата кнопка остановки движения, то остановить движение и снова опустить флаг
						clearInterval(interval2);
						flag = 0;
					}

					//если текущая точка по счету для этого юнита равна последней точке в его маршруте, то создай новый маршрут
					if(tt[j] == NumberOfPointsAtRoad[j]-1){ 
						GenerateNewRoad(markers, j, view_result, NumberOfPointsAtRoad);
						tt[j]=0; //
					}

					var distanceVeryShort = DistanceBetweenTwoPoints(
							markers[j].marker.getPosition().lat(),
							markers[j].marker.getPosition().lng(),
							view_result[j].snappedPoints[tt[j]].location.latitude,
							view_result[j].snappedPoints[tt[j]].location.longitude);
					var distanceWithStep = DistanceBetweenTwoPoints(
							markers[j].marker.getPosition().lat(),
							markers[j].marker.getPosition().lng(),
							markers[j].marker.getPosition().lng()+currentstep[j].step_lat,
							markers[j].marker.getPosition().lng()+currentstep[j].step_lng);
					/*если текущая точка за один шаг перепрыгнет точку на маршруте, 
					то поставь эту точку вместо "предполагаемого места" на точку маршрута, которую он бы перепрыгнул
					*/
					if(distanceVeryShort < distanceWithStep && markers[j].speed > 8)
					{
						console.log("We caught bullshit");
						setNewPosition(
							markers[j].marker, 
							view_result[j].snappedPoints[tt[j]].location.latitude, 
							view_result[j].snappedPoints[tt[j]].location.longitude
						);
						tt[j]++;
						var diff = PointsDifference(
								markers[j].marker.getPosition().lat(),
								markers[j].marker.getPosition().lng(),
								view_result[j].snappedPoints[tt[j]].location.latitude,
								view_result[j].snappedPoints[tt[j]].location.longitude);
						var distance = DistanceBetweenTwoPoints(
								markers[j].marker.getPosition().lat(),
								markers[j].marker.getPosition().lng(),
								view_result[j].snappedPoints[tt[j]].location.latitude,
								view_result[j].snappedPoints[tt[j]].location.longitude);
						var newstep = StepBetweenPoints(diff, markers[j].speed, distance);
						currentstep[j] = Step(newstep[0], newstep[1]);



						
					}
					else{
						//Если текущая позиция юнита совпадает с преследуемой точкой маршрута, то перейди к достижению следующей точки маршрута
						if( Math.abs(markers[j].marker.getPosition().lat() - view_result[j].snappedPoints[tt[j]].location.latitude) <= 0.00001 &&
							Math.abs(markers[j].marker.getPosition().lng() - view_result[j].snappedPoints[tt[j]].location.longitude) <= 0.00001){
							tt[j]++;
							//здесь вызови некую функцию рассчета нового шага для текущего юнита
							var diff = PointsDifference(
									markers[j].marker.getPosition().lat(),
									markers[j].marker.getPosition().lng(),
									view_result[j].snappedPoints[tt[j]].location.latitude,
									view_result[j].snappedPoints[tt[j]].location.longitude);
							var distance = DistanceBetweenTwoPoints(
									markers[j].marker.getPosition().lat(),
									markers[j].marker.getPosition().lng(),
									view_result[j].snappedPoints[tt[j]].location.latitude,
									view_result[j].snappedPoints[tt[j]].location.longitude);
							var newstep = StepBetweenPoints(diff, markers[j].speed, distance);
							currentstep[j] = Step(newstep[0], newstep[1]);

						}
						//Иначе перемести юнита на один шаг в соответствии с текущим его личным шагом для его личного расстояния
						else{
							setNewPosition(
									markers[j].marker, 
									markers[j].marker.getPosition().lat()+currentstep[j].step_lat, 
									markers[j].marker.getPosition().lng()+currentstep[j].step_lng
							);

						}
					}
					console.log(tt[j]);
				}
				t++;
			}, 100);
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
				var Number = 10;
				var numb = document.getElementById("Number");
				if(numb.value != 0)
					Number = numb.value;
				// console.log(numb.value);
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


				var Speed = 0;//km/h
				var Sp = document.getElementById("Speed");
				if(Sp.value != 0)
					Speed = Sp.value;
				// console.log(Sp.value);

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
				UnitsMovement(map, Number, markers, Speed);
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
		function StopMoving_Button(controlDiv, map, interval,markers){

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


				var Number = markers.length;
				// console.log("SUKA "+Number);
				console.log("ITS BEEN CLICKED: " + flag);
				for(var j = 0; j < Number; j++){
					// console.log("ERTYUI "+j);
					// console.log("End!!! unit: "+j+"      lat == "+markers[j].marker.getPosition().lat()+" lng == "+markers[j].marker.getPosition().lng());

				}

				flag = 1;
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
			view_result.length = 0;
			NumberOfPointsAtRoad.length = 0;
			});
		}

		/**
			 * 
			 * 
			 */
		function initMap() {

			//параметры карты
			var pos = { lat: 55.014690, lng: 82.959608 } //координаты позиции центра для отображения карты
			var opt = {
				center: pos,
				zoom: 15,
			}

			//создание объекта типа "Карта"
			var FirstMap = new google.maps.Map(document.getElementById("map"), opt);
			//TextBox для ввода скорости, по умолчанию будт генерироваться случайным образом
			const SpeedUnits = document.createElement("input");
			SpeedUnits.id = "Speed";
			SpeedUnits.size = "4";
			SpeedUnits.placeholder = "Speed";
			UI_ForButtons(SpeedUnits);
			FirstMap.controls[google.maps.ControlPosition.TOP_CENTER].push(
				SpeedUnits
			);

			//TextBox для ввода количества юнитов, по умолчанию 10
			const NumberUnits = document.createElement("input");
			NumberUnits.id = "Number";
			NumberUnits.size = "4";
			NumberUnits.placeholder = "Units";
			UI_ForButtons(NumberUnits);
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
			StopMoving_Button(StopMovement, FirstMap, interval1,markers);
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
			
