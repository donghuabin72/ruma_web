//默认审图号
var DEFAULT_COPY_RIGHT = "";
//默认城市名
var DEFAULT_CITY_NAME = "北京";
//地图最大等级
var MAX_ZOOM = 17;
//地图最小等级
var MIN_ZOOM = 4;

var WebtAPI = {
	VERSION_NUMBER: "Release 2.11",
	singleFile: !0,
	_getScriptLocation: function() {
/*		for (var a = /(^|(.*?\/))(WebtAPI.js)(\?|$)/,
		b = document.getElementsByTagName("script"), c, d = "", f = 0, g = b.length; f < g; f++) if (c = b[f].getAttribute("src")) if (c = c.match(a)) {
			d = c[1];
			break
		}
		return function() {
			return d
		}*/
	} ()
};
WebtAPI.WUtil = {
	EPSG4326: new OpenLayers.Projection("EPSG:4326"),
	EPSG900913: new OpenLayers.Projection("EPSG:900913"),
	_toMerc: function(a) {
		if (a && a.lon) return a = new OpenLayers.LonLat(a.lon, a.lat),
		a.transform(this.EPSG4326, this.EPSG900913),
		a
	},
	_toWGS84: function(a) {
		if (a && a.lon) return a = new OpenLayers.LonLat(a.lon, a.lat),
		a.transform(this.EPSG900913, this.EPSG4326),
		a
	},
	_formatLinePoint: function(a) {
		var b = [],
		c = [],
		a = a.split(","),
		d = a[0].split(" ");
		b[0] = d;
		d = this._toMerc(new OpenLayers.LonLat(d[0] / 1E6, d[1] / 1E6));
		c[0] = new OpenLayers.Geometry.Point(d.lon, d.lat);
		for (d = 1; d < a.length; d++) {
			var f = a[d].split(" ");
			b[d] = [parseInt(b[d - 1][0]) + parseInt(f[0]), parseInt(b[d - 1][1]) + parseInt(f[1])];
			f = this._toMerc(new OpenLayers.LonLat(b[d][0] / 1E6, b[d][1] / 1E6));
			c[d] = new OpenLayers.Geometry.Point(f.lon, f.lat)
		}
		return c
	},
	CtoH: function(a) {
		for (var b = "",
		c = 0; c < a.length; c++) b = 12288 == a.charCodeAt(c) ? b + String.fromCharCode(a.charCodeAt(c) - 12256) : 65280 < a.charCodeAt(c) && 65375 > a.charCodeAt(c) ? b + String.fromCharCode(a.charCodeAt(c) - 65248) : b + String.fromCharCode(a.charCodeAt(c));
		return b
	},
	replaceUrlIllegalChar: function(a) {
		return a.replace(/#/ig, " ")
	},
	validateParamIsNull: function(a) {
		return ! a || "" == a
	},
	validateParamIsNumber: function(a) {
		return "number" == this._getType(a) && !isNaN(a)
	},
	validateParamIsString: function(a) {
		return "string" == this._getType(a)
	},
	validateParamIsObject: function(a) {
		return "object" == this._getType(a)
	},
	_getType: function(a) {
		var b;
		return ("object" == (b = typeof a) ? null == a && "null" || Object.prototype.toString.call(a).slice(8, -1) : b).toLowerCase()
	}
};
WebtAPI.WControl = OpenLayers.Class(OpenLayers.Control, {
	controlDirection: "lt",
	controlOffset: null,
	initialize: function(a) {
		OpenLayers.Control.prototype.initialize.apply(this, arguments);
		this.displayClass = this.CLASS_NAME.replace("WebtAPI.", "wa").replace(/\./g, "")
	},
	setOffset: function() {
		switch (this.controlDirection) {
		case "lt":
			this.div.style.left = this.controlOffset.x + "px";
			this.div.style.top = this.controlOffset.y + "px";
			alert("lt:"+this.div.style.left);
			alert("lt:"+this.div.style.top);
			break;
		case "rt":
			this.div.style.right = this.controlOffset.x + "px";
			this.div.style.top = this.controlOffset.y + "px";
			break;
		case "lb":
			this.div.style.left = this.controlOffset.x + "px";
			this.div.style.bottom = this.controlOffset.y + "px";
			alert("lb:"+this.div.style.left);
			alert("lb:"+this.div.style.top);
			break;
		case "rb":
			this.div.style.right = this.controlOffset.x + "px",
			this.div.style.bottom = this.controlOffset.y + "px"
		}
	},
	draw: function(a) {
		OpenLayers.Control.prototype.draw.apply(this, arguments);
		null != this.controlOffset && null != this.div && this.setOffset()
	},
	setDirection: function(a) {
		null != div && (this.controlDirection = a)
	},
	setControlOffset: function(a) {
		null != a && (this.controlOffset = a)
	}
});
WebtAPI.WKeyboard = OpenLayers.Class(OpenLayers.Handler.Keyboard, {
	activate: function() {
		if (OpenLayers.Handler.prototype.activate.apply(this, arguments)) {
			for (var a = 0,
			b = this.KEY_EVENTS.length; a < b; a++) OpenLayers.Event.observe(this.map.div, "click",
			function() {
				this.map ? (this.map.div.tabIndex = "1", this.map.div.focus()) : (this.tabIndex = "1", this.focus())
			}),
			OpenLayers.Event.observe(this.map.div, this.KEY_EVENTS[a], this.eventListener);
			return ! 0
		}
		return ! 1
	},
	deactivate: function() {
		var a = !1;
		if (OpenLayers.Handler.prototype.deactivate.apply(this, arguments)) {
			for (var a = 0,
			b = this.KEY_EVENTS.length; a < b; a++) OpenLayers.Event.stopObserving(this.map.div, this.KEY_EVENTS[a], this.eventListener);
			a = !0
		}
		return a
	}
});
WebtAPI.WControl.Navigation = OpenLayers.Class(OpenLayers.Control.Navigation, {
	draw: function() {
		OpenLayers.Control.Navigation.prototype.draw.apply(this, arguments);
		this.div = document.createElement("div");
		this.div.className = "waMouseWheel";
		this.div.style.display = "none";
		var a = OpenLayers.Util.getImagesLocation() + "mouse.gif";
		this.div.innerHTML = '<div style="left:0;top:0;"><img src="' + a + '" style="left:0;" /></div><div style="right:0;top:0;"><img src="' + a + '" style="left:-9px;" /></div><div style="left:0;bottom:0;"><img src="' + a + '" style="left:-18px;" /></div><div style="right:0;bottom:0;"><img src="' + a + '" style="left:-27px;" /></div>';
		return this.div
	},
	wheelUp: function(a, b) {
		function c() {
			4 <= h ? g.style.display = "none": (g.style.width = parseInt(g.style.width) + 16 + "px", g.style.height = parseInt(g.style.height) + 10 + "px", g.style.left = parseInt(g.style.left) - 8 + "px", g.style.top = parseInt(g.style.top) - 5 + "px", h++, setTimeout(c, 100))
		}
		var d = this.map.getControl("GTContextMenu");
		if (d) if (d.hide(), 12 == this.map.getZoom()) for (var f = 0; f < d.items.length; f++)"zoomIn" == d.items[f].action && (d.items[f].disabled = !0);
		else for (f = 0; f < d.items.length; f++)"zoomOut" == d.items[f].action && (d.items[f].disabled = !1);
		this.wheelChange(a, b || 1);
		OpenLayers.Element.removeClass(this.div, "wheelDown");
		OpenLayers.Element.addClass(this.div, "wheelUp");
		this.div.style.width = "60px";
		this.div.style.height = "50px";
		this.div.style.display = "";
		this.div.style.left = a.xy.x - 30 + "px";
		this.div.style.top = a.xy.y - 25 + "px";
		var g = this.div,
		h = 0;
		c()
	},
	wheelDown: function(a, b) {
		function c() {
			4 <= i ? h.style.display = "none": (h.style.width = 0 >= parseInt(h.style.width) - 16 ? 0 : parseInt(h.style.width) - 16 + "px", h.style.height = 0 >= parseInt(h.style.height) - 10 ? 0 : parseInt(h.style.height) - 10 + "px", h.style.left = parseInt(h.style.left) + 8 + "px", h.style.top = parseInt(h.style.top) + 5 + "px", i++, g = setTimeout(c, 100))
		}
		var d = this.map.getControl("GTContextMenu");
		if (d) if (d.hide(), 1 == this.map.getZoom()) for (var f = 0; f < d.items.length; f++)"zoomOut" == d.items[f].action && (d.items[f].disabled = !0);
		else for (f = 0; f < d.items.length; f++)"zoomIn" == d.items[f].action && (d.items[f].disabled = !1);
		var g;
		g && window.clearTimeout(g);
		this.wheelChange(a, b || -1);
		OpenLayers.Element.removeClass(this.div, "wheelUp");
		OpenLayers.Element.addClass(this.div, "wheelDown");
		this.div.style.width = "124px";
		this.div.style.height = "90px";
		this.div.style.display = "";
		this.div.style.left = a.xy.x - 62 + "px";
		this.div.style.top = a.xy.y - 45 + "px";
		var h = this.div,
		i = 0;
		c()
	}
});
WebtAPI.WControl.Copyright = OpenLayers.Class(WebtAPI.WControl, {
	autoActivate: !0,
	controlDirection: "lb",
	controlOffset: new OpenLayers.Pixel(120, 4),
	items: [],
	itemPrefix: DEFAULT_COPY_RIGHT,
	contentDiv: null,
	initialize: function(a) {
		OpenLayers.Util.extend(this, a);
		WebtAPI.WControl.prototype.initialize.apply(this, arguments);
		this.items = WebtAPI.WControl.Copyright.DEFAULT_ITEM;
		a && (a.items && 0 < a.items.length) && (this.items = this.items.concat(a.items))
	},
	draw: function() {
		WebtAPI.WControl.prototype.draw.apply(this, arguments);
		this.contentDiv = document.createElement("div");
		this.contentDiv.className = "copyrightItem";
		this.contentDiv.innerHTML = this.itemPrefix;
		for (var a = [], b = 0; b < this.items.length; b++) a.push(this._createCopyrightItem(this.items[b].name, this.items[b].link, this.items[b].pic));
		this.contentDiv.innerHTML += " " + a.join(" & ");
		this.div.appendChild(this.contentDiv);
		return this.div
	},
	addCopyrightItem: function(a) {
		for (var b = 0; b < a.length; b++) this.items.push(a[b]);
		this.updateControl(this.itemPrefix, this.items)
	},
	removeCopyrightItem: function(a) {
		var b = this.div.getElementsByTagName("div");
		0 < b.length && a <= b.length && (0 >= a && (a = b.length), this.items.splice(a - 1, 1));
		this.updateControl(this.itemPrefix, this.items)
	},
	_createCopyrightItem: function(a, b, c) {
		var d = "";
		return d = LINK_IS_SHOW ? c && "" != c ? d + ("<a href='" + b + "' target='_blank'><img src='" + c + "' alt='" + a + "' title='" + a + "'></a>") : d + ("<a href='" + b + "' target='_blank'>" + a + "</a>") : d + a
	},
	updateControl: function(a, b) {
		this.div.innerHTML = "";
		this.itemPrefix = null == a ? this.itemPrefix: a;
		this.items = null == b ? this.items: b;
		this.draw()
	},
	CLASS_NAME: "WebtAPI.WControl.Copyright"
});
WebtAPI.WControl.Copyright.DEFAULT_ITEM = [{
	name: "NavInfo",
	link: "http://www.navinfo.com/",
	pic: ""
},
{
	name: "CenNavi",
	link: "http://www.cennavi.com.cn/",
	pic: ""
}];
WebtAPI.WControl.KeyboardDefaults = OpenLayers.Class(OpenLayers.Control.KeyboardDefaults, {
	draw: function() {
		this.handler = new WebtAPI.WKeyboard(this, {
			keydown: this.defaultKeyPress
		})
	},
	defaultKeyPress: function(a) {
		switch (a.keyCode) {
		case OpenLayers.Event.KEY_LEFT:
			this.map.pan( - this.slideFactor, 0);
			OpenLayers.Event.stop(a);
			break;
		case OpenLayers.Event.KEY_RIGHT:
			this.map.pan(this.slideFactor, 0);
			OpenLayers.Event.stop(a);
			break;
		case OpenLayers.Event.KEY_UP:
			this.map.pan(0, -this.slideFactor);
			OpenLayers.Event.stop(a);
			break;
		case OpenLayers.Event.KEY_DOWN:
			this.map.pan(0, this.slideFactor);
			OpenLayers.Event.stop(a);
			break;
		case 33:
			var b = this.map.getSize();
			this.map.pan(0, -0.75 * b.h);
			OpenLayers.Event.stop(a);
			break;
		case 34:
			b = this.map.getSize();
			this.map.pan(0, 0.75 * b.h);
			OpenLayers.Event.stop(a);
			break;
		case 35:
			b = this.map.getSize();
			this.map.pan(0.75 * b.w, 0);
			OpenLayers.Event.stop(a);
			break;
		case 36:
			b = this.map.getSize(),
			this.map.pan( - 0.75 * b.w, 0),
			OpenLayers.Event.stop(a)
		}
	},
	CLASS_NAME: "WebtAPI.WControl.KeyboardDefaults"
});
WebtAPI.WControl.WTouchZoom = OpenLayers.Class(WebtAPI.WControl, {
	staDist: null,
	endXY: {
		endX0: null,
		endY0: null
	},
	autoActivate: !0,
	activate: function() {
		this.map.events.register("touchstart", this, this.touchStart);
		this.map.events.register("touchend", this, this.touchEnd);
		return OpenLayers.Control.prototype.activate.apply(this, arguments)
	},
	deactivate: function() {
		this.map.events.unregister("touchstart", this, this.touchStart);
		this.map.events.unregister("touchend", this, this.touchEnd);
		return OpenLayers.Control.prototype.deactivate.apply(this, arguments)
	},
	touchStart: function(a) {
		if (OpenLayers.Event.isMultiTouch(a) && 1 < a.touches.length) {
			var b = a.touches[0].pageY,
			c = a.touches[1].pageY;
			this.staDist = Math.sqrt(Math.pow(a.touches[0].pageX - a.touches[1].pageX, 2) + Math.pow(b - c, 2))
		}
		OpenLayers.Event.stop(a)
	},
	touchEnd: function(a) {
		if (1 == a.touches.length) 1 == a.changedTouches.length && (this.endXY.endX0 = a.changedTouches[0].pageX, this.endXY.endY0 = a.changedTouches[0].pageY);
		else if (0 == a.touches.length && 1 == a.changedTouches.length) {
			var b = a.changedTouches[0].pageY,
			b = Math.sqrt(Math.pow(this.endXY.endX0 - a.changedTouches[0].pageX, 2) + Math.pow(this.endXY.endY0 - b, 2));
			this.staDist && (b > this.staDist ? (b -= this.staDist, 60 < b && this.map.zoomIn()) : b < this.staDist && (b = this.staDist - b, 60 < b && this.map.zoomOut()), this.staDist = "")
		}
		OpenLayers.Event.stop(a)
	},
	CLASS_NAME: "WebtAPI.WControl.WTouchZoom"
});
WebtAPI.WStyle = {
	clone: function() {
		return {
			fillColor: "#FFFFFF",
			fillOpacity: 0.4,
			hoverFillColor: "white",
			hoverFillOpacity: 0.8,
			strokeColor: "#FD8045",
			strokeOpacity: 1,
			strokeWidth: 3,
			strokeLinecap: "round",
			strokeDashstyle: "solid",
			hoverStrokeColor: "red",
			hoverStrokeOpacity: 1,
			hoverStrokeWidth: 0.2,
			pointRadius: 4,
			hoverPointRadius: 1,
			hoverPointUnit: "%",
			pointerEvents: "visiblePainted",
			cursor: "inherit",
			arrow: !1
		}
	}
};
WebtAPI.style = {
	line: {
		fillColor: "#E8F2FE",
		fillOpacity: 0.4,
		hoverFillColor: "white",
		hoverFillOpacity: 0.8,
		strokeColor: "#3A9DF0",
		strokeOpacity: 0.7,
		strokeWidth: 6,
		strokeLinecap: "round",
		strokeDashstyle: "solid",
		hoverStrokeColor: "red",
		hoverStrokeOpacity: 1,
		hoverStrokeWidth: 0.2,
		pointRadius: 6,
		hoverPointRadius: 1,
		hoverPointUnit: "%",
		pointerEvents: "visiblePainted",
		cursor: "inherit"
	},
	select: {
		fillColor: "blue",
		fillOpacity: 0.4,
		hoverFillColor: "white",
		hoverFillOpacity: 0.8,
		strokeColor: "#ff0000",
		strokeOpacity: 1,
		strokeWidth: 6,
		strokeLinecap: "round",
		strokeDashstyle: "solid",
		hoverStrokeColor: "red",
		hoverStrokeOpacity: 1,
		hoverStrokeWidth: 0.2,
		pointRadius: 6,
		hoverPointRadius: 1,
		hoverPointUnit: "%",
		pointerEvents: "visiblePainted",
		cursor: "pointer"
	},
	walk: {
		fillColor: "#66cccc",
		fillOpacity: 0.2,
		hoverFillColor: "white",
		hoverFillOpacity: 0.8,
		strokeColor: "#00FF00",
		strokeOpacity: 0.7,
		strokeLinecap: "round",
		strokeWidth: 3,
		strokeDashstyle: "dash",
		hoverStrokeColor: "red",
		hoverStrokeOpacity: 1,
		hoverStrokeWidth: 0.2,
		pointRadius: 3,
		hoverPointRadius: 1,
		hoverPointUnit: "%",
		pointerEvents: "visiblePainted",
		cursor: "inherit"
	},
	walkSelect: {
		fillColor: "#66cccc",
		fillOpacity: 0.2,
		hoverFillColor: "white",
		hoverFillOpacity: 0.8,
		strokeColor: "#ff0000",
		strokeOpacity: 1,
		strokeLinecap: "round",
		strokeWidth: 3,
		strokeDashstyle: "dash",
		hoverStrokeColor: "red",
		hoverStrokeOpacity: 1,
		hoverStrokeWidth: 0.2,
		pointRadius: 3,
		hoverPointRadius: 1,
		hoverPointUnit: "%",
		pointerEvents: "visiblePainted",
		cursor: "inherit"
	},
	"delete": {
		display: "none"
	}
};
WebtAPI.TileCacheLayer = OpenLayers.Class(OpenLayers.Layer.TileCache, {
	initialize: function(a, b, c) {
		c = OpenLayers.Util.extend({
			format: "image/png",
			isBaseLayer: !0
		},
		c);
		OpenLayers.Layer.TileCache.prototype.initialize.apply(this, [a, b, {},
		c]);
		this.extension = this.format.split("/")[1].toLowerCase();
		this.extension = "jpg" == this.extension ? "jpeg": this.extension;
		this.transitionEffect = "resize";
		this.buffer = 0
	},
	getURL: function(a) {
		var b = this.map.getResolution(),
		c = this.map.getMaxExtent(),
		d = this.tileSize,
		f = Math.round((a.left - c.left) / (b * d.w)),
		b = Math.round((c.top - a.top) / (b * d.h)),
		d = this.map.zoom + this.map.minZoom;
		3 == d && f > Math.pow(2, d) - 1 && (f -= Math.pow(2, d));
		0 > f && (f += Math.round(c.getWidth() / a.getWidth()));
		0 > b && (b += Math.round(c.getHeight() / a.getHeight()));
		return this.getTilePic(f, b, d)
	},
	getTilePic: function(a, b, c) {
		var d = "";
		6 < c ? (d = Math.pow(2, c - 5), d = c + "/" + ("R" + Math.floor(b / d)) + "/" + ("C" + Math.floor(a / d)) + "/") : d = c + "/";
		var f = c + "-" + a + "-" + b,
		g = "";
		switch (MAP_ACCESS_OPTION) {
		case 0:
			g = this.url + d + f + ".png";
			break;
		case 1:
			g = this.url + "?x=" + a + "&y=" + b + "&z=" + c;
			break;
		default:
			g = this.url + d + f + ".png"
		}
		return g
	},
	clone: function(a) {
		null == a && (a = new GTOL.Layer.GTTileCache(this.name, this.url, this.options));
		return a = OpenLayers.Layer.TileCache.prototype.clone.apply(this, [a])
	},
	CLASS_NAME: "WebtAPI.TileCacheLayer"
});
WebtAPI.TrafTileCacheLayer = OpenLayers.Class(WebtAPI.TileCacheLayer, {
	autoRefresh: !0,
	timeInterval: 3E5,
	intervalID: null,
	getTilePic: function(a, b, c) {
		if (6 < c) {
			var d = Math.pow(2, c - 5);
			dir = c + "/" + ("R" + Math.floor(b / d)) + "/" + ("C" + Math.floor(a / d)) + "/"
		} else dir = c + "/";
		return this.url + dir + (c + "-" + a + "-" + b) + ".png?t=" + (new Date).getTime()
	},
	initialize: function(a, b, c) {
		WebtAPI.TileCacheLayer.prototype.initialize.apply(this, [a, b, c]);
		this.visibility && this.setAutoRefresh(this.autoRefresh)
	},
	setVisibility: function(a) {
		WebtAPI.TileCacheLayer.prototype.setVisibility.apply(this, [a]);
		a ? this.setAutoRefresh(this.autoRefresh) : clearInterval(this.intervalID)
	},
	setAutoRefresh: function(a) {
		this.autoRefresh = a;
		clearInterval(this.intervalID);
		var b = this;
		a && this.visibility && (this.intervalID = setInterval(function() {
			b.redraw()
		},
		this.timeInterval))
	},
	setTimeInterval: function(a) {
		this.timeInterval = a;
		this.setAutoRefresh(this.autoRefresh)
	}
});
WebtAPI.SatelliteTileCache = OpenLayers.Class(OpenLayers.Layer.TileCache, {
	type: "jpg",
	displayOutsideMaxExtent: !0,
	attribution: '<div style="font-size:14px;font-color:red;font-weight:bold">\u56db\u7ef4\u4e16\u666f</div>',
	initialize: function(a, b, c) {
		c = OpenLayers.Util.extend({
			format: "image/png",
			isBaseLayer: !0
		},
		c);
		OpenLayers.Layer.TileCache.prototype.initialize.apply(this, [a, b, {},
		c]);
		this.extension = this.format.split("/")[1].toLowerCase();
		this.extension = "jpg" == this.extension ? "jpeg": this.extension;
		this.transitionEffect = "resize";
		this.buffer = 0
	},
	getURL: function(a) {
		for (var a = this.adjustBounds(a), a = OpenLayers.Layer.SphericalMercator.inverseMercator(a.left, a.top), b = (a.lon + 180) / 360, a = Math.sin(a.lat * Math.PI / 180), c = 0.5 - Math.log((1 + a) / (1 - a)) / (4 * Math.PI), a = this.map.getZoom() + 4, b = 256 * b * Math.pow(2, a) + 0.5, c = 256 * c * Math.pow(2, a) + 0.5, b = Math.floor(b / 256), d = Math.floor(c / 256), f = Math.ceil((a - 3) / 4), g = 0, h = 0, i = 0, c = "" + (a + "/"), j = 0; j < f; j++) var k = 1 << 4 * (f - j),
		g = Math.floor((1 * b - g * i) / k),
		h = Math.floor((1 * d - h * i) / k),
		c = c + (9 < g ? g: "0" + g),
		c = c + (9 < h ? h: "0" + h),
		c = c + "/",
		i = k;
		a = "" + ((b & 1048575) + (d & 1048575) * Math.pow(2, 20) + (a & 255) * Math.pow(2, 40));
		return this.url + c + a + "." + this.type
	},
	clone: function(a) {
		null == a && (a = new OpenLayers.Layer.TMS(this.name, this.url, this.options));
		return a = OpenLayers.Layer.TMS.prototype.clone.apply(this, [a])
	},
	CLASS_NAME: "WebtAPI.SatelliteTileCache"
});
WebtAPI.MarkerLayer = OpenLayers.Class(OpenLayers.Layer, {
	isBaseLayer: !1,
	markers: null,
	displayMarker: null,
	drawn: !1,
	initialize: function(a, b) {
		OpenLayers.Layer.prototype.initialize.apply(this, arguments);
		this.markers = []
	},
	destroy: function() {
		this.clearMarkers();
		this.markers = null;
		OpenLayers.Layer.prototype.destroy.apply(this, arguments)
	},
	setOpacity: function(a) {
		if (a != this.opacity) {
			this.opacity = a;
			for (var a = 0,
			b = this.markers.length; a < b; a++) this.markers[a].setOpacity(this.opacity)
		}
	},
	moveTo: function(a, b, c) {
		OpenLayers.Layer.prototype.moveTo.apply(this, arguments);
		if (b || !this.drawn) {
			for (var d = 0,
			f = this.markers.length; d < f; d++) this.drawMarker(this.markers[d]);
			this.drawn = !0
		}
	},
	addMarker: function(a) {
		this.markers.push(a);
		null != this.opacity && a.setOpacity(this.opacity);
		this.map && this.map.getExtent() && (a.map = this.map, this.drawMarker(a))
	},
	removeMarker: function(a) {
		if (a && (a.alwaysOnShow && (this.displayMarker = a), this.markers && this.markers.length)) OpenLayers.Util.removeItem(this.markers, a),
		a.erase()
	},
	clearMarkers: function() {
		if (null != this.markers) for (var a = this.markers.length - 1; 0 <= a; --a) this.removeMarker(this.markers[a])
	},
	drawMarker: function(a) {
		var b = this.map.getLayerPxFromLonLat(a.lonlat);
		null == b ? a.display(!1) : a.isDrawn() ? a.icon && a.icon.moveTo(b) : this.div.appendChild(a.draw(b))
	},
	getDataExtent: function() {
		var a = null;
		if (this.markers && 0 < this.markers.length) for (var a = new OpenLayers.Bounds,
		b = 0,
		c = this.markers.length; b < c; b++) a.extend(this.markers[b].lonlat);
		return a
	},
	getMarkerById: function(a) {
		for (var b = null,
		c = 0,
		d = this.markers.length; c < d; c++) if (this.markers[c].id && this.markers[c].id == a) {
			b = this.markers[c];
			break
		}
		return b
	},
	CLASS_NAME: "OpenLayers.Layer.Markers"
});
WebtAPI.OverviewMapLayer = OpenLayers.Class(WebtAPI.TileCacheLayer, {
	getURL: function(a) {
		var b = this.map.getResolution(),
		c = this.map.getMaxExtent(),
		d = this.tileSize,
		f = Math.round((a.left - c.left) / (b * d.w)),
		a = Math.round((c.top - a.top) / (b * d.h)),
		b = this.map.zoom;
		f > Math.pow(2, b) - 1 && (f -= Math.pow(2, b));
		return this.getTilePic(f, a, b)
	},
	clone: function(a) {
		null == a && (a = new GTOL.Control.GTOverviewLayer(this.name, this.url, this.options));
		return a = GTOL.Layer.GTTileCache.prototype.clone.apply(this, [a])
	},
	CLASS_NAME: "WebtAPI.OverviewMapLayer"
});
WebtAPI.WMap = OpenLayers.Class(OpenLayers.Map, {
	Z_INDEX_BASE: {
		BaseLayer: 100,
		Overlay: 525,
		Feature: 325,
		Popup: 750,
		Control: 1E3
	},
	mouseCursor: null,
	mouseDrag: !0,
	mouseWheelZoom: !0,
	dblclickZoomUp: !0,
	keyBoardMove: !0,
	kineticDrag: !0,
	continuousZoom: !0,
	copyRightShow: !0,
	doubleTouchZoom: !1,
	initCity: DEFAULT_CITY_NAME,
	maxZoom: MAX_ZOOM,
	minZoom: MIN_ZOOM,
	initZoom: 5 < MAX_ZOOM - MIN_ZOOM ? MAX_ZOOM - MIN_ZOOM - 5 : 0,
	dynamicVectorLayer: null,
	markersLayer: null,
	trafficLayer: null,
	baseMarkerlayer: null,
	vectorMarkersLayer: null,
	satelliteLayer: null,
	mapBaseLayers: null,
	rightMenuFlag: !0,
	rightMenu: null,
	initialize: function(a, b) {
		var c = b;
		c || (c = {});
		OpenLayers.Util.extend(this, c);
		var d = [new OpenLayers.Control.ArgParser, new OpenLayers.Control.Attribution];
		this.mouseDrag && d.push(new WebtAPI.WControl.Navigation({
			id: "naviControl",
			zoomWheelEnabled: this.mouseWheelZoom,
			dragPanOptions: {
				enableKinetic: this.kineticDrag
			}
		}));
		this.dblclickZoomUp || d.push(new OpenLayers.Control({
			id: "dblclickZoomUpControl",
			map: this,
			handler: new OpenLayers.Handler.Click(this, {},
			{
				stopDouble: !0
			})
		}));
		this.keyBoardMove && d.push(new WebtAPI.WControl.KeyboardDefaults({
			id: "KeyboardControl"
		}));
		this.copyRightShow && d.push(new WebtAPI.WControl.Copyright({
			id: "copyRightControl"
		}));
		this.doubleTouchZoom && d.push(new WebtAPI.WControl.WTouchZoom({
			id: "touchZoomControl"
		}));
		OpenLayers.Util.extend(c, {
			controls: d
		});
		OpenLayers.Map.prototype.initialize.apply(this, [a, c]);
		this.customTheme = OpenLayers._getScriptLocation() + "theme/default/GTMap-style.css";
		for (var c = !0,
		d = document.getElementsByTagName("link"), f = 0, g = d.length; f < g; ++f) if (OpenLayers.Util.isEquivalentUrl(d.item(f).href, this.customTheme)) {
			c = !1;
			break
		}
		c && (c = document.createElement("link"), c.setAttribute("rel", "stylesheet"), c.setAttribute("type", "text/css"), c.setAttribute("href", this.customTheme), document.getElementsByTagName("head")[0].appendChild(c));
		this.projection = new OpenLayers.Projection("EPSG:900913");
		this.displayProjection = new OpenLayers.Projection("EPSG:4326");
		this.units = "m";
		this.numZoomLevels = this.maxZoom - this.minZoom + 1;
		this.maxResolution = 156543.0339;
		if (0 <= this.minZoom) for (f = 0; f < this.minZoom; f++) this.maxResolution /= 2;
		this.maxExtent = new OpenLayers.Bounds( - 20037508, -20037508, 40075016, 20037508);
		this.restrictedExtent = new OpenLayers.Bounds( - 20037508, -20037508, 40075016, 1.3358338667E7);
		this.rightMenuFlag && (this.div.oncontextmenu = new Function("return false"));
		this.div.style.cursor = "url('" + CURSOR_OPEN + "'),default";
		var h = this;
		this.layerContainerDiv.onmousedown = function() {
			this.style.cursor = h.mouseCursor && h.mouseCursor != "" ? "": "url('" + CURSOR_CLOSE + "'),default"
		};
		this.layerContainerDiv.onmouseup = function() {
			this.style.cursor = h.mouseCursor && h.mouseCursor != "" ? "": "url('" + CURSOR_OPEN + "'),default"
		};
		this._initLayer();
		WebtAPI.mapInst = this
	},
	_initLayer: function() {
		this.addLayers([this.mapBaseLayers = new WebtAPI.TileCacheLayer("baseLayer", TILE_PIV_URL, {
			isBaseLayer: !0
		}), this.satelliteLayer = new WebtAPI.SatelliteTileCache("satelliteLayer", SATELITE_PIV_URL, {
			isBaseLayer: !1,
			visibility: !1
		}), this.satelliteMarkerLayer = new WebtAPI.SatelliteTileCache("satelliteMarkerLayer", SATELITE_MARKER_URL, {
			type: "png",
			isBaseLayer: !1,
			visibility: !1
		}), this.trafficLayer = new WebtAPI.TrafTileCacheLayer("trafficLayer", TRAFFIC_PIV_URL, {
			isBaseLayer: !1,
			visibility: !1
		}), this.englishLayer = new WebtAPI.TileCacheLayer("englishLayer", ENG_PIV_URL, {
			isBaseLayer: !1,
			visibility: !1
		}), this.dynamicVectorLayer = new OpenLayers.Layer.Vector("featureLayer"), this.vectorMarkersLayer = new WebtAPI.MarkerLayer("vectorMarkersLayer"), this.markersLayer = new WebtAPI.MarkerLayer("markersLayer")]);
		this.dynamicVectorLayer.style = WebtAPI.WStyle.clone()
	},
	setMouseCursor: function(a) {
		this.mouseCursor = a;
		"" != a ? (this.eventsDiv.style.cursor = "url('" + a + "'),default", this.div.style.cursor = "url('" + a + "'),default", this.layerContainerDiv.style.cursor = "url('" + a + "'),default") : (this.eventsDiv.style.cursor = "", this.div.style.cursor = "url('" + CURSOR_OPEN + "'),default", this.layerContainerDiv.style.cursor = "url('" + CURSOR_OPEN + "'),default")
	},
	setKeyboardControlActivate: function(a) {
		this.displayControl("KeyboardControl", a)
	},
	setMouseDragControlActivate: function(a) {
		this.displayControl("naviControl", a)
	},
	setMouseWheelZoomControlActivate: function(a) {
		var b = this.getControl("naviControl");
		b.deactivate();
		b.zoomWheelEnabled = a;
		b.activate()
	},
	setKineticDragControlActivate: function(a) {
		var b = this.getControl("naviControl");
		b.deactivate();
		b.dragPanOptions.enableKinetic = a;
		b.activate()
	},
	setDblclickZoomUpControlActivate: function(a) {
		this.displayControl("dblclickZoomUpControl", a)
	},
	setContinuousZoom: function() {},
	setTouchZoomControlActivate: function(a) {
		this.displayControl("touchZoomControl", a)
	},
	getCenterLonLat: function() {
		var a = this.getCenter();
		return WebtAPI.WUtil._toWGS84(a)
	},
	getBounds: function() {
		return this.calculateBounds()
	},
	setCenterByLonLat: function(a, b) {
		this.setCenter(WebtAPI.WUtil._toMerc(a), b ? b: this.initZoom, !1, !0)
	},
	panToLonLat: function(a) {
		this.panTo(WebtAPI.WUtil._toMerc(a))
	},
	getCityCode: function() {
		return this.initCity
	},
	setCityCode: function(a) {
		this.initCity = a
	},
	getLeftTopLonLat: function() {
		var a = this.calculateBounds(),
		a = new OpenLayers.LonLat(a.left, a.top);
		return WebtAPI.WUtil._toWGS84(a)
	},
	getRightBottomLonLat: function() {
		var a = this.calculateBounds(),
		a = new OpenLayers.LonLat(a.right, a.bottom);
		return WebtAPI.WUtil._toWGS84(a)
	},
	clearAllElements: function() {
		for (var a = this.getLayersByClass("OpenLayers.Layer.Markers"), b = 0; b < a.length; b++) a[b].clearMarkers(!0);
		a = this.getLayersByClass("OpenLayers.Layer.Vector");
		for (b = 0; b < a.length; b++) a[b].removeAllFeatures();
		this.clearPopups()
	},
	removeSelectedFeature: function() {
		for (var a = this.getControlsByClass("OpenLayers.Control.ModifyFeature")[0].selectControl, b = this.dynamicVectorLayer.selectedFeatures, c = 0; c < b.length; c++) {
			var d = b[c];
			a.unselect(d);
			this.dynamicVectorLayer.removeFeatures(d)
		}
	},
	getBestView: function(a) {
		return {
			center: a.getCenterLonLat(),
			zoom: this.getZoomForExtent(a, !1)
		}
	},
	addMarker: function(a, b) {
		b && "OpenLayers.Layer.Markers" == b.CLASS_NAME ? b.addMarker(a) : this.markersLayer.addMarker(a)
	},
	addMarkerArray: function(a, b) {
		b && "OpenLayers.Layer.Markers" == b.CLASS_NAME ? b.addMarkerArray(a) : this.markersLayer.addMarkerArray(a)
	},
	clearMarker: function(a, b) {
		b = b ? b: this.markersLayer;
		if ("OpenLayers.Layer.Markers" == b.CLASS_NAME) if (a && "object" === typeof a && a.constructor !== Array) b.removeMarker(a);
		else if (a.constructor === Array) for (var c = 0; c < a.length; c++) this.clearMarker(a[c])
	},
	clearMarkers: function(a) {
		if (a)"OpenLayers.Layer.Markers" == a.CLASS_NAME && a.clearMarkers();
		else for (var a = this.getLayersByClass("OpenLayers.Layer.Markers"), b = 0; b < a.length; b++) a[b].clearMarkers()
	},
	addContextMenu: function(a) {
		a.CLASS_NAME && "WebtAPI.WControl.WContextMenu" == a.CLASS_NAME && (this.rightMenu = a, this.addControl(a))
	},
	removeContextMenu: function(a) {
		a.CLASS_NAME && "WebtAPI.WControl.WContextMenu" == a.CLASS_NAME && (this.rightMenu = null, this.removeControl(a))
	},
	clearPopups: function() {
		for (var a = this.popups.length - 1; 0 <= a; --a) this.removePopup(this.popups[a])
	},
	getDegreeFromLonLat: function(a, b) {
		var c = px2 = null,
		c = 0,
		c = this.getPixelFromLonLat(a);
		px2 = this.getPixelFromLonLat(b);
		return c = 180 * Math.atan2(c.y - px2.y, px2.x - c.x) / Math.PI
	},
	registerEvents: function(a, b) {
		"rightclick" == a ? this.events.register("mousedown", this,
		function(a) {
			a = a ? a: window.event;
			OpenLayers.Event.isRightClick(a) && b.apply(this, [a])
		}) : this.events.register(a, this, b)
	},
	unregisterEvents: function(a, b) {
		this.events.unregister(a, this, b)
	},
	displayControl: function(a, b) {
		var c = this.getControl(a);
		c && (b ? c.activate() : c.deactivate())
	},
	CLASS_NAME: "WebtAPI.WMap"
});
WebtAPI.WPopup = OpenLayers.Class(OpenLayers.Popup, {
	shadowBGContent: null,
	toolbarContent: null,
	toolbarHeight: 100,
	displayClass: "olPopup",
	contentDisplayClass: "waPopupContent",
	contentWidth: null,
	closeOnMove: !1,
	showToolbar: !0,
	panMapIfOutOfView: !0,
	offset: null,
	closeBox: !1,
	closeBoxCallback: null,
	map: null,
	initialize: function(a, b, c, d, f, g) {
		null == a && (a = OpenLayers.Util.createUniqueID(this.CLASS_NAME + "_"));
		"OpenLayers.Marker" == b.CLASS_NAME && (b = b.getLonLat());
		this.id = a;
		this.lonlat = WebtAPI.WUtil._toMerc(b);
		c && (this.contentWidth = c);
		null != d && (this.contentHTML = d);
		this.closeBox = f;
		this.closeBoxCallback = g
	},
	draw: function(a) {
		null == a && (null != this.lonlat && null != this.map) && (a = this.map.getLayerPxFromLonLat(this.lonlat));
		var b = this.getContentHeight();
		this.showToolbar && (b += this.toolbarHeight);
		var c = WebtAPI.WPopup.WIDTH;
		this.contentWidth && (c = this.contentWidth);
		this.contentSize = new OpenLayers.Size(c, b);
		this.div = OpenLayers.Util.createDiv(this.id, null, null, null, null, null);
		this.div.className = this.displayClass;
		this.createBGContent();
		this.contentDiv = OpenLayers.Util.createDiv(this.div.id + "_contentDiv", null, this.contentSize.clone());
		this.contentDiv.className = this.contentDisplayClass;
		this.div.appendChild(this.contentDiv);
		this.showToolbar && this.createToolbar();
		null == this.offset ? this.setOffset( - 60, -(this.contentSize.h + 90)) : this.setOffset( - this.offset.x, -(this.offset.y + this.contentSize.h));
		this.closeBox && this.addCloseBox(this.closeBoxCallback);
		this.registerEvents();
		this.closeOnMove && this.map.events.register("movestart", this, this.hide); ! this.disableFirefoxOverflowHack && "firefox" == OpenLayers.BROWSER_NAME && (this.map.events.register("movestart", this,
		function() {
			var a = document.defaultView.getComputedStyle(this.contentDiv, null).getPropertyValue("overflow");
			if (a != "hidden") {
				this.contentDiv._oldOverflow = a;
				this.contentDiv.style.overflow = "hidden"
			}
		}), this.map.events.register("moveend", this,
		function() {
			var a = this.contentDiv._oldOverflow;
			if (a) {
				this.contentDiv.style.overflow = a;
				this.contentDiv._oldOverflow = null
			}
		}));
		this.moveTo(a); ! this.autoSize && !this.size && this.setSize(this.contentSize);
		this.setContentHTML();
		this.panMapIfOutOfView && this.panIntoView();
		return this.div
	},
	setToolbarDisplay: function(a) {
		this.showToolbar = a
	},
	moveTo: function(a) {
		null != a && null != this.div && (this.div.style.left = a.x + this.offset.x + "px", this.div.style.top = a.y + this.offset.y + "px")
	},
	setOffset: function(a, b) {
		this.offset = new OpenLayers.Pixel(a, b)
	},
	setSize: function(a) {
		this.size = a.clone();
		var b = this.getContentDivPadding(),
		c = b.left + b.right,
		d = b.top + b.bottom;
		this.fixPadding();
		c += this.padding.left + this.padding.right;
		d += this.padding.top + this.padding.bottom;
		if (this.closeDiv) var f = parseInt(this.closeDiv.style.width),
		c = c + (f + b.right);
		this.size.w += c;
		this.size.h += d;
		"msie" == OpenLayers.BROWSER_NAME && (this.contentSize.w += b.left + b.right, this.contentSize.h += b.bottom + b.top);
		null != this.div && (this.div.style.width = this.size.w + 30 + "px", this.div.style.height = this.size.h + 30 + "px");
		null != this.contentDiv && (this.contentDiv.style.width = a.w + "px", this.contentDiv.style.height = a.h + "px")
	},
	addCloseBox: function(a) {
		this.closeDiv = OpenLayers.Util.createDiv(this.id + "_close", null, new OpenLayers.Size(16, 15));
		this.closeDiv.className = "waPopupCloseBox";
		this.closeDiv.style.right = "40px";
		this.closeDiv.style.top = "10px";
		this.div.appendChild(this.closeDiv);
		a = a ||
		function(a) {
			this.hide();
			OpenLayers.Event.stop(a)
		};
		OpenLayers.Event.observe(this.closeDiv, "touchend", OpenLayers.Function.bindAsEventListener(a, this));
		OpenLayers.Event.observe(this.closeDiv, "click", OpenLayers.Function.bindAsEventListener(a, this))
	},
	getLonLat: function() {
		return WebtAPI.WUtil._toWGS84(this.lonlat)
	},
	createBGContent: function() {
		this.shadowBGContent = document.createElement("div");
		this.shadowBGContent.className = "waPopupShadowBG";
		this.shadowBGContent.style.width = this.contentSize.w + 30 + "px";
		this.shadowBGContent.style.height = this.contentSize.h + 30 + "px";
		var a = document.createElement("div");
		a.style.width = this.contentSize.w + "px";
		a.style.height = this.contentSize.h + "px";
		a.style.top = "0px";
		a.style.left = "0px";
		a.className = "lt";
		this.shadowBGContent.appendChild(a);
		a = document.createElement("div");
		a.style.width = "30px";
		a.style.height = this.contentSize.h + "px";
		a.style.top = "0px";
		a.style.left = this.contentSize.w + "px";
		a.className = "rt";
		this.shadowBGContent.appendChild(a);
		a = document.createElement("div");
		a.style.width = this.contentSize.w + "px";
		a.style.height = "30px";
		a.style.top = this.contentSize.h + "px";
		a.style.left = "0px";
		a.className = "lb";
		this.shadowBGContent.appendChild(a);
		a = document.createElement("div");
		a.style.width = "30px";
		a.style.height = "30px";
		a.style.top = this.contentSize.h + "px";
		a.style.left = this.contentSize.w + "px";
		a.className = "rb";
		this.shadowBGContent.appendChild(a);
		a = document.createElement("div");
		a.className = "tail";
		a.style.top = this.contentSize.h + 15 + "px";
		a.style.left = "60px";
		this.shadowBGContent.appendChild(a);
		this.div.appendChild(this.shadowBGContent)
	},
	createToolbar: function() {
		this.toolbarContent = document.createElement("div");
		this.toolbarContent.style.width = this.contentSize.w + 14 + "px";
		this.toolbarContent.className = "waPopupToolbar";
		this.toolbarContent.style.top = this.contentSize.h - this.toolbarHeight + 10 + "px";
		this.toolbarContent.innerHTML = "<div class='toolbarContent' id='toolbarContent01'><ul class='toolbarTab'><li style='margin-left:" + (this.contentSize.w + 14 - 291) / 2 + "px;' class='active'>\u5230\u8fd9\u91cc\u53bb</li><li onclick='_switchPopTab(2, 1)'>\u4ece\u8fd9\u91cc\u51fa\u53d1</li><li onclick='_switchPopTab(3, 1)'>\u5728\u9644\u8fd1\u627e</li></ul><div style='padding-top: 20px;padding-left:20px;'><input type='text' id='popupPoiInput01' class='popup_toolbar_input'>&nbsp;<input type='button' class='popup_toolbar_busBtn' onclick='searchPoiByPop(\"" + this.getLonLat().lon + '", "' + this.getLonLat().lat + "\", \"bus\", \"end\")'>&nbsp;<input type='button' class='popup_toolbar_trafBtn' onclick='searchPoiByPop(\"" + this.getLonLat().lon + '", "' + this.getLonLat().lat + "\", \"traf\", \"end\")'></div></div><div class='toolbarContent' id='toolbarContent02' style='display: none;'><ul class='toolbarTab'><li onclick='_switchPopTab(1, 2)' style='margin-left:" + (this.contentSize.w + 14 - 291) / 2 + "px;'>\u5230\u8fd9\u91cc\u53bb</li><li class='active'>\u4ece\u8fd9\u91cc\u51fa\u53d1</li><li onclick='_switchPopTab(3, 2)'>\u5728\u9644\u8fd1\u627e</li></ul><div style='padding-top: 20px;padding-left:20px;'><input type='text' id='popupPoiInput02' class='popup_toolbar_input'>&nbsp;<input type='button' class='popup_toolbar_busBtn' onclick='searchPoiByPop(\"" + this.getLonLat().lon + '", "' + this.getLonLat().lat + "\", \"bus\", \"sta\")'>&nbsp;<input type='button' class='popup_toolbar_trafBtn' onclick='searchPoiByPop(\"" + this.getLonLat().lon + '", "' + this.getLonLat().lat + "\", \"traf\", \"sta\")'></div></div><div class='toolbarContent' id='toolbarContent03' style='display: none;'><ul class='toolbarTab'><li onclick='_switchPopTab(1, 3)' style='margin-left:" + (this.contentSize.w + 14 - 291) / 2 + "px;'>\u5230\u8fd9\u91cc\u53bb</li><li onclick='_switchPopTab(2, 3)'>\u4ece\u8fd9\u91cc\u51fa\u53d1</li><li class='active'>\u5728\u9644\u8fd1\u627e</li></ul><div style='padding-top: 10px;padding-left:20px;'><input type='hidden' id='radius' value='500'><div style='height:23px;width:248px;position:relative;background:url(\"images/huagan.png\");'><div id='slider' style='font-size:1px;height:10px;width:200px;position:absolute;left:23px;cursor: pointer;' onclick='clickSlider()'></div><div id='sliderBar' onmousedown='sliderStart(this,event)' style='background:url(\"images/huakuai.png\");font-size:1px;height:9px;width:16px;position:absolute;top:2px;left:34px;cursor:pointer;'></div></div><div style='padding: 4px 2px 2px 0px;'><a href='javascript:void(0)' onclick='aroundSearch(\"" + this.getLonLat().lon + '", "' + this.getLonLat().lat + "\", \"40000\", 1)'>\u65c5\u6e38\u4f4f\u5bbf</a>&nbsp;<a href='javascript:void(0)' onclick='aroundSearch(\"" + this.getLonLat().lon + '", "' + this.getLonLat().lat + "\", \"20000\", 1)'>\u9910\u996e</a>&nbsp<a href='javascript:void(0)' onclick='aroundSearch(\"" + this.getLonLat().lon + '", "' + this.getLonLat().lat + "\", \"100100\", 1)'>\u94f6\u884c</a>&nbsp<a href='javascript:void(0)' onclick='aroundSearch(\"" + this.getLonLat().lon + '", "' + this.getLonLat().lat + "\", \"60100\", 1)'>\u533b\u9662</a>&nbsp<a href='javascript:void(0)' onclick='aroundSearch(\"" + this.getLonLat().lon + '", "' + this.getLonLat().lat + "\", \"80400\", 1)'>\u5730\u94c1</a>&nbsp<input id='aroundSearchInput' type='text' style='width:80px;'>&nbsp<input type='button' class='popup_toolbar_searchBtn' onclick='aroundSearch(\"" + this.getLonLat().lon + '", "' + this.getLonLat().lat + '", document.getElementById("aroundSearchInput").value, 2)\'></div></div></div>';
		this.div.appendChild(this.toolbarContent)
	},
	getContentHeight: function() {
		return null == this.contentHTML ? 0 : OpenLayers.Util.getRenderedDimensions("<div>" + this.contentHTML + "</div>", {
			w: this.contentWidth ? this.contentWidth: WebtAPI.WPopup.WIDTH
		}).h
	},
	setAttribute: function(a, b) {
		this[a] = b
	},
	getAttribute: function(a) {
		return this[a]
	}
});
WebtAPI.WPopup.WIDTH = 350;
WebtAPI.WPopup.HEIGHT = 280;
WebtAPI.WPopup.COLOR = "white";
WebtAPI.WPopup.OPACITY = 1;
WebtAPI.WPopup.BORDER = "0px";
function aroundSearch(a, b, c, d) {
	$$("#hidForAround").val($$("#popNameWrapper").html()).attr({
		lon: a,
		lat: b,
		radius: $$("#radius").val()
	});
	WebtAPI.Around.setOption("centerLon", a);
	WebtAPI.Around.setOption("centerLat", b);
	WebtAPI.Around.setOption("radius", $$("#radius").val());
	WebtAPI.Around.setOption("adcode", DEFAULT_CITY_CODE);
	WebtAPI.Around.setArgs({
		type: "around",
		callback: "WebtAPI.POISearchCallback"
	});
	1 == d ? (WebtAPI.Around.setOption("datatype", c), WebtAPI.Around.executeSearch()) : 2 == d && WebtAPI.Around.executeSearch(c)
}
function _switchPopTab(a, b) {
	document.getElementById("toolbarContent0" + b).style.display = "none";
	document.getElementById("toolbarContent0" + a).style.display = ""
}
function sliderStart(a, b) {
	var c = document.getElementById("slider"),
	a = document.getElementById("sliderBar"),
	b = b ? b: window.event,
	d = c.offsetLeft - a.offsetWidth / 2 + 20,
	f = c.offsetLeft + c.offsetWidth - a.offsetWidth / 2,
	g = b.clientX - a.offsetLeft;
	document.onmousemove = function(a) {
		var b = document.getElementById("sliderBar"),
		a = a ? a: window.event,
		a = a.clientX - g,
		a = a < d ? d: a > f ? f: a,
		c = a - 23 + b.offsetWidth / 2;
		document.getElementById("radius").value = 5E3 * c / 200;
		b.style.left = a + "px"
	};
	document.onmouseup = function() {
		document.onmousemove = null;
		document.onmouseup = null
	}
};
function clickSlider(a) {
	var b = $$("#slider"),
	c = document.getElementById("sliderBar"),
	a = a ? a: window.event,
	d = a.clientX - b.offset().left + 23 - c.offsetWidth / 2;
	d < 42 - c.offsetWidth / 2 && (d = 42 - c.offsetWidth / 2);
	document.getElementById("radius").value = 5E3 * (a.clientX - b.offset().left) / 200;
	c.style.left = d + "px"
}
WebtAPI.WIcon = OpenLayers.Class({
	url: null,
	size: null,
	offset: null,
	calculateOffset: null,
	imageDiv: null,
	px: null,
	initialize: function(a, b, c, d) {
		this.url = a;
		this.size = b ? b: new OpenLayers.Size(20, 20);
		this.offset = c ? c: new OpenLayers.Pixel( - (this.size.w / 2), -(this.size.h / 2));
		this.calculateOffset = d;
		a = OpenLayers.Util.createUniqueID("OL_Icon_");
		this.imageDiv = OpenLayers.Util.createAlphaImageDiv(a)
	},
	destroy: function() {
		this.erase();
		OpenLayers.Event.stopObservingElement(this.imageDiv.firstChild);
		this.imageDiv.innerHTML = "";
		this.imageDiv = null
	},
	clone: function() {
		return new WebtAPI.WIcon(this.url, this.size, this.offset, this.calculateOffset)
	},
	setSize: function(a) {
		null != a && (this.size = a);
		this.draw()
	},
	setUrl: function(a) {
		null != a && (this.url = a);
		this.draw()
	},
	draw: function(a) {
		OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv, null, null, this.size, this.url, "absolute");
		this.moveTo(a);
		return this.imageDiv
	},
	erase: function() {
		null != this.imageDiv && null != this.imageDiv.parentNode && OpenLayers.Element.remove(this.imageDiv)
	},
	setOpacity: function(a) {
		OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv, null, null, null, null, null, null, null, a)
	},
	moveTo: function(a) {
		null != a && (this.px = a);
		null != this.imageDiv && (null == this.px ? this.display(!1) : (this.calculateOffset && (this.offset = this.calculateOffset(this.size)), a = this.px.offset(this.offset), OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv, null, a)))
	},
	display: function(a) {
		this.imageDiv.style.display = a ? "": "none"
	},
	isDrawn: function() {
		return this.imageDiv && this.imageDiv.parentNode && 11 != this.imageDiv.parentNode.nodeType
	},
	CLASS_NAME: "OpenLayers.Icon"
});
WebtAPI.WMarker = OpenLayers.Class(OpenLayers.Marker, {
	markerIndex: null,
	alwaysOnShow: !1,
	title: null,
	dragging: null,
	dragend: null,
	dragEnable: !1,
	initialize: function(a, b, c) {
		this.lonlat = WebtAPI.WUtil._toMerc(a);
		this.initLonLat = a;
		a = b ? b: WebtAPI.WMarker.defaultIcon(c);
		null == this.icon ? this.icon = a: (this.icon.url = a.url, this.icon.size = a.size, this.icon.offset = a.offset, this.icon.calculateOffset = a.calculateOffset);
		this.events = new OpenLayers.Events(this, this.icon.imageDiv, null, null, {
			includeXY: !0
		});
		this.icon.imageDiv.style.cursor = "pointer";
		WebtAPI.markerInst = this
	},
	getLonLat: function() {
		return WebtAPI.WUtil._toWGS84(this.lonlat)
	},
	setUrl: function(a) {
		this.icon.setUrl(a)
	},
	setSize: function(a, b) {
		this.icon.setSize(new OpenLayers.Size(a, b))
	},
	erase: function() { ! this.alwaysOnShow && null != this.icon && this.icon.erase()
	},
	moveToLonlat: function(a) {
		this.lonlat = WebtAPI.WUtil._toMerc(a);
		this.moveTo(this.map.getPixelFromLonLat(this.lonlat))
	},
	setTopView: function() {
		OpenLayers.Element.addClass(this.icon.imageDiv, "ZIdx100")
	},
	removeTopView: function() {
		OpenLayers.Element.removeClass(this.icon.imageDiv, "ZIdx100")
	},
	setAlwaysOnShow: function(a) {
		this.alwaysOnShow = a
	},
	register: function(a, b) {
		this.events.register(a, this, b)
	},
	unregister: function(a, b) {
		this.events.unregister(a, this, b)
	},
	triggerEvent: function(a) {
		this.events.triggerEvent(a)
	},
	setTitle: function(a) {
		a && "" != a && (this.title = a, this.icon.imageDiv.title = a)
	},
	setAttribute: function(a, b) {
		this[a] = b
	},
	getAttribute: function(a) {
		return this[a]
	},
	setDragEnable: function(a, b, c) {
		if (this.dragEnable == a) return ! 1;
		a ? (b && (this.dragging = b), c && (this.dragend = c), this.register("mousedown", this.down)) : (this.events.unregister("mousedown", this, this.down), this.unregister("mousemove", this.move), this.map.unregisterEvents("mousemove", this.mouseMove), this.map.unregisterEvents("mouseup", this.up));
		this.dragEnable = a
	},
	down: function(a) {
		this.register("mousemove", this.move);
		this.register("click",
		function() {
			this.unregister("mousemove", this.move)
		});
		OpenLayers.Event.stop(a)
	},
	move: function() {
		this.map.events.register("mousemove", this, this.mouseMove);
		this.map.events.register("mouseup", this, this.up);
		var a = navigator.appName,
		b = navigator.appVersion.split(";");
		1 < b.length && (b = b[1].replace(/[ ]/g, ""), "Microsoft Internet Explorer" == a && "MSIE8.0" == b && (this.moveTo(this.getLayerPxFromViewPortPx(e.xy)), OpenLayers.Event.stop(e)))
	},
	mouseMove: function(a) {
		this.moveTo(this.map.getLayerPxFromViewPortPx(a.xy));
		this.dragging && this.dragging(a)
	},
	up: function(a) {
		this.moveTo(this.map.getLayerPxFromViewPortPx(a.xy));
		this.unregister("mousemove", this.move);
		this.map.events.unregister("mousemove", this, this.mouseMove);
		this.map.events.unregister("mouseup", this, this.up);
		this.dragend && this.dragend(a)
	}
});
WebtAPI.WMarker.defaultIcon = function(a) {
	var a = a ? a: OpenLayers.Util.getImagesLocation() + "marker.png",
	b = new OpenLayers.Size(27, 33);
	return new OpenLayers.Icon(a, b, null,
	function(a) {
		return new OpenLayers.Pixel( - (a.w / 2), -a.h)
	})
};
WebtAPI.LineFeature = OpenLayers.Class({
	initialize: function(a, b, c) {
		for (var d = [], f = 0; f < a.length; f++) {
			var g = WebtAPI.WUtil._toMerc(a[f]);
			d[d.length] = new OpenLayers.Geometry.Point(g.lon, g.lat)
		}
		return new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString(d), c, b)
	}
});
WebtAPI.PolygonFeature = OpenLayers.Class({
	initialize: function(a, b, c) {
		for (var d = [], f = 0; f < a.length; f++) {
			var g = WebtAPI.WUtil._toMerc(a[f]);
			d[d.length] = new OpenLayers.Geometry.Point(g.lon, g.lat)
		}
		var a = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LinearRing(d), null, b),
		h;
		for (h in c) a[h] = c[h];
		return a
	}
});
WebtAPI.RegularPolygonFeature = OpenLayers.Class({
	initialize: function(a, b, c, d, f) {
		a = WebtAPI.createRegularPolygon(a, b, c, d || 360);
		return new OpenLayers.Feature.Vector(a, null, f)
	}
});
WebtAPI.createRegularPolygon = function(a, b, c, d) {
	for (var f, g = [], h = 0; h < c; ++h) f = 360 * h / c + (d ? d: 0),
	f = WebtAPI.WUtil._toMerc(OpenLayers.Util.destinationVincenty(a, f, b)),
	g.push(new OpenLayers.Geometry.Point(f.lon, f.lat));
	a = new OpenLayers.Geometry.LinearRing(g);
	return new OpenLayers.Geometry.Polygon([a])
};