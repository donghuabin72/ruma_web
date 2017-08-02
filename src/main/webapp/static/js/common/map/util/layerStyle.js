/**
 * 获取图层nativeBound
 * 
 * @param tableName
 * @returns
 */
function getLayerNativeBound(tableName) {
	for (var i = 0; i < busLayerStyles.length; i++) {
		if (busLayerStyles[i] != null) {
			if (tableName == busLayerStyles[i].serviceKey) {
				var nativeBound = busLayerStyles[i].nativeBound;
				if (nativeBound != null && nativeBound != "") {
					var points = nativeBound.split(";");
					return new OpenLayers.Bounds(points[0], points[1], points[2], points[3]);
				}
			}
		}
	}
	return null;
}