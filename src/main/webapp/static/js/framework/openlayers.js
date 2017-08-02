/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/* 
 * @requires OpenLayers/BaseTypes.js
 * @requires OpenLayers/Lang/en.js
 * @requires OpenLayers/Console.js
 */
 
/*
 * TODO: In 3.0, we will stop supporting build profiles that include
 * OpenLayers.js. This means we will not need the singleFile and scriptFile
 * variables, because we don't have to handle the singleFile case any more.
 */

(function() {
    /**
     * Before creating the OpenLayers namespace, check to see if
     * OpenLayers.singleFile is true.  This occurs if the
     * OpenLayers/SingleFile.js script is included before this one - as is the
     * case with old single file build profiles that included both
     * OpenLayers.js and OpenLayers/SingleFile.js.
     */
    var singleFile = (typeof OpenLayers == "object" && OpenLayers.singleFile);
    
    /**
     * Relative path of this script.
     */
    var scriptName = (!singleFile) ? "common/OpenLayers.js" : "../../../js/framework/OpenLayers.js";

    /*
     * If window.OpenLayers isn't set when this script (OpenLayers.js) is
     * evaluated (and if singleFile is false) then this script will load
     * *all* OpenLayers scripts. If window.OpenLayers is set to an array
     * then this script will attempt to load scripts for each string of
     * the array, using the string as the src of the script.
     *
     * Example:
     * (code)
     *     <script type="text/javascript">
     *         window.OpenLayers = [
     *             "../../../js/framework/OpenLayers/Util.js",
     *             "../../../js/framework/OpenLayers/BaseTypes.js"
     *         ];
     *     </script>
     *     <script type="text/javascript" src="../lib/OpenLayers.js"></script>
     * (end)
     * In this example OpenLayers.js will load Util.js and BaseTypes.js only.
     */
    var jsFiles = window.OpenLayers;

    /**
     * Namespace: OpenLayers
     * The OpenLayers object provides a namespace for all things OpenLayers
     */
    window.OpenLayers = {
        /**
         * Method: _getScriptLocation
         * Return the path to this script. This is also implemented in
         * OpenLayers/SingleFile.js
         *
         * Returns:
         * {String} Path to this script
         */
        _getScriptLocation: (function() {
            var r = new RegExp("(^|(.*?\\/))(" + scriptName + ")(\\?|$)"),
                s = document.getElementsByTagName('script'),
                src, m, l = "";
            for(var i=0, len=s.length; i<len; i++) {
                src = s[i].getAttribute('src');
                if(src) {
                    m = src.match(r);
                    if(m) {
                        l = m[1];
                        break;
                    }
                }
            }
            return (function() { return l; });
        })(),
        
        /**
         * APIProperty: ImgPath
         * {String} Set this to the path where control images are stored, a path  
         * given here must end with a slash. If set to '' (which is the default) 
         * OpenLayers will use its script location + "img/".
         * 
         * You will need to set this property when you have a singlefile build of 
         * OpenLayers that either is not named "../../../js/framework/OpenLayers.js" or if you move
         * the file in a way such that the image directory cannot be derived from 
         * the script location.
         * 
         * If your custom OpenLayers build is named "my-custom-ol.js" and the images
         * of OpenLayers are in a folder "/resources/external/images/ol" a correct
         * way of including OpenLayers in your HTML would be:
         * 
         * (code)
         *   <script src="/path/to/my-custom-ol.js" type="text/javascript"></script>
         *   <script type="text/javascript">
         *      // tell OpenLayers where the control images are
         *      // remember the trailing slash
         *      OpenLayers.ImgPath = "/resources/external/images/ol/";
         *   </script>
         * (end code)
         * 
         * Please remember that when your OpenLayers script is not named 
         * "../../../js/framework/OpenLayers.js" you will have to make sure that the default theme is 
         * loaded into the page by including an appropriate <link>-tag, 
         * e.g.:
         * 
         * (code)
         *   <link rel="stylesheet" href="/path/to/default/style.css"  type="text/css">
         * (end code)
         */
        ImgPath : ''
    };

    /**
     * OpenLayers.singleFile is a flag indicating this file is being included
     * in a Single File Library build of the OpenLayers Library.
     * 
     * When we are *not* part of a SFL build we dynamically include the
     * OpenLayers library code.
     * 
     * When we *are* part of a SFL build we do not dynamically include the 
     * OpenLayers library code as it will be appended at the end of this file.
     */
    if(!singleFile) {
        if (!jsFiles) {
            jsFiles = [
                "../../../js/framework/OpenLayers/BaseTypes/Class.js",
                "../../../js/framework/OpenLayers/Util.js",
                "../../../js/framework/OpenLayers/Util/vendorPrefix.js",
                "../../../js/framework/OpenLayers/Animation.js",
                "../../../js/framework/OpenLayers/BaseTypes.js",
                "../../../js/framework/OpenLayers/BaseTypes/Bounds.js",
                "../../../js/framework/OpenLayers/BaseTypes/Date.js",
                "../../../js/framework/OpenLayers/BaseTypes/Element.js",
                "../../../js/framework/OpenLayers/BaseTypes/LonLat.js",
                "../../../js/framework/OpenLayers/BaseTypes/Pixel.js",
                "../../../js/framework/OpenLayers/BaseTypes/Size.js",
                "../../../js/framework/OpenLayers/Console.js",
                "../../../js/framework/OpenLayers/Tween.js",
                "../../../js/framework/OpenLayers/Kinetic.js",
                "../../../js/framework/OpenLayers/Events.js",
                "../../../js/framework/OpenLayers/Events/buttonclick.js",
                "../../../js/framework/OpenLayers/Events/featureclick.js",
                "../../../js/framework/OpenLayers/Request.js",
                "../../../js/framework/OpenLayers/Request/XMLHttpRequest.js",
                "../../../js/framework/OpenLayers/Projection.js",
                "../../../js/framework/OpenLayers/Proj4js.js",
                "../../../js/framework/OpenLayers/Map.js",
                "../../../js/framework/OpenLayers/Layer.js",
                "../../../js/framework/OpenLayers/Icon.js",
                "../../../js/framework/OpenLayers/Marker.js",
                "../../../js/framework/OpenLayers/Marker/Box.js",
                "../../../js/framework/OpenLayers/Popup.js",
                "../../../js/framework/OpenLayers/Tile.js",
                "../../../js/framework/OpenLayers/Tile/Image.js",
                "../../../js/framework/OpenLayers/Tile/Image/IFrame.js",
                "../../../js/framework/OpenLayers/Tile/UTFGrid.js",
                "../../../js/framework/OpenLayers/Layer/Image.js",
                "../../../js/framework/OpenLayers/Layer/SphericalMercator.js",
                "../../../js/framework/OpenLayers/Layer/EventPane.js",
                "../../../js/framework/OpenLayers/Layer/FixedZoomLevels.js",
                "../../../js/framework/OpenLayers/Layer/Google.js",
                "../../../js/framework/OpenLayers/Layer/Google/v3.js",
                "../../../js/framework/OpenLayers/Layer/HTTPRequest.js",
                "../../../js/framework/OpenLayers/Layer/Grid.js",
                "../../../js/framework/OpenLayers/Layer/MapGuide.js",
                "../../../js/framework/OpenLayers/Layer/MapServer.js",
                "../../../js/framework/OpenLayers/Layer/KaMap.js",
                "../../../js/framework/OpenLayers/Layer/KaMapCache.js",
                "../../../js/framework/OpenLayers/Layer/Markers.js",
                "../../../js/framework/OpenLayers/Layer/Text.js",
                "../../../js/framework/OpenLayers/Layer/WorldWind.js",
                "../../../js/framework/OpenLayers/Layer/ArcGIS93Rest.js",
                "../../../js/framework/OpenLayers/Layer/WMS.js",
                "../../../js/framework/OpenLayers/Layer/WMTS.js",
                "../../../js/framework/OpenLayers/Layer/ArcIMS.js",
                "../../../js/framework/OpenLayers/Layer/GeoRSS.js",
                "../../../js/framework/OpenLayers/Layer/Boxes.js",
                "../../../js/framework/OpenLayers/Layer/XYZ.js",
                "../../../js/framework/OpenLayers/Layer/UTFGrid.js",
                "../../../js/framework/OpenLayers/Layer/OSM.js",
                "../../../js/framework/OpenLayers/Layer/Bing.js",
                "../../../js/framework/OpenLayers/Layer/TMS.js",
                "../../../js/framework/OpenLayers/Layer/TileCache.js",
                "../../../js/framework/OpenLayers/Layer/Zoomify.js",
                "../../../js/framework/OpenLayers/Layer/ArcGISCache.js",
                "../../../js/framework/OpenLayers/Popup/Anchored.js",
                "../../../js/framework/OpenLayers/Popup/Framed.js",
                "../../../js/framework/OpenLayers/Popup/FramedCloud.js",
                "../../../js/framework/OpenLayers/Popup/CSSFramedCloud.js",
                "../../../js/framework/OpenLayers/Feature.js",
                "../../../js/framework/OpenLayers/Feature/Vector.js",
                "../../../js/framework/OpenLayers/Handler.js",
                "../../../js/framework/OpenLayers/Handler/Click.js",
                "../../../js/framework/OpenLayers/Handler/Hover.js",
                "../../../js/framework/OpenLayers/Handler/Point.js",
                "../../../js/framework/OpenLayers/Handler/Path.js",
                "../../../js/framework/OpenLayers/Handler/Polygon.js",
                "../../../js/framework/OpenLayers/Handler/Feature.js",
                "../../../js/framework/OpenLayers/Handler/Drag.js",
                "../../../js/framework/OpenLayers/Handler/Pinch.js",
                "../../../js/framework/OpenLayers/Handler/RegularPolygon.js",
                "../../../js/framework/OpenLayers/Handler/Box.js",
                "../../../js/framework/OpenLayers/Handler/MouseWheel.js",
                "../../../js/framework/OpenLayers/Handler/Keyboard.js",
                "../../../js/framework/OpenLayers/Control.js",
                "../../../js/framework/OpenLayers/Control/Attribution.js",
                "../../../js/framework/OpenLayers/Control/Button.js",
                "../../../js/framework/OpenLayers/Control/CacheRead.js",
                "../../../js/framework/OpenLayers/Control/CacheWrite.js",
                "../../../js/framework/OpenLayers/Control/ZoomBox.js",
                "../../../js/framework/OpenLayers/Control/ZoomToMaxExtent.js",
                "../../../js/framework/OpenLayers/Control/DragPan.js",
                "../../../js/framework/OpenLayers/Control/Navigation.js",
                "../../../js/framework/OpenLayers/Control/PinchZoom.js",
                "../../../js/framework/OpenLayers/Control/TouchNavigation.js",
                "../../../js/framework/OpenLayers/Control/MousePosition.js",
                "../../../js/framework/OpenLayers/Control/OverviewMap.js",
                /*"../../../js/framework/OpenLayers/Control/NewControl/LTOverviewMap.js",*/
                "../../../js/framework/OpenLayers/Control/KeyboardDefaults.js",
                "../../../js/framework/OpenLayers/Control/PanZoom.js",
                "../../../js/framework/OpenLayers/Control/PanZoomBar.js",
                "../../../js/framework/OpenLayers/Control/ArgParser.js",
                "../../../js/framework/OpenLayers/Control/Permalink.js",
                "../../../js/framework/OpenLayers/Control/Scale.js",
                "../../../js/framework/OpenLayers/Control/ScaleLine.js",
                "../../../js/framework/OpenLayers/Control/Snapping.js",
                "../../../js/framework/OpenLayers/Control/Split.js",
                "../../../js/framework/OpenLayers/Control/LayerSwitcher.js",
                "../../../js/framework/OpenLayers/Control/DrawFeature.js",
                "../../../js/framework/OpenLayers/Control/DragFeature.js",
                "../../../js/framework/OpenLayers/Control/ModifyFeature.js",
                "../../../js/framework/OpenLayers/Control/Panel.js",
                "../../../js/framework/OpenLayers/Control/SelectFeature.js",
                "../../../js/framework/OpenLayers/Control/NewControl/NewSelectFeature.js",
                "../../../js/framework/OpenLayers/Control/NavigationHistory.js",
                "../../../js/framework/OpenLayers/Control/Measure.js",
                "../../../js/framework/OpenLayers/Control/NewControl/NewMeasure.js",
                "../../../js/framework/OpenLayers/Control/WMSGetFeatureInfo.js",
                "../../../js/framework/OpenLayers/Control/WMTSGetFeatureInfo.js",
                "../../../js/framework/OpenLayers/Control/Graticule.js",
                "../../../js/framework/OpenLayers/Control/TransformFeature.js",
                "../../../js/framework/OpenLayers/Control/UTFGrid.js",
                "../../../js/framework/OpenLayers/Control/SLDSelect.js",
                "../../../js/framework/OpenLayers/Control/Zoom.js",
                "../../../js/framework/OpenLayers/Geometry.js",
                "../../../js/framework/OpenLayers/Geometry/Collection.js",
                "../../../js/framework/OpenLayers/Geometry/Point.js",
                "../../../js/framework/OpenLayers/Geometry/MultiPoint.js",
                "../../../js/framework/OpenLayers/Geometry/Curve.js",
                "../../../js/framework/OpenLayers/Geometry/LineString.js",
                "../../../js/framework/OpenLayers/Geometry/LinearRing.js",
                "../../../js/framework/OpenLayers/Geometry/Polygon.js",
                "../../../js/framework/OpenLayers/Geometry/MultiLineString.js",
                "../../../js/framework/OpenLayers/Geometry/MultiPolygon.js",
                "../../../js/framework/OpenLayers/Renderer.js",
                "../../../js/framework/OpenLayers/Renderer/Elements.js",
                "../../../js/framework/OpenLayers/Renderer/SVG.js",
                "../../../js/framework/OpenLayers/Renderer/Canvas.js",
                "../../../js/framework/OpenLayers/Renderer/VML.js",
                "../../../js/framework/OpenLayers/Layer/Vector.js",
                "../../../js/framework/OpenLayers/Layer/PointGrid.js",
                "../../../js/framework/OpenLayers/Layer/Vector/RootContainer.js",
                "../../../js/framework/OpenLayers/Strategy.js",
                "../../../js/framework/OpenLayers/Strategy/Filter.js",
                "../../../js/framework/OpenLayers/Strategy/Fixed.js",
                "../../../js/framework/OpenLayers/Strategy/Cluster.js",
                "../../../js/framework/OpenLayers/Strategy/Paging.js",
                "../../../js/framework/OpenLayers/Strategy/BBOX.js",
                "../../../js/framework/OpenLayers/Strategy/Save.js",
                "../../../js/framework/OpenLayers/Strategy/Refresh.js",
                "../../../js/framework/OpenLayers/Filter.js",
                "../../../js/framework/OpenLayers/Filter/FeatureId.js",
                "../../../js/framework/OpenLayers/Filter/Logical.js",
                "../../../js/framework/OpenLayers/Filter/Comparison.js",
                "../../../js/framework/OpenLayers/Filter/Spatial.js",
                "../../../js/framework/OpenLayers/Filter/Function.js",                
                "../../../js/framework/OpenLayers/Protocol.js",
                "../../../js/framework/OpenLayers/Protocol/HTTP.js",
                "../../../js/framework/OpenLayers/Protocol/WFS.js",
                "../../../js/framework/OpenLayers/Protocol/WFS/v1.js",
                "../../../js/framework/OpenLayers/Protocol/WFS/v1_0_0.js",
                "../../../js/framework/OpenLayers/Protocol/WFS/v1_1_0.js",
                "../../../js/framework/OpenLayers/Protocol/CSW.js", 
                "../../../js/framework/OpenLayers/Protocol/CSW/v2_0_2.js",
                "../../../js/framework/OpenLayers/Protocol/Script.js",
                "../../../js/framework/OpenLayers/Protocol/SOS.js",
                "../../../js/framework/OpenLayers/Protocol/SOS/v1_0_0.js",
                "../../../js/framework/OpenLayers/Layer/PointTrack.js",
                "../../../js/framework/OpenLayers/Style.js",
                "../../../js/framework/OpenLayers/Style2.js",
                "../../../js/framework/OpenLayers/StyleMap.js",
                "../../../js/framework/OpenLayers/Rule.js",
                "../../../js/framework/OpenLayers/Format.js",
                "../../../js/framework/OpenLayers/Format/QueryStringFilter.js",
                "../../../js/framework/OpenLayers/Format/XML.js",
                "../../../js/framework/OpenLayers/Format/XML/VersionedOGC.js",
                "../../../js/framework/OpenLayers/Format/Context.js",
                "../../../js/framework/OpenLayers/Format/ArcXML.js",
                "../../../js/framework/OpenLayers/Format/ArcXML/Features.js",
                "../../../js/framework/OpenLayers/Format/GML.js",
                "../../../js/framework/OpenLayers/Format/GML/Base.js",
                "../../../js/framework/OpenLayers/Format/GML/v2.js",
                "../../../js/framework/OpenLayers/Format/GML/v3.js",
                "../../../js/framework/OpenLayers/Format/Atom.js",
                "../../../js/framework/OpenLayers/Format/EncodedPolyline.js",
                "../../../js/framework/OpenLayers/Format/KML.js",
                "../../../js/framework/OpenLayers/Format/GeoRSS.js",
                "../../../js/framework/OpenLayers/Format/WFS.js",
                "../../../js/framework/OpenLayers/Format/OWSCommon.js",
                "../../../js/framework/OpenLayers/Format/OWSCommon/v1.js",
                "../../../js/framework/OpenLayers/Format/OWSCommon/v1_0_0.js",
                "../../../js/framework/OpenLayers/Format/OWSCommon/v1_1_0.js",
                "../../../js/framework/OpenLayers/Format/WCSCapabilities.js",
                "../../../js/framework/OpenLayers/Format/WCSCapabilities/v1.js",
                "../../../js/framework/OpenLayers/Format/WCSCapabilities/v1_0_0.js",
                "../../../js/framework/OpenLayers/Format/WCSCapabilities/v1_1_0.js",
                "../../../js/framework/OpenLayers/Format/WFSCapabilities.js",
                "../../../js/framework/OpenLayers/Format/WFSCapabilities/v1.js",
                "../../../js/framework/OpenLayers/Format/WFSCapabilities/v1_0_0.js",
                "../../../js/framework/OpenLayers/Format/WFSCapabilities/v1_1_0.js",
                "../../../js/framework/OpenLayers/Format/WFSDescribeFeatureType.js",
                "../../../js/framework/OpenLayers/Format/WMSDescribeLayer.js",
                "../../../js/framework/OpenLayers/Format/WMSDescribeLayer/v1_1.js",
                "../../../js/framework/OpenLayers/Format/WKT.js",
                "../../../js/framework/OpenLayers/Format/CQL.js",
                "../../../js/framework/OpenLayers/Format/OSM.js",
                "../../../js/framework/OpenLayers/Format/GPX.js",
                "../../../js/framework/OpenLayers/Format/Filter.js",
                "../../../js/framework/OpenLayers/Format/Filter/v1.js",
                "../../../js/framework/OpenLayers/Format/Filter/v1_0_0.js",
                "../../../js/framework/OpenLayers/Format/Filter/v1_1_0.js",
                "../../../js/framework/OpenLayers/Format/SLD.js",
                "../../../js/framework/OpenLayers/Format/SLD/v1.js",
                "../../../js/framework/OpenLayers/Format/SLD/v1_0_0.js",
                "../../../js/framework/OpenLayers/Format/SLD/v1_0_0_GeoServer.js",
                "../../../js/framework/OpenLayers/Format/OWSCommon.js",
                "../../../js/framework/OpenLayers/Format/OWSCommon/v1.js",
                "../../../js/framework/OpenLayers/Format/OWSCommon/v1_0_0.js",
                "../../../js/framework/OpenLayers/Format/OWSCommon/v1_1_0.js",
                "../../../js/framework/OpenLayers/Format/CSWGetDomain.js",
                "../../../js/framework/OpenLayers/Format/CSWGetDomain/v2_0_2.js",
                "../../../js/framework/OpenLayers/Format/CSWGetRecords.js",
                "../../../js/framework/OpenLayers/Format/CSWGetRecords/v2_0_2.js",
                "../../../js/framework/OpenLayers/Format/WFST.js",
                "../../../js/framework/OpenLayers/Format/WFST/v1.js",
                "../../../js/framework/OpenLayers/Format/WFST/v1_0_0.js",
                "../../../js/framework/OpenLayers/Format/WFST/v1_1_0.js",
                "../../../js/framework/OpenLayers/Format/Text.js",
                "../../../js/framework/OpenLayers/Format/JSON.js",
                "../../../js/framework/OpenLayers/Format/GeoJSON.js",
                "../../../js/framework/OpenLayers/Format/WMC.js",
                "../../../js/framework/OpenLayers/Format/WMC/v1.js",
                "../../../js/framework/OpenLayers/Format/WMC/v1_0_0.js",
                "../../../js/framework/OpenLayers/Format/WMC/v1_1_0.js",
                "../../../js/framework/OpenLayers/Format/WCSGetCoverage.js",
                "../../../js/framework/OpenLayers/Format/WMSCapabilities.js",
                "../../../js/framework/OpenLayers/Format/WMSCapabilities/v1.js",
                "../../../js/framework/OpenLayers/Format/WMSCapabilities/v1_1.js",
                "../../../js/framework/OpenLayers/Format/WMSCapabilities/v1_1_0.js",
                "../../../js/framework/OpenLayers/Format/WMSCapabilities/v1_1_1.js",
                "../../../js/framework/OpenLayers/Format/WMSCapabilities/v1_3.js",
                "../../../js/framework/OpenLayers/Format/WMSCapabilities/v1_3_0.js",
                "../../../js/framework/OpenLayers/Format/WMSCapabilities/v1_1_1_WMSC.js",
                "../../../js/framework/OpenLayers/Format/WMSGetFeatureInfo.js",
                "../../../js/framework/OpenLayers/Format/SOSCapabilities.js",
                "../../../js/framework/OpenLayers/Format/SOSCapabilities/v1_0_0.js",
                "../../../js/framework/OpenLayers/Format/SOSGetFeatureOfInterest.js",
                "../../../js/framework/OpenLayers/Format/SOSGetObservation.js",
                "../../../js/framework/OpenLayers/Format/OWSContext.js",
                "../../../js/framework/OpenLayers/Format/OWSContext/v0_3_1.js",
                "../../../js/framework/OpenLayers/Format/WMTSCapabilities.js",
                "../../../js/framework/OpenLayers/Format/WMTSCapabilities/v1_0_0.js",
                "../../../js/framework/OpenLayers/Format/WPSCapabilities.js",
                "../../../js/framework/OpenLayers/Format/WPSCapabilities/v1_0_0.js",
                "../../../js/framework/OpenLayers/Format/WPSDescribeProcess.js",
                "../../../js/framework/OpenLayers/Format/WPSExecute.js",
                "../../../js/framework/OpenLayers/Format/XLS.js",
                "../../../js/framework/OpenLayers/Format/XLS/v1.js",
                "../../../js/framework/OpenLayers/Format/XLS/v1_1_0.js",
                "../../../js/framework/OpenLayers/Format/OGCExceptionReport.js",
                "../../../js/framework/OpenLayers/Control/GetFeature.js",
                "../../../js/framework/OpenLayers/Control/NavToolbar.js",
                "../../../js/framework/OpenLayers/Control/PanPanel.js",
                "../../../js/framework/OpenLayers/Control/Pan.js",
                "../../../js/framework/OpenLayers/Control/ZoomIn.js",
                "../../../js/framework/OpenLayers/Control/ZoomOut.js",
                "../../../js/framework/OpenLayers/Control/ZoomPanel.js",
                "../../../js/framework/OpenLayers/Control/EditingToolbar.js",
                "../../../js/framework/OpenLayers/Control/Geolocate.js",
                "../../../js/framework/OpenLayers/Symbolizer.js",
                "../../../js/framework/OpenLayers/Symbolizer/Point.js",
                "../../../js/framework/OpenLayers/Symbolizer/Line.js",
                "../../../js/framework/OpenLayers/Symbolizer/Polygon.js",
                "../../../js/framework/OpenLayers/Symbolizer/Text.js",
                "../../../js/framework/OpenLayers/Symbolizer/Raster.js",
                "../../../js/framework/OpenLayers/Lang.js",
                "../../../js/framework/OpenLayers/Lang/zh-CN.js",
                "../../../js/framework/OpenLayers/Spherical.js",
                "../../../js/framework/OpenLayers/TileManager.js",
                "../../../js/framework/OpenLayers/WPSClient.js",
                "../../../js/framework/OpenLayers/WPSProcess.js"
            ]; // etc.
        }

        // use "parser-inserted scripts" for guaranteed execution order
        // http://hsivonen.iki.fi/script-execution/
        var scriptTags = new Array(jsFiles.length);
        var host = OpenLayers._getScriptLocation() + "common/";
        for (var i=0, len=jsFiles.length; i<len; i++) {
            scriptTags[i] = "<script src='" + host + jsFiles[i] +
                                   "'></script>"; 
        }
        if (scriptTags.length > 0) {
            document.write(scriptTags.join(""));
        }
    }
})();

/**
 * Constant: VERSION_NUMBER
 *
 * This constant identifies the version of OpenLayers.
 *
 * When asking questions or reporting issues, make sure to include the output of
 *     OpenLayers.VERSION_NUMBER in the question or issue-description.
 */
OpenLayers.VERSION_NUMBER="Release 2.13.1";
