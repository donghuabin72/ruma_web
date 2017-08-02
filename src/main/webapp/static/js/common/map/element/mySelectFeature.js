var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
renderer = (renderer) ? [ renderer ]
		: OpenLayers.Layer.Vector.prototype.renderers;

var selectVector = new OpenLayers.Layer.Vector("selectVector", {
	renderers : renderer,
	styleMap : new OpenLayers.StyleMap(selectFeatureStyle),
	eventListeners : {
		"sketchcomplete" : sketchcomplete
	}
});

selectVector.setZIndex(851);

selectVector.events.on({
	'clickfeatureselected':function (feature){
		showInfoWmsDefine(feature.feature);
	},
	'featureselected' : function(feature) {
		console.log("mouserover");
		var attributes = feature.feature.attributes;
		var geom = attributes.geom;
		var lonlat = getGeomPopupCenter(geom);
		var resolution = map.getResolution();
		var newLonlat = new OpenLayers.LonLat(lonlat.lon+resolution*5,lonlat.lat+resolution*20);
		var text = new OpenLayers.Popup("mouserover", newLonlat, null, "<div style='background-color:#ffffff;color:#000;padding:2px;font-size:12px;top:10px;'>点击可查看详情</div>", false,null);
		text.autoSize = !0;
		text.setBorder("1px solid #565656");
		map.addPopup(text);
	},
	'featureunselected' : function(feature) {
		var popupsLength=map.popups.length;
		for(var p=popupsLength;p>=0;p--){
			var pop = map.popups[p];
			if(pop != null && pop.id=="mouserover"){
				map.removePopup(pop);
			}
		}
	}
});

var selectControls = {
	select : new OpenLayers.Control.NewSelectFeature(selectVector, {
		clickout : true,
		toggle : false,
		multiple : false,
		hover : true,
		highlightOnly:false,
		toggleKey : "ctrlKey", // ctrl key removes from selection
		multipleKey : "shiftKey", // shift key adds to selection
		selectStyle : null,
		box : false
	})
};

/**
 * 依据图层名称删除selectVector图层中的Feature
 * @param layerName
 */
function deleteFeaturesByLayerName(layerName){
	var features = selectVector.features;
	var delFeatures = [];
	 for (var i = features.length - 1; i >= 0; i--) {
		 var feature = features[i];
		 if(feature){
			 var attributes = feature.attributes;
			 if(attributes!=undefined){
				 if(feature.attributes.viewname==layerName){
					 //console.log(feature.attributes);
					 delFeatures.push(feature);
				 } 
			 }
		 }else{
			 debugger;
		 }
	 }
	 
	 selectVector.removeFeatures(delFeatures);
}

/**
 * 修正图层Index值,使图层保持在最上层
 */
function changeSelectVectorIndex(){
	selectVector.setZIndex(851);
}


function sketchcomplete(event) {
	
	console.log("sketchcomplete");
	var feature = event.feature;
	var geo = feature.geometry.clone();
	var wkt_c = new OpenLayers.Format.WKT();
	var geoStr = wkt_c.extractGeometry(geo);
	vectors.removeFeatures([ feature ]);
	var property = feature.attributes;
	property.gid="gidtest";
	var newFeature = new OpenLayers.Feature.Vector(geo, property);
	vectors.addFeatures([ newFeature ]);


	var headHtml = "<form  id=\"addFeatureForm\" name=\"addFeatureForm\"><table  border=\"0\" cellspacing=\"0\" cellpadding=\"0\" class=\"ued_tb\">";
	var endHtml = "<tr><td colspan=\"2\"><a class=\"addinfo\" onclick=\"javascript:addLayerFeature(\'123\');\">提交</a></td></tr></table></form>";

	var html = "<tr><input type=\"hidden\" id=\"geometry\" name=\"geometry\" value=\""
			+ geoStr + "\" /></tr>" + "<tr><input  type=\"text\" id=\"id\" name=\"id\" value=\"\" /></tr>" ;
	html = "<tr><input type=\"hidden\" id=\"userId\" name=\"userId\" value=\"123\" /></tr>" + html;
	var popup = new OpenLayers.Popup.FramedCloud("chicken", geo.getBounds()
			.getCenterLonLat(), null, headHtml + html + endHtml, null, true,
			closeAddBox)
	feature.popup = popup;
	popup.feature = feature;
	map.addPopup(popup, true);
}

// 新增点数据弹出框的关闭事件
function closeAddBox(evt) {
	var feature = this.feature;
	//var layerid = document.getElementById("layeridtemp").value
	//var vector = layerMap.get(layerid);
	vectors.removeFeatures([ feature ]);
	//tempVector.removeFeatures([ feature ]);
	map.removePopup(this);
	
	var selectControl = drawControls["point"];
	selectControl.deactivate();
}