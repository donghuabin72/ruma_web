WebtAPI.WControl.MeasureArea = OpenLayers.Class(OpenLayers.Control.DrawFeature, OpenLayers.Control.Measure, {
	unitcontrast: {
		length: {
			mi: "\u82f1\u54e9",
			ft: "\u82f1\u5c3a",
			"in": "\u82f1\u5bf8",
			km: "\u516c\u91cc",
			m: "\u7c73"
		},
		area: {
			mi: "\u5e73\u65b9\u82f1\u54e9",
			ft: "\u5e73\u65b9\u82f1\u5c3a",
			"in": "\u5e73\u65b9\u82f1\u5bf8",
			km: "平方公里",
			m: "平方米"
		}
	},
	EVENT_TYPES: ["measure", "measurepartial", "featureadded"],
	initialize: function(a, b, c) {
		OpenLayers.Control.prototype.initialize.apply(this, [c]);
		this.callbacks = OpenLayers.Util.extend({
			done: this.drawFeature,
			modify: function(a, b) {
				this.layer.events.triggerEvent("sketchmodified", {
					vertex: a,
					feature: b
				});
			},
			create: function(a, b) {
				this.layer.events.triggerEvent("sketchstarted", {
					vertex: a,
					feature: b
				});
			}
		},
		this.callbacks);
		this.layer = a;
		this.handlerOptions = this.handlerOptions || {};
		"multi" in this.handlerOptions || (this.handlerOptions.multi = this.multi);
		if (a = this.layer.styleMap && this.layer.styleMap.styles.temporary) this.handlerOptions.layerOptions = OpenLayers.Util.applyDefaults(this.handlerOptions.layerOptions, {
			styleMap: new OpenLayers.StyleMap({
				"default": a
			})
		});
		this.handler = new b(this, this.callbacks, this.handlerOptions);
		this.events.on({
			measure: this.handleMeasurements,
			scope: this
		});
		var d = this;
		OpenLayers.Event.observe(document, "keydown",
		function(a) {
			var b = false;
			switch (a.keyCode) {
			case 27:
				d.cancel();
				b = true;
			}
			b && OpenLayers.Event.stop(a);
		});
	},
	drawFeature: function(a) {
		OpenLayers.Control.DrawFeature.prototype.drawFeature.apply(this, arguments);
		this.measureComplete(a);
		measureLayer.setZIndex(846);
	},
	measurePartial: function(a, b) {
		this.cancelDelay();
		b = b.clone();
		this.handler.freehandMode(this.handler.evt) ? this.measure(b, "measurepartial") : this.delayedTrigger = window.setTimeout(OpenLayers.Function.bind(function() {
			this.delayedTrigger = null;
			this.measure(b, "measurepartial");
		},
		this), this.partialDelay);
	},
	measureComplete: function(a) {
		this.cancelDelay();
		this.measure(a, "measure");
	},
	handleMeasurements: function(a) {
		var b = a.units,
		c = a.order,
		d = a.measure,
		a = "",
		d = "m" == b ? d.toFixed(0) : d.toFixed(1),
		a = 1 == c ? "<div style='background-color:#ffffff;color:#C13A55;padding:0px;'>\u8ddd\u79bb:" + d + " " + this.unitcontrast.length[b] + "</div>": "<div style='background-color:#ffffff;color:#C13A55;padding:0px;'>\u9762\u79ef:" + d + " " + this.unitcontrast.area[b] + "</div>",
		c = this.map.getLonLatFromPixel(this.handler.lastXY),
		c = this.map.getLonLatFromPixel(new OpenLayers.Pixel(this.handler.evt.clientX,this.handler.evt.clientY));
		b = measureLayer.features[measureLayer.features.length - 1],
		d = OpenLayers.Function.bind(this.removeFeature, this, b),
		a = new OpenLayers.Popup("MeasurePopup", c, null, a, !0, d);
		a.autoSize = !0;
		a.setBorder("1px solid #565656");
		this.map.addPopup(a);
		b.popup = a;
		this.deactivate();
		this.map.div.style.cursor = "default";
	},
	removeFeature: function(a) {
		// var b = this.map.dynamicVectorLayer;
		var b = measureLayer;
		a && a.popup && (this.map.removePopup(a.popup), a.popup = null);
		b.removeFeatures([a], {
			silent: !0
		});
	},
	activate: function() {
		OpenLayers.Control.prototype.activate.apply(this, arguments);
		this.map.div.style.cursor = "url('" + cursor + "'),default";
// this.map.layerContainerDiv.style.cursor = CURSOR_RULER
	}
});

