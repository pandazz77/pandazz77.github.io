const IconSize = 30;

var shopIcon = L.icon({
    iconUrl: './assets/images/shop.png',

    iconSize:     [IconSize, IconSize], // size of the icon
    iconAnchor:   [IconSize/2, IconSize/2], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
});

var ammoIcon = L.icon({
    iconUrl: './assets/images/ammo.png',

    iconSize:     [IconSize, IconSize], // size of the icon
    iconAnchor:   [IconSize/2, IconSize/2], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
});

var clothesIcon = L.icon({
    iconUrl: './assets/images/clothes.png',

    iconSize:     [IconSize, IconSize], // size of the icon
    iconAnchor:   [IconSize/2, IconSize/2], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
});

var barberIcon = L.icon({
    iconUrl: './assets/images/barber.png',

    iconSize:     [IconSize, IconSize], // size of the icon
    iconAnchor:   [IconSize/2, IconSize/2], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
});

var tattooIcon = L.icon({
    iconUrl: './assets/images/tattoo.png',

    iconSize:     [IconSize, IconSize], // size of the icon
    iconAnchor:   [IconSize/2, IconSize/2], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
});

const ICONS = {
    "shop":shopIcon,
    "ammo":ammoIcon,
    "clothes":clothesIcon,
    "barber":barberIcon,
    "tattoo":tattooIcon
}

var markers = [];
var start_marker;
var route_layer;
var popup_dict = {};
var click_mode = "mark"; // ["mark","coords"]
const shop = [[216,461],[252,360],[294,337],[350,488],[245,550],[355,663],[588,674],[625,616],[614,571],[542,552],[540,502],[721,596],[840,596],[406,198],[373,213],[359,219],[388,311],[251,401],[297,552],[183,455],[857,471],[833,446]];
const ammo = [[149,522],[239,524],[234,460],[249,405],[291,352],[320,476],[346,665],[413,202],[539,369],[625,595],[814,431]];
const clothes = [[309,471],[299,446],[241,392],[539,369],[315,401],[307,340],[711,595],[849,455],[545,509],[263,363],[213,465],[542,550],[411,205],[259,490],[297,400]];
const barber = [[451,634],[826,436],[287,555],[187,470],[625,613],[310,392],[235,354]];
const tattoo = [[339,485],[193,565],[211,365],[411,205],[627,607],[823,435]];



function ArrString2Int(string_array){
    let result = [];
    for(let i=0;i<string_array.length;i++) result.push(parseInt(string_array[i]));
    return result;
}

function add_marker(coords,icon_name,popup_message){
    console.log("add marker:",coords,popup_message);
    if(!coords) return;
    let marker = L.marker(coords,{icon: ICONS[icon_name]});
    popup_dict[marker.getLatLng()] = popup_message;
    marker.bindPopup(popup_message).openPopup();
    marker.addTo(map);
    markers.push(marker);
}

function set(){
    let shop_data = document.getElementById("shop")
    let ammo_data = document.getElementById("ammo")
    let clothes_data = document.getElementById("clothes")
    let barber_data = document.getElementById("barber")
    let tattoo_data = document.getElementById("tattoo")
    if(shop_data.value){
            if(shop_data.value.includes(" ")) shop_data = ArrString2Int(shop_data.value.split(" "));
            else shop_data = [parseInt(shop_data.value)];
            shop_data.forEach(element => add_marker(shop[element-1],"shop","24/7 "+element));
    }
    if(ammo_data.value){
            if(ammo_data.value.includes(" ")) ammo_data = ArrString2Int(ammo_data.value.split(" "));
            else ammo_data = [parseInt(ammo_data.value)];
            ammo_data.forEach(element => add_marker(ammo[element-1],"ammo","Ammo "+element));
    }
    if(clothes_data.value){
            if(clothes_data.value.includes(" ")) clothes_data = ArrString2Int(clothes_data.value.split(" "));
            else clothes_data = [parseInt(clothes_data.value)];
            clothes_data.forEach(element => add_marker(clothes[element-1],"clothes","Clothes "+element));
    }
    if(barber_data.value){
            if(barber_data.value.includes(" ")) barber_data = ArrString2Int(barber_data.value.split(" "));
            else barber_data = [parseInt(barber_data.value)];
            barber_data.forEach(element => add_marker(barber[element-1],"barber","Barber "+element));
    }
    if(tattoo_data.value){
            if(tattoo_data.value.includes(" ")) tattoo_data = ArrString2Int(tattoo_data.value.split(" "));
            else tattoo_data = [parseInt(tattoo_data.value)];
            tattoo_data.forEach(element => add_marker(tattoo[element-1],"tattoo","Tattoo "+element));
    }
}

function distance(latlng1, latlng2){
    let a = Math.max(latlng1.lat,latlng2.lat)-Math.min(latlng1.lat,latlng2.lat);
    let b = Math.max(latlng1.lng,latlng2.lng)-Math.min(latlng1.lng,latlng2.lng);
    return Math.sqrt(Math.pow(a,2)+Math.pow(b,2));
}

function draw_route(latlng_array){
    let arr = [];
    latlng_array.forEach(el => arr.push(el));
    route_layer = L.polyline(arr,{color:"red"}).addTo(map);
}

function asyncAlert(msg){
    setTimeout(function() { alert(msg); }, 1);
}

function alert_route(latlng_array){
    let alert_message = "";
    let i = 1;
    latlng_array.forEach(el => {
        if(popup_dict[el]) alert_message+=i++ +") "+popup_dict[el]+"\n";
    });
    asyncAlert(alert_message);
}

function calc_route(){
    let route = [start_marker.getLatLng()]
    let copy_markers = markers.slice();
    if(!copy_markers.length) return;
    for(let i=0;i<markers.length;i++){
        console.log("cm:",copy_markers)
        let distance_array = [];
        let temp_coords = []
        console.log("Elements:")
        copy_markers.forEach(el => {
            el = el.getLatLng();
            console.log(el)
            distance_array.push(distance(route[route.length-1],el));
            temp_coords.push(el);
        });
        console.log("distance",distance_array)
        let pos = distance_array.indexOf(Math.min(...distance_array));
        console.log("Pos",pos)
        route.push(temp_coords[pos]);
        console.log("++route",temp_coords[pos])
        console.log("--marker",copy_markers[pos])
        copy_markers.splice(pos,1);
    }
    console.log("route",route);
    draw_route(route);
    alert_route(route);

}

function clearall(){
    if(markers)markers.forEach(marker => marker.remove());
    if(start_marker)start_marker.remove();
    if(route_layer)route_layer.remove();
    markers = [];
    start_marker;
    route_layer;
    popup_dict = {};
}

function change_click_mode(){
    if(click_mode=="coord") click_mode="mark";
    if(click_mode=="mark") click_mode="coord";
}

function onMapClick(e) {
    if(click_mode=="coord")
        popup.setLatLng(e.latlng).setContent(e.latlng.toString()).openOn(map);
    if(click_mode=="mark"){
        if(start_marker) start_marker.remove();
        let marker = L.marker(e.latlng).addTo(map);
        start_marker = marker;
    }
}

var popup = L.popup();

map.on('click', onMapClick);