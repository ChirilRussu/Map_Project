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
	var N_of_sheets = 1+3;		// +1 when adding a sheet  		 // an extra 1 becuase google sheets start counting at 1
	var N_of_filters = 1+5;		// +1 when adding a filter box	 // an extra 1 because filter 0 corresponds to icon 0 which is a placeholders
	var N_of_resources = 5;		// +1 when adding a resource
	
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
	for(h = 1; h < N_of_filters; h++)		// h = 1 and not 0 becuase icon 0 is for placeholders and doens't need a filter
	{
		eval("var filter_" + h + " = new L.LayerGroup();");
	}	   // var filter_[h] = new L.LayerGroup(); // where [h] increments
		
	// turns the filters on by default
	/*
	map.addLayer(filter_1)	     
	map.addLayer(filter_2)	 
	map.addLayer(filter_3)	
	*/
	
	// defining overlays - used as resource filters - needs a new entry every sheet
	var overlays = 
	{
		"Clovers" : filter_1,
		"Iris" : filter_2,
		"Mushroom" : filter_3,
		"Thistle" : filter_4,
		"Placeholder_1" : filter_5

	}	// "NAME_OF_FILTER_HERE" : filter_			
	// copy / paste / change the name that will display / add the next number to filter_ / add a comma to the previous one
	
	// Adds base layer and overlays to the map
    L.control.layers(baseLayers, overlays, {hideSingleBase: true} ,{sortLayers: true,}).addTo(map);
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
	
	// Stores the data from the published doc's JSON
	var j;
	for(j = 1; j < N_of_sheets; j++)
	{										
		eval('var googleSheetJsonUrl_' + j + '= ' + "'https://spreadsheets.google.com/feeds/list/1wtX_-TxHgM62Zk2MBFRzEY-sy03RtUxiSNe7_ykdfB4/'" + '+(j)+' + "'/public/values?alt=json'");
	}      // var googleSheetJsonUrl_[j] = 'https://spreadsheets.google.com/feeds/list/1PIISVofJmBh0dNr4OkCzfepFKLSL2i5CUrGEdMhUnuA/[j]/public/values?alt=json' // where [j] increments
																																								  
	// Defining icon variables and linking them to icon images
	var i;
	for(i = 0; i < N_of_resources; i++)
	{
		eval('var icon_' + i + " = new Icon_Class({iconUrl: 'images/'+ i +'.png'});");
	}      // var icon_[i] = new Icon_Class({iconUrl: 'images/[i].png'}); // where [i] increments

	// Markers from a sheet placed on the map - needs a new getter every sheet and a new switch every resource
	// discord bot sheet
	var k = 1; // used to itterate the url call of the getters
    $.get({url: eval("googleSheetJsonUrl_"+ k)}).then(function(data)
	{
        data.feed.entry.forEach(function(entry)
		{
			var resource_name = entry['gsx$resource']['$t']; // stores the resource name from the sheet
			var marker_icon;								 // used to pass the icon that a marker will be assigned to
			var filter_layer;								 // used to pass the filter to which a marker will be assigned to
			
			switch(resource_name.toLowerCase())	 		// Switch for icon selection and layer placement for filtering
			{
				case "clover":		 		// reads the resource name from the sheet		
				marker_icon = "icon_1";   // assigns icon 1 to the marker
				filter_layer = "filter_1";	// assigns the marker to filter 1
				break;
				case "iris":
				marker_icon = "icon_2";
				filter_layer = "filter_2";
				break;
				case "mushroom":
				marker_icon = "icon_3";
				filter_layer = "filter_3";
				break;
				case "thistle":
				marker_icon = "icon_4";
				filter_layer = "filter_4";
				break;
				case "placeholder_1":
				marker_icon = "icon_0";
				filter_layer = "filter_5";
				break;
			}	
			// adds the markers to the coordinates taken from the sheet and assigns an icon
			var marker = L.marker([entry['gsx$y-axis']['$t'], entry['gsx$x-axis']['$t']], {icon: eval(marker_icon)});
			marker.addTo(eval(filter_layer))
			
			// adds a popup if the sheet has something written in the popup cell
			var markerPopupHtml;
            if (entry['gsx$popup']['$t'] != "")
			{
				var markerPopupHtml = entry['gsx$popup']['$t'];
				marker.bindPopup(markerPopupHtml);
            }
		})
	})
	k++;
	
	// google form sheet in case the bot is down
	$.get({url: eval("googleSheetJsonUrl_"+ k)}).then(function(data)
	{
        data.feed.entry.forEach(function(entry)
		{
			var resource_name = entry['gsx$resource']['$t'];
			var marker_icon;
			var filter_layer;
			
			switch(resource_name.toLowerCase())
			{
				case "clover":		
				marker_icon = "icon_1"; 
				filter_layer = "filter_1";
				break;
				case "iris":
				marker_icon = "icon_2";
				filter_layer = "filter_2";
				break;
				case "mushroom":
				marker_icon = "icon_3";
				filter_layer = "filter_3";
				break;
				case "thistle":
				marker_icon = "icon_4";
				filter_layer = "filter_4";
				break;
				case "placeholder_1":
				marker_icon = "icon_0";
				filter_layer = "filter_5";
				break;
			}	
				
			var marker = L.marker([entry['gsx$y-axis']['$t'], entry['gsx$x-axis']['$t']], {icon: eval(marker_icon)});
			marker.addTo(eval(filter_layer))
			
			var markerPopupHtml;
            if (entry['gsx$popup']['$t'] != "")
			{
				var markerPopupHtml = entry['gsx$popup']['$t'];
				marker.bindPopup(markerPopupHtml);
            }
		})
	})
	k++;
	
	// sheet 3
	$.get({url: eval("googleSheetJsonUrl_"+ k)}).then(function(data)
	{
        data.feed.entry.forEach(function(entry)
		{
			var resource_name = entry['gsx$resource']['$t'];
			var marker_icon;
			var filter_layer;
			
			switch(resource_name.toLowerCase())
			{
				case "clover":		
				marker_icon = "icon_1"; 
				filter_layer = "filter_1";
				break;
				case "iris":
				marker_icon = "icon_2";
				filter_layer = "filter_2";
				break;
				case "mushroom":
				marker_icon = "icon_3";
				filter_layer = "filter_3";
				break;
				case "thistle":
				marker_icon = "icon_4";
				filter_layer = "filter_4";
				break;
				case "Placeholder_1":
				marker_icon = "icon_0";
				filter_layer = "filter_5";
				break;
			}	
				
			var marker = L.marker([entry['gsx$y-axis']['$t'], entry['gsx$x-axis']['$t']], {icon: eval(marker_icon)});
			marker.addTo(eval(filter_layer))
			
			var markerPopupHtml;
            if (entry['gsx$popup']['$t'] != "")
			{
				var markerPopupHtml = entry['gsx$popup']['$t'];
				marker.bindPopup(markerPopupHtml);
            }
		})
	})
	k++;
	
});	



 