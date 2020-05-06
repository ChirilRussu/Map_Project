$(function()
{
	/*
	Selects map type, possible values in the html should be:
	1Forest
	1ForestAndRoads
	3Canyons
	4Canyons
	*/
	var mapType = $('#mapSelector').val();
	console.log("Map selected from html: "+ mapType);
	
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
	
	var fourCanyonsMapLayer = L.tileLayer("images/Tiles/4 Canyons/{z}/{x}/{y}.png", 
	{
    maxZoom: 5,
    minZoom: 1,
    bounds: L.latLngBounds([0,0],[-256,256]),
    noWrap: true,
    });0
	
	var threeCanyonsMapLayer = L.tileLayer("images/Tiles/3 Canyons/{z}/{x}/{y}.png", 
	{
    maxZoom: 5,
    minZoom: 1,
    bounds: L.latLngBounds([0,0],[-256,256]),
    noWrap: true,
    });0
	
	var oneForestMapLayer = L.tileLayer("images/Tiles/1 Forest/{z}/{x}/{y}.png", 
	{
    maxZoom: 5,
    minZoom: 1,
    bounds: L.latLngBounds([0,0],[-256,256]),
    noWrap: true,
    });0
	
	var oneForestAndRoadsMapLayer = L.tileLayer("images/Tiles/1 Forest And Roads/{z}/{x}/{y}.png", 
	{
    maxZoom: 5,
    minZoom: 1,
    bounds: L.latLngBounds([0,0],[-256,256]),
    noWrap: true,
    });0
	
	// Values to change when adding things 
	var N_of_sheets = 1+3;		// +1 when adding a sheet  		 // an extra 1 becuase google sheets start counting at 1
	var N_of_filters = 1+38;	// +1 when adding a filter box	 // an extra 1 because filter 0 corresponds to icon 0 which is a placeholders
	var N_of_resources = 1+38;	// +1 when adding a resource     // an extra 1 as above
	
	// map settings
    var map = L.map("map", 
	{
		doubleClickZoom: false,
        crs: L.CRS.Simple,
		layers: [fourCanyonsMapLayer,threeCanyonsMapLayer,oneForestMapLayer], // map adds all layers by defaul, one by one in this list
        maxZoom: 5,
        minZoom: 1
    }).setView([-128, 128], 2);
	
	// prevents the bug where switching between layers won't fire baselayerchange because it fires when a layer is added
	// removes all layers, 1 will be added back below in the switch
	map.removeLayer(fourCanyonsMapLayer);
	map.removeLayer(threeCanyonsMapLayer);
	map.removeLayer(oneForestAndRoadsMapLayer);
	map.removeLayer(oneForestMapLayer);
	
	// on mouse double click bot command + coordinates to clipboard	
	function onMapClick()
	{
		var x_y_string = $('<input>').val(bot_command + x + ' , ' + y + ', ').appendTo('body').select()
		document.execCommand('copy')
		$(x_y_string).remove(); // removes the string from the screen
	}
		map.on('click', onMapClick);
	
	var h;
	for(h = 0; h < N_of_filters; h++)
	{
		eval("var filter_" + h + " = new L.LayerGroup();");
	}	   // var filter_[h] = new L.LayerGroup(); // where [h] increments
		
	// turns the filters on by default
	/*
	map.addLayer(filter_1)	     
	map.addLayer(filter_2)	 
	map.addLayer(filter_3)	
	*/

	// defining overlays - used as resource filters - needs a new entry every resource
	var overlays = 
	{	
		".errors" : filter_0,
		"Bone Splinter" : filter_2,
		"Rupu Camp" : filter_1,		// test for alphabetization
		"Rupu Gel" : filter_3,
		"Rupu Vine" : filter_4,
		"Mushroom": filter_5,
		"Wood" : filter_6,
		"Fiber" : filter_7,
		"Palm Leaves" : filter_8,
		"Rupu Pelt" : filter_9,
		"Cotton" : filter_10,
		"Cactus Fruit" : filter_11,
		"Cattail" : filter_12,
		"Aloe" : filter_13,
		"Beeswax" : filter_14,
		"Blood Turnip" : filter_15,
		"Pearl" : filter_16,
		"Anime Bath Water" : filter_17,
		"Hide" : filter_18,
		"Chitin Plate" : filter_19,
		"Stone" : filter_20,
		"Redwood" : filter_21,
		"Torque" : filter_22,
		"Sulfer" : filter_23,
		"Obsidian" : filter_24,
		"Charcoal" : filter_25,
		"Worm Silk" : filter_26,
		"Worm Slime" : filter_27,
		"Thornberry" : filter_28,
		"Insect" : filter_29,
		"Iron Ore" : filter_30,
		"Corn" : filter_31,
		"Clay" : filter_32,
		"Temple" : filter_33,
		"Lava Poppy" : filter_34,
		// 35 missing, add next one here
		"Black Soil" : filter_36,
		"Nibiran" : filter_37,
		"Magma Seeds" : filter_38
		
	}
	// "NAME_OF_FILTER_HERE" : filter_			
	// copy / paste / change the name that will display / add the next number to filter_ / add a comma to the previous one
	
	// Adds base layer and overlays to the map
	switch(mapType)
	{
		default:
		L.control.layers({"4 Canyons": fourCanyonsMapLayer, "1 Forest": oneForestMapLayer, "3 Canyons": threeCanyonsMapLayer, "1 Forest And Roads": oneForestAndRoadsMapLayer}, overlays, {hideSingleBase: true, sortLayers: true}).addTo(map);
		map.addLayer(oneForestMapLayer);
		console.log("Failed to read map type from html, adding all map types");
		break;
		case "1Forest":
		L.control.layers({"1 Forest": oneForestMapLayer}, overlays, {hideSingleBase: true, sortLayers: true}).addTo(map);
		map.addLayer(oneForestMapLayer);
		console.log("Succesfully loaded 1 Forest");
		break;
		case "1ForestAndRoads":
		L.control.layers({"1 Forest And Roads": oneForestAndRoadsMapLayer}, overlays, {hideSingleBase: true, sortLayers: true}).addTo(map);
		map.addLayer(oneForestAndRoadsMapLayer);
		console.log("Succesfully loaded 1 Forest And Roads");
		break;
		case "3Canyons":
		L.control.layers({"3 Canyons": threeCanyonsMapLayer}, overlays, {hideSingleBase: true, sortLayers: true}).addTo(map);
		map.addLayer(threeCanyonsMapLayer);
		console.log("Succesfully loaded 3 Canyons");
		break;
		case "4Canyons":
		L.control.layers({"4 Canyons": fourCanyonsMapLayer}, overlays, {hideSingleBase: true, sortLayers: true}).addTo(map);
		map.addLayer(fourCanyonsMapLayer);
		console.log("Succesfully loaded 4 Canyons");
		break;
	}
	
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
																																									  
	// Defining icon variables and linking them to icon images
	var i;
	for(i = 0; i < N_of_resources; i++)
	{
		eval('var icon_' + i + " = new Icon_Class({iconUrl: 'images/Icons/'+ i +'.png'});");
	}      // var icon_[i] = new Icon_Class({iconUrl: 'mages/[i].png'}); // where [i] increments
	
	function dataGetter()
	{
		$.ajax({
		    url : apiUrl,
		    method : 'GET',
		}).then(function(data)
		//$.get({url: eval('apiUrl'), crossOrigin: "test"}).then(function(data)
		{
			data.feed.entry.forEach(function(entry)
			{
				var resource_name = entry['gsx$resource']['$t']; // stores the resource name from the sheet
				var marker_icon;								 // used to pass the icon that a marker will be assigned to
				var filter_layer;								 // used to pass the filter to which a marker will be assigned to
																 // Switch for icon selection and layer placement for filtering
				switch(resource_name.toLowerCase())	 			 // makes the input string lower case for case insensitivity
				{
					default:
					marker_icon = "icon_0";
					filter_layer = "filter_0";
					break;
					case "rupu camp":		 	// reads the resource name from the sheet, must be lower case 	
					case "rupu camps":
					marker_icon = "icon_1";     // assigns icon 1 to the marker
					filter_layer = "filter_1";	// assigns the marker to filter 1
					break;
					case "bone splinter":
					case "bone splinters":
					marker_icon = "icon_2";
					filter_layer = "filter_2";
					break;
					case "rupu gel":
					case "rupu gels":
					marker_icon = "icon_3";
					filter_layer = "filter_3";
					break;
					case "rupu vine":
					case "rupu vines":
					marker_icon = "icon_4";
					filter_layer = "filter_4";
					break;
					case "mushroom":
					case "mushrooms":
					marker_icon = "icon_5";
					filter_layer = "filter_5";
					break;
					case "wood":
					case "woods":
					marker_icon = "icon_6";
					filter_layer = "filter_6";
					break;
					case "fiber":
					case "fibers":
					marker_icon = "icon_7";
					filter_layer = "filter_7";
					break;
					case "palm leaf":
					case "palm leaves":
					marker_icon = "icon_8";
					filter_layer = "filter_8";
					break;
					case "rupu pelt":
					case "rupu pelts":
					marker_icon = "icon_9";
					filter_layer = "filter_9";
					break;
					case "cotton":
					case "cottons":
					marker_icon = "icon_10";
					filter_layer = "filter_10";
					break;
					case "cactus fruit":
					case "cactus fruits":
					marker_icon = "icon_11";
					filter_layer = "filter_11";
					break;
					case "cattail":
					case "cattails":
					marker_icon = "icon_12";
					filter_layer = "filter_12";
					break;
					case "aloe":
					case "aloes":
					marker_icon = "icon_13";
					filter_layer = "filter_13";
					break;
					case "beeswax":
					marker_icon = "icon_14";
					filter_layer = "filter_14";
					break;
					case "blood turnip":
					case "blood turnips":
					marker_icon = "icon_15";
					filter_layer = "filter_15";
					break;
					case "pearl":
					case "pearls":
					marker_icon = "icon_16";
					filter_layer = "filter_16";
					break;
					case "anime bath water":
					case "water":
					case "contaminated water":
					marker_icon = "icon_17";
					filter_layer = "filter_17";
					break;
					case "hide":
					case "hides":
					marker_icon = "icon_18";
					filter_layer = "filter_18";
					break;
					case "chitin plate":
					case "chitin plates":
					marker_icon = "icon_19";
					filter_layer = "filter_19";
					break;
					case "stone":
					case "stones":
					marker_icon = "icon_20";
					filter_layer = "filter_20";
					break;
					case "redwood":
					case "redwoods":
					marker_icon = "icon_21";
					filter_layer = "filter_21";
					break;
					case "torque":
					marker_icon = "icon_22";
					filter_layer = "filter_22";
					break;
					case "sulfer":
					case "sulfers":
					marker_icon = "icon_23";
					filter_layer = "filter_23";
					break;
					case "obsidian":
					case "obsidians":
					marker_icon = "icon_24";
					filter_layer = "filter_24";
					break;
					case "charcoal":
					case "charcoals":
					marker_icon = "icon_25";
					filter_layer = "filter_25";
					break;
					case "worm silk":
					case "worm silks":
					marker_icon = "icon_26";
					filter_layer = "filter_26";
					break;
					case "worm slime":
					case "worm slimes":
					marker_icon = "icon_27";
					filter_layer = "filter_27";
					break;				
					case "thornberry":
					case "thornberries":
					marker_icon = "icon_28";
					filter_layer = "filter_28";
					break;
					case "insect":
					case "insects":
					marker_icon = "icon_29";
					filter_layer = "filter_29";
					break;
					case "iron ore":
					case "iron ores":
					marker_icon = "icon_30";
					filter_layer = "filter_30";
					break;
					case "corn":
					case "corns":
					marker_icon = "icon_31";
					filter_layer = "filter_31";
					break;
					case "clay":
					case "clays":
					marker_icon = "icon_32";
					filter_layer = "filter_32";
					break;	
					case "temple":
					case "temples":
					marker_icon = "icon_33";
					filter_layer = "filter_33";
					break;
					case "lava poppy":
					case "lava poppies":
					marker_icon = "icon_34";
					filter_layer = "filter_34";
					break;	
//////////////////  case 35 missing add next one here
					case "black soil":
					case "black soils":
					marker_icon = "icon_36";
					filter_layer = "filter_36";
					break;
					case "nibiran":
					case "nibirans":
					marker_icon = "icon_37";
					filter_layer = "filter_37";
					break;
					case "magma seed":
					case "magma seeds":
					marker_icon = "icon_38";
					filter_layer = "filter_38";
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
	}
	
	function layerCleanUp()
	{
		for(j = 0; j < N_of_filters; j++)
		{
			eval('filter_' + j + '.clearLayers();');
		}
	}
	
	function triggerLayer(name) {
		var localStore = {
			"4 Canyons" : {cmd: "!map-4 ", path:"4Canyons"},
			"3 Canyons" : {cmd: "!map-3 ", path:"3Canyons"},
			"1 Forest" : {cmd: "!map-1 ", path:"1Forest"},
			"1 Forest And Roads" : {cmd: "!map-2 ", path:"1ForestAndRoads"} // needs api
		};

		if(!localStore[name]){
			console.log("No local store for " + name);		
			return;
		}
		console.log(name);
		apiUrl = "https://scy517fui6.execute-api.us-east-2.amazonaws.com/live/"+localStore[name].path;
		layerCleanUp();
		dataGetter();
		bot_command = localStore[name].cmd;
	}

	// selects the default and bot command on load
	switch(mapType)
	{
		default:
		triggerLayer("1 Forest");
		console.log("Failed bot command selection, defaulted to 1 Forest");
		break;
		case "1Forest":
		triggerLayer("1 Forest");
		break;
		case "1ForestAndRoads":
		triggerLayer("1 Forest And Roads");
		break;
		case "3Canyons":
		triggerLayer("3 Canyons");
		break;
		case "4Canyons":
		triggerLayer("4 Canyons");
		break;
	}

	map.on('baselayerchange', function (e) 
	{
		triggerLayer(e.name);
	});
});	



 