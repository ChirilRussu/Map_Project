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
	
	// Values to change when adding things
	var N_of_sheets = 1+3;		// +1 when adding a sheet
	var N_of_filters = 4;		// +1 when adding a filter box
	var N_of_resources = 4;		// +1 when adding a resource
	
	// map layer
    var the_map = L.imageOverlay('AAmap.png', [[0,0], [-259,256.5]]); 
	// map settings
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

	var h;
	for(h = 0; h < N_of_filters; h++)
	{
		eval("var filter_" + h + " = new L.LayerGroup();");
	}	   // var filter_[h] = new L.LayerGroup(); // where [h] increments
		
	// turns the filters on by default
	/*
	map.addLayer(filter_0)     
	map.addLayer(filter_1)	     
	map.addLayer(filter_2)	 
	map.addLayer(filter_3)	
	*/
	
	// defining overlays - used as resource filters - needs a new entry every sheet
	var overlays = 
	{
	
		
		"Clovers" : filter_0,
		"Iris" : filter_1,
		"Mushroom" : filter_2,
		"Thistle" : filter_3
	}	// "NAME_OF_FILTER_HERE" : filter_			
	// copy / paste / change the name that will display / add the next number to filter_ / add a comma to the previous one

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
			popupAnchor:  [0, -15]
		}
	});
	
	// Stores the data from the published JSON
	var j;
	for(j = 0; j < N_of_sheets; j++)
	{	
		eval('var googleSheetJsonUrl_' + j + '= ' + "'https://spreadsheets.google.com/feeds/list/1PIISVofJmBh0dNr4OkCzfepFKLSL2i5CUrGEdMhUnuA/'" + '+(j+1)+' + "'/public/values?alt=json'");
	}      // var googleSheetJsonUrl_[j] = 'https://spreadsheets.google.com/feeds/list/1PIISVofJmBh0dNr4OkCzfepFKLSL2i5CUrGEdMhUnuA/[j]+1/public/values?alt=json' // where [j] increments
																																								  // + 1 to skip the info sheet
	// Defining specific icons
	var i;
	for(i = 0; i < N_of_resources; i++)
	{
		eval('var icon_' + i + " = new Icon_Class({iconUrl: 'images/'+ i +'.png'});");
	}      // var icon_[i] = new Icon_Class({iconUrl: 'images/[i].png'}); // where [i] increments

	// Markers from a sheet placed on the map - needs a new entry every sheet
	// sheet 1
    $.get({url: googleSheetJsonUrl_1}).then(function(data) // +1 to the url when adding a getter
	{
        data.feed.entry.forEach(function(entry)
		{
			var resource_name = entry['gsx$resource']['$t']; // stores the resource name from the sheet
			var resource_icon;
			var icon_layer;
			
			switch(resource_name)	 		// Switch for icon selection and layer placement for filtering
			{
				case "Clover":		 		// reads the resource name from the sheet		
				resource_icon = "icon_0";   // assigns the first icon
				icon_layer = "filter_0";	// assigns it to the first layer
				break;
				case "Iris":
				resource_icon = "icon_1";
				icon_layer = "filter_1";
				break;
				case "Mushroom":
				resource_icon = "icon_2";
				icon_layer = "filter_2";
				break;
				case "Thistle":
				resource_icon = "icon_3";
				icon_layer = "filter_3";
				break;
			}	
			// adds the markers to the coordinates taken from the sheet and assigns an icon
			var marker = L.marker([entry['gsx$y-axis']['$t'], entry['gsx$x-axis']['$t']], {icon: eval(resource_icon)});
			marker.addTo(eval(icon_layer))
			// adds a popup if the sheet has something written in the popup cell
			var markerPopupHtml;
            if (entry['gsx$popup']['$t'] != "")
			{
				var markerPopupHtml = entry['gsx$popup']['$t'];
				marker.bindPopup(markerPopupHtml);
            }
		})
	})
	
	// load test
	$.get({url: googleSheetJsonUrl_2}).then(function(data)
	{
        data.feed.entry.forEach(function(entry)
		{
			var resource_name = entry['gsx$resource']['$t'];
			var resource_icon;
			var icon_layer;
			
			switch(resource_name)
			{
				case "Clover":
				resource_icon = "icon_0";
				icon_layer = "filter_0";
				break;
				case "Iris":
				resource_icon = "icon_1";
				icon_layer = "filter_1";
				break;
				case "Mushroom":
				resource_icon = "icon_2";
				icon_layer = "filter_2";
				break;
				case "Thistle":
				resource_icon = "icon_3";
				icon_layer = "filter_3";
				break;
			}	
				
			var marker = L.marker([entry['gsx$y-axis']['$t'], entry['gsx$x-axis']['$t']], {icon: eval(resource_icon)}); // icon number changes
			marker.addTo(eval(icon_layer))
			
			var markerPopupHtml;
            if (entry['gsx$popup']['$t'] != "")
			{
				var markerPopupHtml = entry['gsx$popup']['$t'];
				marker.bindPopup(markerPopupHtml);
            }
		})
	})
	
	// load test 2
	$.get({url: googleSheetJsonUrl_3}).then(function(data)
	{
        data.feed.entry.forEach(function(entry)
		{
			var resource_name = entry['gsx$resource']['$t'];
			var resource_icon;
			var icon_layer;
			
			switch(resource_name)
			{
				case "Clover":
				resource_icon = "icon_0";
				icon_layer = "filter_0";
				break;
				case "Iris":
				resource_icon = "icon_1";
				icon_layer = "filter_1";
				break;
				case "Mushroom":
				resource_icon = "icon_2";
				icon_layer = "filter_2";
				break;
				case "Thistle":
				resource_icon = "icon_3";
				icon_layer = "filter_3";
				break;
			}	
				
			var marker = L.marker([entry['gsx$y-axis']['$t'], entry['gsx$x-axis']['$t']], {icon: eval(resource_icon)}); // icon number changes
			marker.addTo(eval(icon_layer))
			
			var markerPopupHtml;
            if (entry['gsx$popup']['$t'] != "")
			{
				var markerPopupHtml = entry['gsx$popup']['$t'];
				marker_1.bindPopup(markerPopupHtml);
            }
		})
	})
});