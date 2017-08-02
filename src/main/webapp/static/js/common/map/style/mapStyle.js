/*
 * 地图图层展现样式实现类
 * Copyright 2013-2015 Neunn, Inc.
 */
//图层渲染器
var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
renderer = (renderer) ? [ renderer ] : OpenLayers.Layer.Vector.prototype.renderers;

/*
 * 空间查询结果图层样式
 */
var resultSymbolizers = {
	"default" : {
		fillOpacity : 1,
		fillColor : "#FF0000",
		strokeColor : "#FF0000",
		strokeWidth : "3",
		strokeLinecap : "round",
		strokeDashstyle : "solid",
		strokeOpacity : 1,
		strokeColor : "#FF0000",
		pointRadius : 16,
		cursor : "inherit"
	},
	"Point" : {
		pointRadius : 24,
		externalGraphic : '${images}',
		fillColor : "white",
		fillOpacity : 1,
		strokeWidth : 30,
		strokeOpacity : 1,
		graphicWidth : 30,
		graphicHeight : 30,
		strokeColor : "#333333"
	},
	"Line" : {
		strokeWidth : 2,
		strokeOpacity : 1,
		strokeColor : "${linecolor}",
		fillOpacity : 1,
		fillColor : "#FF0000",
		strokeDashstyle : "solid"
	},
	"Polygon" : {
		strokeWidth : 2,
		strokeOpacity : 1,
		strokeColor : "#666666",
		fillColor : "${polygoncolor}",
		fillOpacity : 0.5,
		strokeDashstyle : "${linestyle}"
	}
};

var resultStyle = new OpenLayers.Style();
resultStyle.addRules([ new OpenLayers.Rule({
	symbolizer : resultSymbolizers
}) ]);

var resultLayerStyleMap = new OpenLayers.StyleMap({
	"default" : resultStyle
});


//mouseover事件图层式样
var selectFeatureStyle ={
	    'default': {
	        fillColor: "#ee9900",
	        fillOpacity: 0, 
	        hoverFillColor: "white",
	        hoverFillOpacity: 0.8,
	        strokeColor: "#ee9900",
	        strokeOpacity: 0,
	        strokeWidth: 1,
	        strokeLinecap: "round",
	        strokeDashstyle: "solid",
	        hoverStrokeColor: "red",
	        hoverStrokeOpacity: 1,
	        hoverStrokeWidth: 0.2,
	        pointRadius: 10,
	        hoverPointRadius: 1,
	        hoverPointUnit: "%",
	        pointerEvents: "visiblePainted",
	        cursor: "inherit",
	        fontColor: "#000000",
	        labelAlign: "cm",
	        labelOutlineColor: "white",
	        labelOutlineWidth: 3
	    },
	    'select': {
	        fillColor: "blue",
	        fillOpacity: 0, 
	        hoverFillColor: "white",
	        hoverFillOpacity: 0.8,
	        strokeColor: "blue",
	        strokeOpacity: 0,
	        strokeWidth: 2,
	        strokeLinecap: "round",
	        strokeDashstyle: "solid",
	        hoverStrokeColor: "red",
	        hoverStrokeOpacity: 1,
	        hoverStrokeWidth: 0.2,
	        pointRadius: 10,
	        hoverPointRadius: 1,
	        hoverPointUnit: "%",
	        pointerEvents: "visiblePainted",
	        cursor: "pointer",
	        fontColor: "#000000",
	        labelAlign: "cm",
	        labelOutlineColor: "white",
	        labelOutlineWidth: 3

	    },
	    'temporary': {
	        fillColor: "#66cccc",
	        fillOpacity: 0.2, 
	        hoverFillColor: "white",
	        hoverFillOpacity: 0.8,
	        strokeColor: "#66cccc",
	        strokeOpacity: 1,
	        strokeLinecap: "round",
	        strokeWidth: 2,
	        strokeDashstyle: "solid",
	        hoverStrokeColor: "red",
	        hoverStrokeOpacity: 1,
	        hoverStrokeWidth: 0.2,
	        pointRadius: 10,
	        hoverPointRadius: 1,
	        hoverPointUnit: "%",
	        pointerEvents: "visiblePainted",
	        cursor: "inherit",
	        fontColor: "#000000",
	        labelAlign: "cm",
	        labelOutlineColor: "white",
	        labelOutlineWidth: 3

	    },
	    'delete': {
	        display: "none"
	    }
	};


/*
 * 高亮显示图层样式
 */
var highLightSymbolizers = {
	"geom" : {
		fillOpacity : 1,
		fillColor : "#FF0000",
		strokeColor : "#FF0000",
		strokeWidth : "3",
		strokeLinecap : "round",
		strokeDashstyle : "solid",
		strokeOpacity : 1,
		strokeColor : "#FF0000",
		pointRadius : 16,
		cursor : "inherit"
	},
	"Point" : {
		pointRadius : 30,
		externalGraphic : "../../img/drawingIcon/highLight.png",
		fillColor : "white",
		fillOpacity : 1,
		strokeWidth : 1,
		strokeOpacity : 1,
		graphicWidth : 30,
		graphicHeight : 30,
		strokeColor : "#333333"
	},
	"LinearRing" : {
		strokeWidth : 3,
		strokeOpacity : 1,
		strokeColor : "#FF0000",
		fillColor : "#FF0000",
		strokeDashstyle : "solid"
	},
	"Line" : {
		strokeWidth : 3,
		strokeOpacity : 1,
		strokeColor : "#FF0000",
		strokeDashstyle : "solid"
	},
	"Polygon" : {
		strokeWidth : 4,
		strokeOpacity : 1,
		strokeColor : "#FF0000",
		fillColor : "#FF0000",
		fillOpacity : 1,
		strokeDashstyle : "solid"
	}
};
var highLightStyle = new OpenLayers.Style();
highLightStyle.addRules([ new OpenLayers.Rule({
	symbolizer : highLightSymbolizers
}) ]);
var highLightStyleMap = new OpenLayers.StyleMap({
	"default" : highLightStyle
});
