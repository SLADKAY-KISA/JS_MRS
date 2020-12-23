function WalkForOneUnit(){

let x;			//широта
        let y; 			//долгота
        let speed;		//гр/сек
        var position;		//направление движения
		let markers = [];	//массив, содержащий маркеры всех юнитов на карте
		
        x = randomInRange(55.015465, 55.012316);
        y = randomInRange(82.956089, 82.963985);
        speed1 = 0.00001;
        position1 = { lat: x, lng: y};
        var markerr = new google.maps.Marker({
        	position: position1,
          	map: FirstMap,
          	title: "person",
          	icon: 'https://img.icons8.com/plasticine/80/000000/person-laying-down.png'
        });
        let direction = 1;
        var t=0;
        var interval =  setInterval(function() {
        	console.log("tr\n");
          	t++;
          	if(t == 300){
           		clearInterval(interval);
        	}
          	for (var i = 0; i < 10; i++) {
            	if(t % 30 == 0){
              	direction = randomizeInteger(1,5);
            	}
            	console.log("i: "+i+"\tdir:"+direction);
            	changeMarkerPosition(markerr, markerr.getPosition().lat(), markerr.getPosition().lng(), speed1, direction);
          	}
        }, 100);
}