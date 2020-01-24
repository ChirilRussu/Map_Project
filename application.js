$(function()
{
    L.Control.LiveMouseCoordinatesControl = L.Control.extend(
	{
        options: 
		{
            position: 'bottomright',
            labelTemplate: "Coordinates: {0}",
            labelFormatter: undefined
        },

        onAdd: function(map)
		{
            this._map = map;

            var className = 'leaflet-control-mapcodes',
                container = this._container = L.DomUtil.create('div', className),
                options = this.options;

            // label container for the coordinate box
            this._labelcontainer = L.DomUtil.create("div", "uiElement label", container);
            this._label = L.DomUtil.create("span", "labelFirst", this._labelcontainer);

            // connect to mouseevents
            map.on("mousemove", this._update, this);
            map.whenReady(this._update, this);

            // return the container
            return container;
        },

        onRemove: function(map)
		{
            map.off("mousemove", this._update, this);
        },

        _update: function(evt)
		{
            var pos = evt.latlng;
            var opts = this.options;

            if (pos) 
			{
                pos = pos.wrap();
                var mapcode = this.x_y_map_code(pos);
                this._label.innerHTML = this._createMapcodeLabel(mapcode);
            }
        },
		
		// x y coordinates
		x_y_map_code: function(point)
		{
            var x = point.lng;
			var y = point.lat;
            return x.toFixed(1) + ', ' + y.toFixed(1);
        },

        _createMapcodeLabel: function(mapcode)
		{
            var opts = this.options, l;
            if (opts.labelFormatter) 
			{
                l = opts.labelFormatter(mapcode);
            } 
			else 
			{
                l = L.Util.template(opts.labelTemplate, {0: mapcode});
            }
            return l;
        }
    });

    L.control.liveCoordinates = function(opts) 
	{
        return new L.Control.LiveMouseCoordinatesControl(opts);
    };
	
	// unused but the application expects tiles
	var officialMapLayer = L.tileLayer("tiles/{z}/{x}/{y}.png", 
	{
    maxZoom: 6,
    minZoom: 1,
    bounds: L.latLngBounds([0,0],[-256,256]),
    noWrap: true,
    });0
	
	// map layer
    var the_map = L.imageOverlay('AAmap.png', [[0,0], [-259,256.5]]); 

    var map = L.map("map", 
	{
        crs: L.CRS.Simple,
        layers: [officialMapLayer, the_map],
        maxZoom: 6,
        minZoom: 1
    }).setView([-128, 128], 2);

	//defining the base layer for the filter box - the world map.
	var baseLayers = 
	{
	"ArcheAge Map": the_map
	};

	//filters - needs a new entry every sheet.
	var Clover = new L.LayerGroup();
	var Iris = new L.LayerGroup();
	
	// turns the layers on by default - needs a new entry every sheet
	map.addLayer(Clover)
	map.addLayer(Iris)	
	
	// defining overlays - used as resource filters - needs a new entry every sheet
	var overlays = 
	{
	"Clovers" : Clover,
	"Iris" : Iris
	};
	
	// Adds base layer and overlays to the map
    L.control.layers(baseLayers, overlays).addTo(map);
    L.control.liveCoordinates({ position: 'bottomright' }).addTo(map);

	// Defining the icon class
	var Icon_Class = L.Icon.extend(
	{             
    options: 
		{
			iconSize:     [30, 30],
			iconAnchor:   [15, 15],
			popupAnchor:  [-3, -76]
		}
	});
		
	var N_of_sheets = 3;
	var i;
	
	for(i = 1; i < N_of_sheets; i++)
	{
		// Defining specific icons
		// var icon_1 = new Icon_Class({iconUrl: 'images/i.png'}); // where i itterates
		eval('var icon_' + i + " = new Icon_Class({iconUrl: 'images/'+ i +'.png'});");
		
		// Stores the data from the published JSON
		// var googleSheetJsonUrl_i = 'https://spreadsheets.google.com/feeds/list/1PIISVofJmBh0dNr4OkCzfepFKLSL2i5CUrGEdMhUnuA/i+1/public/values?alt=json' // where i itterates
		eval('var googleSheetJsonUrl_' + i + '= ' + "'https://spreadsheets.google.com/feeds/list/1PIISVofJmBh0dNr4OkCzfepFKLSL2i5CUrGEdMhUnuA/'" + '+(i+1)+' + "'/public/values?alt=json'");
	}

	// Markers from a sheet placed on the map - - needs a new entry every sheet
	// sheet 1
    $.get({url: googleSheetJsonUrl_1}).then(function(data)
	{
        data.feed.entry.forEach(function(entry)
		{
			var resource_icon = entry['gsx$resource']['$t'];
			var marker_1 = L.marker([entry['gsx$y-axis']['$t'], entry['gsx$x-axis']['$t']], {icon: eval(resource_icon)}); // icon number changes
			var icon_layer;
			switch(resource_icon)
				{
				case "icon_1":
				icon_layer = "Clover";
				break;
				case "icon_2":
				icon_layer = "Iris";
				break;
				}
				
			marker_1.addTo(eval(icon_layer))
		})
	})
});