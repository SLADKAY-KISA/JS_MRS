
/**
 * 
 * 
 */
function getMAP(temp){
	let URL = "https://geocode-maps.yandex.ru/1.x/?apikey=YOUR_KEY&geocode=" ;
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

/**
 * 
 * 
 */
function translate_from_lat_lon_to_minutes(lon,lat) {
	var point = new GeoPoint(lon, lat);
	return [point.getLonDeg(),point.getLatDeg()];
}
