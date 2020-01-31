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
                var mapcode = this.x_y_map_code(pos);
                this._label.innerHTML = this._createMapcodeLabel(mapcode);
            }
        },
		
		// x y coordinates
		x_y_map_code: function(point)
		{
            x = point.lng;
			y = point.lat;
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
	var N_of_filters = 1+54;	// +1 when adding a filter box	 // an extra 1 because filter 0 corresponds to icon 0 which is a placeholders
	var N_of_resources = 54;	// +1 when adding a resource
	
	// map layer
    var the_map = L.imageOverlay('Images/AAmap.png', [[0,0], [259,256.5]]); //[y,x], [y,x] 
	
	// map settings
    var map = L.map("map", 
	{
		doubleClickZoom: false,
        crs: L.CRS.Simple,
        layers: [officialMapLayer, the_map],
        maxZoom: 6,
        minZoom: 1
    }).setView([128, 128], 2);
	
	// on mouse click coordinates to clipboard	
	function onMapClick()
	{
		var x_y_string = $('<input>').val(x + ' , ' + y).appendTo('body').select()
		document.execCommand('copy')
		$(x_y_string).remove(); // removes the string from the screen
	}
		map.on('click', onMapClick);
	
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
		
		"Iris" : filter_2,
		"Clovers" : filter_1,		// test for alphabetization
		"Mushroom" : filter_3,
		"Thistle" : filter_4,
		"zPlaceholder_01" : filter_5,
		"zPlaceholder_02" : filter_6,
		"zPlaceholder_03" : filter_7,
		"zPlaceholder_04" : filter_8,
		"zPlaceholder_05" : filter_9,
		"zPlaceholder_06" : filter_10,
		"zPlaceholder_07" : filter_11,
		"zPlaceholder_08" : filter_12,
		"zPlaceholder_09" : filter_13,
		"zPlaceholder_10" : filter_14,
		"zPlaceholder_11" : filter_15,
		"zPlaceholder_12" : filter_16,
		"zPlaceholder_13" : filter_17,
		"zPlaceholder_14" : filter_18,
		"zPlaceholder_15" : filter_19,
		"zPlaceholder_16" : filter_20,
		"zPlaceholder_17" : filter_21,
		"zPlaceholder_18" : filter_22,
		"zPlaceholder_19" : filter_23,
		"zPlaceholder_20" : filter_24,
		"zPlaceholder_21" : filter_25,
		"zPlaceholder_22" : filter_26,
		"zPlaceholder_23" : filter_27,
		"zPlaceholder_24" : filter_28,
		"zPlaceholder_25" : filter_29,
		"zPlaceholder_26" : filter_30,
		"zPlaceholder_27" : filter_31,
		"zPlaceholder_28" : filter_32,
		"zPlaceholder_29" : filter_33,
		"zPlaceholder_30" : filter_34,
		"zPlaceholder_31" : filter_35,
		"zPlaceholder_32" : filter_36,
		"zPlaceholder_33" : filter_37,
		"zPlaceholder_34" : filter_38,
		"zPlaceholder_35" : filter_39,
		"zPlaceholder_36" : filter_40,
		"zPlaceholder_37" : filter_41,
		"zPlaceholder_38" : filter_42,
		"zPlaceholder_39" : filter_43,
		"zPlaceholder_40" : filter_44,
		"zPlaceholder_41" : filter_45,
		"zPlaceholder_42" : filter_46,
		"zPlaceholder_43" : filter_47,
		"zPlaceholder_44" : filter_48,
		"zPlaceholder_45" : filter_49,
		"zPlaceholder_46" : filter_50
	}// "NAME_OF_FILTER_HERE" : filter_			
	// copy / paste / change the name that will display / add the next number to filter_ / add a comma to the previous one
	
	// Adds base layer and overlays to the map
    L.control.layers(baseLayers, overlays, {hideSingleBase: true, sortLayers: true}).addTo(map);
    L.control.liveCoordinates({ position: 'bottomleft' }).addTo(map);

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
		eval('var icon_' + i + " = new Icon_Class({iconUrl: 'Images/'+ i +'.png'});");
	}      // var icon_[i] = new Icon_Class({iconUrl: 'mages/[i].png'}); // where [i] increments

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
															 // Switch for icon selection and layer placement for filtering
			switch(resource_name.toLowerCase())	 			 // makes the input string lower case for case insensitivity
			{
				case "clover":		 		// reads the resource name from the sheet, must be lower case 	
				marker_icon = "icon_1";     // assigns icon 1 to the marker
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
				case "placeholder_01":
				marker_icon = "icon_0";
				filter_layer = "filter_5";
				break;
				case "placeholder_02":
				marker_icon = "icon_0";
				filter_layer = "filter_6";
				break;
				case "placeholder_03":
				marker_icon = "icon_0";
				filter_layer = "filter_7";
				break;
				case "placeholder_04":
				marker_icon = "icon_0";
				filter_layer = "filter_8";
				break;
				case "placeholder_05":
				marker_icon = "icon_0";
				filter_layer = "filter_9";
				break;
				case "placeholder_06":
				marker_icon = "icon_0";
				filter_layer = "filter_10";
				break;
				case "placeholder_07":
				marker_icon = "icon_0";
				filter_layer = "filter_11";
				break;
				case "placeholder_08":
				marker_icon = "icon_0";
				filter_layer = "filter_12";
				break;
				case "placeholder_09":
				marker_icon = "icon_0";
				filter_layer = "filter_13";
				break;
				case "placeholder_10":
				marker_icon = "icon_0";
				filter_layer = "filter_14";
				break;
				case "placeholder_11":
				marker_icon = "icon_0";
				filter_layer = "filter_15";
				break;
				case "placeholder_12":
				marker_icon = "icon_0";
				filter_layer = "filter_16";
				break;
				case "placeholder_13":
				marker_icon = "icon_0";
				filter_layer = "filter_17";
				break;
				case "placeholder_14":
				marker_icon = "icon_0";
				filter_layer = "filter_18";
				break;
				case "placeholder_15":
				marker_icon = "icon_0";
				filter_layer = "filter_19";
				break;
				case "placeholder_16":
				marker_icon = "icon_0";
				filter_layer = "filter_20";
				break;
				case "placeholder_17":
				marker_icon = "icon_0";
				filter_layer = "filter_21";
				break;
				case "placeholder_18":
				marker_icon = "icon_0";
				filter_layer = "filter_22";
				break;
				case "placeholder_19":
				marker_icon = "icon_0";
				filter_layer = "filter_23";
				break;
				case "placeholder_20":
				marker_icon = "icon_0";
				filter_layer = "filter_24";
				break;
				case "placeholder_21":
				marker_icon = "icon_0";
				filter_layer = "filter_25";
				break;
				case "placeholder_22":
				marker_icon = "icon_0";
				filter_layer = "filter_26";
				break;
				case "placeholder_23":
				marker_icon = "icon_0";
				filter_layer = "filter_27";
				break;
				case "placeholder_24":
				marker_icon = "icon_0";
				filter_layer = "filter_28";
				break;
				case "placeholder_25":
				marker_icon = "icon_0";
				filter_layer = "filter_29";
				break;
				case "placeholder_26":
				marker_icon = "icon_0";
				filter_layer = "filter_30";
				break;
				case "placeholder_27":
				marker_icon = "icon_0";
				filter_layer = "filter_31";
				break;
				case "placeholder_28":
				marker_icon = "icon_0";
				filter_layer = "filter_33";
				break;
				case "placeholder_29":
				marker_icon = "icon_0";
				filter_layer = "filter_34";
				break;
				case "placeholder_30":
				marker_icon = "icon_0";
				filter_layer = "filter_35";
				break;
				case "placeholder_31":
				marker_icon = "icon_0";
				filter_layer = "filter_36";
				break;
				case "placeholder_32":
				marker_icon = "icon_0";
				filter_layer = "filter_37";
				break;
				case "placeholder_34":
				marker_icon = "icon_0";
				filter_layer = "filter_38";
				break;
				case "placeholder_35":
				marker_icon = "icon_0";
				filter_layer = "filter_39";
				break;
				case "placeholder_36":
				marker_icon = "icon_0";
				filter_layer = "filter_40";
				break;
				case "placeholder_37":
				marker_icon = "icon_0";
				filter_layer = "filter_41";
				break;
				case "placeholder_38":
				marker_icon = "icon_0";
				filter_layer = "filter_42";
				break;
				case "placeholder_39":
				marker_icon = "icon_0";
				filter_layer = "filter_43";
				break;
				case "placeholder_40":
				marker_icon = "icon_0";
				filter_layer = "filter_44";
				break;
				case "placeholder_41":
				marker_icon = "icon_0";
				filter_layer = "filter_45";
				break;
				case "placeholder_42":
				marker_icon = "icon_0";
				filter_layer = "filter_46";
				break;
				case "placeholder_43":
				marker_icon = "icon_0";
				filter_layer = "filter_47";
				break;
				case "placeholder_44":
				marker_icon = "icon_0";
				filter_layer = "filter_48";
				break;
				case "placeholder_45":
				marker_icon = "icon_0";
				filter_layer = "filter_49";
				break;
				case "placeholder_46":
				marker_icon = "icon_0";
				filter_layer = "filter_50";
				break;
				case "placeholder_47":
				marker_icon = "icon_0";
				filter_layer = "filter_51";
				break;
				case "placeholder_48":
				marker_icon = "icon_0";
				filter_layer = "filter_52";
				break;
				case "placeholder_49":
				marker_icon = "icon_0";
				filter_layer = "filter_53";
				break;
				case "placeholder_50":
				marker_icon = "icon_0";
				filter_layer = "filter_54";
				break;
			
			}	
			// adds the markers to the coordinates taken from the sheet and assigns an icon
			var marker = L.marker([entry['gsx$y-axis']['$t'], entry['gsx$x-axis']['$t']], {icon: eval(marker_icon)});
			marker.addTo(eval(filter_layer));
		
			
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
				case "clover":		 		// reads the resource name from the sheet, must be lower case 	
				marker_icon = "icon_1";     // assigns icon 1 to the marker
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
				case "placeholder_01":
				marker_icon = "icon_0";
				filter_layer = "filter_5";
				break;
				case "placeholder_02":
				marker_icon = "icon_0";
				filter_layer = "filter_6";
				break;
				case "placeholder_03":
				marker_icon = "icon_0";
				filter_layer = "filter_7";
				break;
				case "placeholder_04":
				marker_icon = "icon_0";
				filter_layer = "filter_8";
				break;
				case "placeholder_05":
				marker_icon = "icon_0";
				filter_layer = "filter_9";
				break;
				case "placeholder_06":
				marker_icon = "icon_0";
				filter_layer = "filter_10";
				break;
				case "placeholder_07":
				marker_icon = "icon_0";
				filter_layer = "filter_11";
				break;
				case "placeholder_08":
				marker_icon = "icon_0";
				filter_layer = "filter_12";
				break;
				case "placeholder_09":
				marker_icon = "icon_0";
				filter_layer = "filter_13";
				break;
				case "placeholder_10":
				marker_icon = "icon_0";
				filter_layer = "filter_14";
				break;
				case "placeholder_11":
				marker_icon = "icon_0";
				filter_layer = "filter_15";
				break;
				case "placeholder_12":
				marker_icon = "icon_0";
				filter_layer = "filter_16";
				break;
				case "placeholder_13":
				marker_icon = "icon_0";
				filter_layer = "filter_17";
				break;
				case "placeholder_14":
				marker_icon = "icon_0";
				filter_layer = "filter_18";
				break;
				case "placeholder_15":
				marker_icon = "icon_0";
				filter_layer = "filter_19";
				break;
				case "placeholder_16":
				marker_icon = "icon_0";
				filter_layer = "filter_20";
				break;
				case "placeholder_17":
				marker_icon = "icon_0";
				filter_layer = "filter_21";
				break;
				case "placeholder_18":
				marker_icon = "icon_0";
				filter_layer = "filter_22";
				break;
				case "placeholder_19":
				marker_icon = "icon_0";
				filter_layer = "filter_23";
				break;
				case "placeholder_20":
				marker_icon = "icon_0";
				filter_layer = "filter_24";
				break;
				case "placeholder_21":
				marker_icon = "icon_0";
				filter_layer = "filter_25";
				break;
				case "placeholder_22":
				marker_icon = "icon_0";
				filter_layer = "filter_26";
				break;
				case "placeholder_23":
				marker_icon = "icon_0";
				filter_layer = "filter_27";
				break;
				case "placeholder_24":
				marker_icon = "icon_0";
				filter_layer = "filter_28";
				break;
				case "placeholder_25":
				marker_icon = "icon_0";
				filter_layer = "filter_29";
				break;
				case "placeholder_26":
				marker_icon = "icon_0";
				filter_layer = "filter_30";
				break;
				case "placeholder_27":
				marker_icon = "icon_0";
				filter_layer = "filter_31";
				break;
				case "placeholder_28":
				marker_icon = "icon_0";
				filter_layer = "filter_33";
				break;
				case "placeholder_29":
				marker_icon = "icon_0";
				filter_layer = "filter_34";
				break;
				case "placeholder_30":
				marker_icon = "icon_0";
				filter_layer = "filter_35";
				break;
				case "placeholder_31":
				marker_icon = "icon_0";
				filter_layer = "filter_36";
				break;
				case "placeholder_32":
				marker_icon = "icon_0";
				filter_layer = "filter_37";
				break;
				case "placeholder_34":
				marker_icon = "icon_0";
				filter_layer = "filter_38";
				break;
				case "placeholder_35":
				marker_icon = "icon_0";
				filter_layer = "filter_39";
				break;
				case "placeholder_36":
				marker_icon = "icon_0";
				filter_layer = "filter_40";
				break;
				case "placeholder_37":
				marker_icon = "icon_0";
				filter_layer = "filter_41";
				break;
				case "placeholder_38":
				marker_icon = "icon_0";
				filter_layer = "filter_42";
				break;
				case "placeholder_39":
				marker_icon = "icon_0";
				filter_layer = "filter_43";
				break;
				case "placeholder_40":
				marker_icon = "icon_0";
				filter_layer = "filter_44";
				break;
				case "placeholder_41":
				marker_icon = "icon_0";
				filter_layer = "filter_45";
				break;
				case "placeholder_42":
				marker_icon = "icon_0";
				filter_layer = "filter_46";
				break;
				case "placeholder_43":
				marker_icon = "icon_0";
				filter_layer = "filter_47";
				break;
				case "placeholder_44":
				marker_icon = "icon_0";
				filter_layer = "filter_48";
				break;
				case "placeholder_45":
				marker_icon = "icon_0";
				filter_layer = "filter_49";
				break;
				case "placeholder_46":
				marker_icon = "icon_0";
				filter_layer = "filter_50";
				break;
				case "placeholder_47":
				marker_icon = "icon_0";
				filter_layer = "filter_51";
				break;
				case "placeholder_48":
				marker_icon = "icon_0";
				filter_layer = "filter_52";
				break;
				case "placeholder_49":
				marker_icon = "icon_0";
				filter_layer = "filter_53";
				break;
				case "placeholder_50":
				marker_icon = "icon_0";
				filter_layer = "filter_54";
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
				case "clover":		 		// reads the resource name from the sheet, must be lower case 	
				marker_icon = "icon_1";     // assigns icon 1 to the marker
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
				case "placeholder_01":
				marker_icon = "icon_0";
				filter_layer = "filter_5";
				break;
				case "placeholder_02":
				marker_icon = "icon_0";
				filter_layer = "filter_6";
				break;
				case "placeholder_03":
				marker_icon = "icon_0";
				filter_layer = "filter_7";
				break;
				case "placeholder_04":
				marker_icon = "icon_0";
				filter_layer = "filter_8";
				break;
				case "placeholder_05":
				marker_icon = "icon_0";
				filter_layer = "filter_9";
				break;
				case "placeholder_06":
				marker_icon = "icon_0";
				filter_layer = "filter_10";
				break;
				case "placeholder_07":
				marker_icon = "icon_0";
				filter_layer = "filter_11";
				break;
				case "placeholder_08":
				marker_icon = "icon_0";
				filter_layer = "filter_12";
				break;
				case "placeholder_09":
				marker_icon = "icon_0";
				filter_layer = "filter_13";
				break;
				case "placeholder_10":
				marker_icon = "icon_0";
				filter_layer = "filter_14";
				break;
				case "placeholder_11":
				marker_icon = "icon_0";
				filter_layer = "filter_15";
				break;
				case "placeholder_12":
				marker_icon = "icon_0";
				filter_layer = "filter_16";
				break;
				case "placeholder_13":
				marker_icon = "icon_0";
				filter_layer = "filter_17";
				break;
				case "placeholder_14":
				marker_icon = "icon_0";
				filter_layer = "filter_18";
				break;
				case "placeholder_15":
				marker_icon = "icon_0";
				filter_layer = "filter_19";
				break;
				case "placeholder_16":
				marker_icon = "icon_0";
				filter_layer = "filter_20";
				break;
				case "placeholder_17":
				marker_icon = "icon_0";
				filter_layer = "filter_21";
				break;
				case "placeholder_18":
				marker_icon = "icon_0";
				filter_layer = "filter_22";
				break;
				case "placeholder_19":
				marker_icon = "icon_0";
				filter_layer = "filter_23";
				break;
				case "placeholder_20":
				marker_icon = "icon_0";
				filter_layer = "filter_24";
				break;
				case "placeholder_21":
				marker_icon = "icon_0";
				filter_layer = "filter_25";
				break;
				case "placeholder_22":
				marker_icon = "icon_0";
				filter_layer = "filter_26";
				break;
				case "placeholder_23":
				marker_icon = "icon_0";
				filter_layer = "filter_27";
				break;
				case "placeholder_24":
				marker_icon = "icon_0";
				filter_layer = "filter_28";
				break;
				case "placeholder_25":
				marker_icon = "icon_0";
				filter_layer = "filter_29";
				break;
				case "placeholder_26":
				marker_icon = "icon_0";
				filter_layer = "filter_30";
				break;
				case "placeholder_27":
				marker_icon = "icon_0";
				filter_layer = "filter_31";
				break;
				case "placeholder_28":
				marker_icon = "icon_0";
				filter_layer = "filter_33";
				break;
				case "placeholder_29":
				marker_icon = "icon_0";
				filter_layer = "filter_34";
				break;
				case "placeholder_30":
				marker_icon = "icon_0";
				filter_layer = "filter_35";
				break;
				case "placeholder_31":
				marker_icon = "icon_0";
				filter_layer = "filter_36";
				break;
				case "placeholder_32":
				marker_icon = "icon_0";
				filter_layer = "filter_37";
				break;
				case "placeholder_34":
				marker_icon = "icon_0";
				filter_layer = "filter_38";
				break;
				case "placeholder_35":
				marker_icon = "icon_0";
				filter_layer = "filter_39";
				break;
				case "placeholder_36":
				marker_icon = "icon_0";
				filter_layer = "filter_40";
				break;
				case "placeholder_37":
				marker_icon = "icon_0";
				filter_layer = "filter_41";
				break;
				case "placeholder_38":
				marker_icon = "icon_0";
				filter_layer = "filter_42";
				break;
				case "placeholder_39":
				marker_icon = "icon_0";
				filter_layer = "filter_43";
				break;
				case "placeholder_40":
				marker_icon = "icon_0";
				filter_layer = "filter_44";
				break;
				case "placeholder_41":
				marker_icon = "icon_0";
				filter_layer = "filter_45";
				break;
				case "placeholder_42":
				marker_icon = "icon_0";
				filter_layer = "filter_46";
				break;
				case "placeholder_43":
				marker_icon = "icon_0";
				filter_layer = "filter_47";
				break;
				case "placeholder_44":
				marker_icon = "icon_0";
				filter_layer = "filter_48";
				break;
				case "placeholder_45":
				marker_icon = "icon_0";
				filter_layer = "filter_49";
				break;
				case "placeholder_46":
				marker_icon = "icon_0";
				filter_layer = "filter_50";
				break;
				case "placeholder_47":
				marker_icon = "icon_0";
				filter_layer = "filter_51";
				break;
				case "placeholder_48":
				marker_icon = "icon_0";
				filter_layer = "filter_52";
				break;
				case "placeholder_49":
				marker_icon = "icon_0";
				filter_layer = "filter_53";
				break;
				case "placeholder_50":
				marker_icon = "icon_0";
				filter_layer = "filter_54";
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



 