WebtAPI.WControl.Measure = OpenLayers.Class(WebtAPI.WControl, {
	unitcontrast: {
		length: {
			mi: "\u82f1\u54e9",
			ft: "\u82f1\u5c3a",
			"in": "\u82f1\u5bf8",
			km: "\u516c\u91cc",
			m: "\u7c73"
		},
		area: {
			mi: "\u5e73\u65b9\u82f1\u54e9",
			ft: "\u5e73\u65b9\u82f1\u5c3a",
			"in": "\u5e73\u65b9\u82f1\u5bf8",
			km: "km<sup>2</sup>",
			m: "m<sup>2</sup>"
		}
	},
	points: [],
	point: null,
	lines: null,
	featureList: [],
	pointList: [],
	lengths: null,
	pixelTolerance: 5,
	lastDown: null,
	lastUp: null,
	mouseDown: !1,
	showPopup: !0,
	showEndPopup: !1,
	styleMap: null,
	multiMeasure: !1,
	tipOffset: new OpenLayers.Pixel(5, 5),
	callback: null,
	initialize: function(a) {
		OpenLayers.Util.extend(this, a);
		this.lines = [];
		this.lengths = [];
	},
	activate: function() {
		this.map.events.registerPriority("mousedown", this, this.down);
		this.map.events.registerPriority("mouseup", this, this.up);
		this.map.events.registerPriority("mousemove", this, this.move);
		this.map.events.registerPriority("dblclick", this, this.dblclick);
		this.map.div.style.cursor = "url('" + cursor + "'),default";
	},
	deactivate: function() {
		this.map.events.unregister("mousedown", this, this.down);
		this.map.events.unregister("mouseup", this, this.up);
		this.map.events.unregister("mousemove", this, this.move);
		this.map.events.unregister("dblclick", this, this.dblclick);
		this.map.div.style.cursor = "default";
	},
	createFeature: function() {
		this.mouseDown = !0;
	},
	down: function(a) {
		this.lastDown || this.createFeature();
		this.lastDown = a.xy;
	},
	move: function(a) {
		null != this.lastDown && this.mouseDown && (a = this.map.getLonLatFromPixel(a.xy), this.point && (!this.point.equals(a) && this.featureList.length != this.getFeatureCnt()) && measureLayer.removeFeatures(this.featureList[this.featureList.length - 1]), a = [this.points[this.points.length - 1], new OpenLayers.Geometry.Point(a.lon, a.lat)], a = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString(a)), this.featureList.push(a), measureLayer.addFeatures(a));
		measureLayer.setZIndex(846);
	},
	up: function(a) {
		if (this.mouseDown) {
			if (this.passesTolerance(this.lastDown, a.xy, this.pixelTolerance)) {
				var b = this.map.getLonLatFromPixel(a.xy);
				this.point = b;
				if (0 < this.featureList.length && !this.lastDown.equals(this.lastUp) && this.lastUp) {
					var c = this.points[this.points.length - 1];
					this.drawFeature(b, new OpenLayers.LonLat(c.x, c.y), this.points.length, this.lines.length);
				}
				this.addPoint(a.xy);
			}
			this.lastUp = a.xy;
			0 == this.points.length && (this.lastDown = null, this.mouseDown = !1, this.lastUp = null);
		}
	},
	drawFeature: function(a, b, c, d) {
		var e = [new OpenLayers.Geometry.Point(b.lon, b.lat), new OpenLayers.Geometry.Point(a.lon, a.lat)],
		e = new OpenLayers.Geometry.LineString(e);
		if(this.map.projection.projCode=="EPSG:900913" || this.map.projection=="EPSG:900913"){
			b = OpenLayers.Util.distVincenty(WebtAPI.WUtil._toWGS84(a), WebtAPI.WUtil._toWGS84(b));
		}else if(this.map.projection.projCode=="EPSG:4326" || this.map.projection=="EPSG:4326"){
			b = OpenLayers.Util.distVincenty(a,b);
		}
		// 坐标系,计算结果异常
		this.callback.point && this.callback.point.apply(this, [b, a, c, d]);
		this.showPopup && this.drawPopup(b, a, c, d);
		a = new OpenLayers.Feature.Vector(e, null, measureLayer.style);
		this.featureList.push(a);
		measureLayer.addFeatures(a);
		measureLayer.setZIndex(846);
	},
	addPoint: function(a) {
		a = this.map.getLonLatFromPixel(a);
		var point = new OpenLayers.Geometry.Point(a.lon, a.lat);
		this.points.push(point);
		var p = new OpenLayers.Feature.Vector(point, null, measureLayer.style);
		this.pointList.push(p);
		measureLayer.addFeatures(p);
		measureLayer.setZIndex(846);
	},
	redrawPoint: function(a) {
		var point = new OpenLayers.Geometry.Point(a.lon, a.lat);
		var p = new OpenLayers.Feature.Vector(point, null, measureLayer.style);
		this.pointList.push(p);
		measureLayer.addFeatures(p);
		measureLayer.setZIndex(846);
	},
	passesTolerance: function(a, b, c) {
		var d = !0;
		null != c && a && b && a.distanceTo(b) > c && (d = !1);
		return d;
	},
	dblclick: function(a) {
		this.finishGeometry();
		this.points.splice(this.points.length - 1, 1);
		this.lines.push(this.points);
		this.points = [];
		this.callback.done && this.callback.done.apply(this);
		this.showEndPopup && (0 < this.map.popups.length && this.lengths[this.lines.length - 1]) && this.drawEndPopup(a.xy, this.lines.length - 1);
		
		this.redrawLine();
		return ! 1;
	},
	finishGeometry: function() {
		this.point = this.lastUp = this.lastDown = null;
		this.mouseDown = !1;
		this.deactivate();
		this.multiMeasure && this.activate();
	},
	redrawLine: function() {
		measureLayer.removeFeatures(this.featureList);
		measureLayer.removeFeatures(this.pointList);
		this.clearPopups();
		this.featureList = [];
		this.pointList = [];
		for (var a = 0; a < this.lines.length; a++) {
			this.lengths[a] = 0;
			for (var b = this.lines[a], c = 0; c < b.length - 1; c++){
				this.redrawPoint(new OpenLayers.LonLat(b[c].x, b[c].y)); 
				this.drawFeature(new OpenLayers.LonLat(b[c + 1].x, b[c + 1].y), new OpenLayers.LonLat(b[c].x, b[c].y), c + 1, a);
				c == b.length - 2 && this.showEndPopup && this.drawEndPopup(this.map.getPixelFromLonLat(new OpenLayers.LonLat(b[c + 1].x, b[c + 1].y)), a);
			}
			
			for (var b = this.lines[a], c = 0; c < b.length; c++){
				if(b.length>1){
					this.redrawPoint(new OpenLayers.LonLat(b[c].x, b[c].y));
				}
			}
		}
		measureLayer.setZIndex(846);
	},
	drawPopup: function(a, b, c, d) {
		var e = this.map.getLonLatFromPixel(this.map.getPixelFromLonLat(b).offset(this.tipOffset)),
		b = 1E3 > (1E3 * a).toFixed(0) ? (1E3 * a).toFixed(0) + this.unitcontrast.length["m"]: a.toFixed(1) + this.unitcontrast.length["km"];
		if("0m" != b && "0米" != b){
			c = new OpenLayers.Popup("measure", e, null, "<div style='background-color:#ffffff;color:#C13A55;padding:0px;font-size:12px;'>" + b + "</div>", !0, OpenLayers.Function.bind(this.removePoint, this, c, d, a));
			c.autoSize = !0;
			c.setBorder("1px solid #565656");
			this.map.addPopup(c);
			b == a.toFixed(1) + "km" ? void 0 === this.lengths[d] ? this.lengths[d] = parseFloat(a.toFixed(1)) : this.lengths[d] += parseFloat(a.toFixed(1)) : void 0 === this.lengths[d] ? this.lengths[d] = parseFloat(a.toFixed(3)) : this.lengths[d] += parseFloat(a.toFixed(3));
		} 
	},
	drawEndPopup: function(a, b) {
		d = this.lengths[b],
		d = 1E3 > (1E3 * d).toFixed(0) ? (1E3 * d).toFixed(0) + this.unitcontrast.length["m"]: d.toFixed(1) + this.unitcontrast.length["km"];
		
		var c =this.map.getLonLatFromPixel(a.offset(this.tipOffset));
		if ("0m" != d && "0米" != d) {
			if(this.map.popups[this.map.popups.length - 1]){
				c = this.map.getLonLatFromPixel(a.add(this.map.popups[this.map.popups.length - 1].size.w + 6, 5));
			}
		}	
		var e = new OpenLayers.Popup("measure", c, null, "<div style='background-color:#ffffff;color:#C13A55;padding:0px;font-size:12px;'>\u603b\u957f\uff1a" + d + "</div>", !0, OpenLayers.Function.bind(this.removeLine, this, b));
		e.autoSize = !0;
		e.setBorder("1px solid #565656");
		this.map.addPopup(e);
	},
	removePoint: function(a, b) {
		this.mouseDown || (this.lines[b].splice(a, 1), this.redrawLine(), this.callback.removepoint && this.callback.removepoint.apply(this, [b]), window.event && OpenLayers.Event.stop(window.event));
	},
	removeLine: function(a) {
		this.lines[a] = [];
		this.redrawLine();
		this.callback.removeAllPoint && this.callback.removeAllPoint.apply(this, [a]);
		window.event && OpenLayers.Event.stop(window.event);
	},
	removeAllDraw: function() {
		for (var a = 0; a < this.lines.length; a++) this.removeLine(a);
	},
	getFeatureCnt: function() {
		for (var a = 0,
		b = 0; b < this.lines.length; b++) for (var c = this.lines[b], d = 0; d < c.length - 1; d++) a += 1;
		return a;
	},
	clearPopups: function() {
		for (var a = this.map.popups.length - 1; 0 <= a; --a) {
			var pop = this.map.popups[a];
			if(pop.id =="measure"){
				this.map.removePopup(pop);
			}
		}
	},setMouseCursor: function(a) {
		"" != a ? (this.eventsDiv.style.cursor = "url('" + a + "'),default", this.div.style.cursor = "url('" + a + "'),default", this.layerContainerDiv.style.cursor = "url('" + a + "'),default") : (this.eventsDiv.style.cursor = "", this.div.style.cursor = "url('" + CURSOR_OPEN + "'),default", this.layerContainerDiv.style.cursor = "url('" + CURSOR_OPEN + "'),default");
	},
	clearAllFeatures:function(){
		// 清除所有测算内容
		measureLayer.removeAllFeatures();
		for (var a = this.map.popups.length - 1; 0 <= a; --a) {
			var pop = this.map.popups[a];
			if(pop.id =="MeasurePopup"){
				this.map.removePopup(pop);
			}
		}
		this.removeAllDraw();
	}
});