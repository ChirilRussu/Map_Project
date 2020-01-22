$(function(){

    L.Control.LiveMouseCoordinatesControl = L.Control.extend({
        options: {
            position: 'bottomright',
            labelTemplate: "Coordinates: {0}",
            labelFormatter: undefined
        },

        onAdd: function(map){
            this._map = map;

            var className = 'leaflet-control-mapcodes',
                container = this._container = L.DomUtil.create('div', className),
                options = this.options;

            // label container
            this._labelcontainer = L.DomUtil.create("div", "uiElement label", container);
            this._label = L.DomUtil.create("span", "labelFirst", this._labelcontainer);

            // connect to mouseevents
            map.on("mousemove", this._update, this);
            map.whenReady(this._update, this);

            // return the container
            return container;
        },

        onRemove: function(map){
            map.off("mousemove", this._update, this);
        },

        _update: function(evt){
            var pos = evt.latlng;
            var opts = this.options;

            if (pos) {
                pos = pos.wrap();
                var mapcode = this.x_y_map_code(pos);
                this._label.innerHTML = this._createMapcodeLabel(mapcode);
            }
        },
		// x y coordinates
		x_y_map_code: function(point){
            var x = point.lng;
			var y = point.lat;
            return x.toFixed(1) + ', ' + y.toFixed(1);
        },

        _createMapcodeLabel: function(mapcode){
            var opts = this.options, l;
            if (opts.labelFormatter) {
                l = opts.labelFormatter(mapcode);
            } else {
                l = L.Util.template(opts.labelTemplate, {0: mapcode});
            }
            return l;
        }
    });

    L.control.liveCoordinates = function(opts) {
        return new L.Control.LiveMouseCoordinatesControl(opts);
    };

	// variables defined with json links from the published google doc(s)
    var googleSheetJsonUrl_1 = 'https://spreadsheets.google.com/feeds/list/1PIISVofJmBh0dNr4OkCzfepFKLSL2i5CUrGEdMhUnuA/1/public/values?alt=json'
	var googleSheetJsonUrl_2 = 'https://spreadsheets.google.com/feeds/list/1PIISVofJmBh0dNr4OkCzfepFKLSL2i5CUrGEdMhUnuA/2/public/values?alt=json'
	
	// var attributionHTML = 'Map data &copy; <a href="https://map.playatlas.com/">Grapeshot Games</a>, ';
	// attributionHTML += 'Grid map overlay by &copy; <a href="https://game-maps.com/ATLAS/ATLAS-MMO-World-Map.asp">Game-Maps.com</a>';

    var officialMapLayer = L.tileLayer("tiles/{z}/{x}/{y}.png", {
        maxZoom: 6,
        minZoom: 1,
     // attribution: attributionHTML,
        bounds: L.latLngBounds([0,0],[-256,256]),
        noWrap: true,
    });0
	
	// map layer
    var gridMapLayer = L.imageOverlay('AAmap.png', [[6.5,-6.5], [-259,256.5]]); 

    var map = L.map("map", {
        crs: L.CRS.Simple,
        layers: [officialMapLayer, gridMapLayer],
        maxZoom: 6,
        minZoom: 1
    }).setView([-128, 128], 2);

    L.control.layers({
        "Official Map Tiles": officialMapLayer
    }, {
        "Game-Maps.com Grid": gridMapLayer
    }).addTo(map);

    L.control.liveCoordinates({ position: 'bottomright' }).addTo(map);

// defining the icon class
var LeafIcon = L.Icon.extend({             
    options: {
        iconSize:     [30, 30],
        iconAnchor:   [15, 15],
        popupAnchor:  [-3, -76]
    }
});

// defining specific icons
var clover_icon = new LeafIcon({iconUrl: 'images/Clover.png'}),
    iris_icon = new LeafIcon({iconUrl: 'images/Iris.png'}),
    orangeIcon = new LeafIcon({iconUrl: 'leaf-orange.png'});

	//Markers from sheet 1 placed on the map
    $.ajax({
        url: googleSheetJsonUrl_1
    }).done(function(data) {
        console.log('google json', data);
        data.feed.entry.forEach(function(entry){
			var marker = L.marker([entry['gsx$y-axis']['$t'], entry['gsx$x-axis']['$t']], {icon: clover_icon});
			// on click popup sample code
         /* var markerPopupHtml = "<strong>Type: </strong>" + entry['gsx$group']['$t'];
            markerPopupHtml += "<br><strong>Name: </strong>" + entry['gsx$name']['$t'];
            if (entry['gsx$description']['$t'].length){
                markerPopupHtml += "<br><strong>Description: </strong>" + entry['gsx$description']['$t'];
            }
            marker.bindPopup(markerPopupHtml); */
            marker.addTo(map)
        })
    });
	//sheet 2
	    $.ajax({
        url: googleSheetJsonUrl_2
    }).done(function(data) {
        console.log('google json', data);
        data.feed.entry.forEach(function(entry){
            var marker = L.marker([entry['gsx$y-axis']['$t'], entry['gsx$x-axis']['$t']], {icon: iris_icon});
            marker.addTo(map)
        })
    });
});

// TODO
// https://github.com/CliffCloud/Leaflet.EasyButton
// https://github.com/lvoogdt/Leaflet.awesome-markers