Ext.require([
    'Ext.container.Viewport',
    'Ext.layout.container.Border',
    'GeoExt.tree.Panel',
    'Ext.tree.plugin.TreeViewDragDrop',
    'GeoExt.panel.Map',
    'GeoExt.tree.OverlayLayerContainer',
    'GeoExt.tree.BaseLayerContainer',
    'GeoExt.data.LayerTreeModel',
    'GeoExt.tree.View',
    'GeoExt.tree.Column'
]);

var mapPanel, tree;

Ext.application({
    name: 'Tree',
    launch: function() {
        // create a map panel with some layers that we will show in our layer tree
        // below.
        mapPanel = Ext.create('GeoExt.panel.Map', {
            border: true,
            region: "center",
            // we do not want all overlays, to try the OverlayLayerContainer
            map: {allOverlays: false},
            center: new OpenLayers.LonLat(24, 39).transform(
            'EPSG:4326', 'EPSG:900913'),
            zoom: 7,
            layers: [
                                
                /* Base Layers */
                new OpenLayers.Layer.OSM("OpenStreetMap" ),
                
                new OpenLayers.Layer.Google("Google Satellite",
                    {type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 22
                        }
                ),
                new OpenLayers.Layer.Google("Google Hybrid",
                    {type: google.maps.MapTypeId.HYBRID, 
                     numZoomLevels: 22, 
                     visibility: false}
                ),

                /* Data */
                new OpenLayers.Layer.WMS("Οικισμοί 2000 κάτοικοι",
                    "http://localhost:8080/geoserver/surveying/wms", {
                        layers: "oikismoi",
                        transparent: true,
                        format: "image/png"
                    }, {
                        isBaseLayer: false,
                        visibility: false,
                        projection:new OpenLayers.Projection("EPSG:900913"),
                        buffer: 0
                    }
                ),

              new OpenLayers.Layer.WMS("Τριγωνομετρικά Κρήτης",
                    "http://localhost:8080/geoserver/surveying/wms", {
                        layers: "trigonometrika_kritis",
                        transparent: true,
                        format: "image/png"
                    }, {
                        isBaseLayer: false,
                        visibility: false,
                        projection:new OpenLayers.Projection("EPSG:900913"),
                        buffer: 0
                    }
                ),
              
             new OpenLayers.Layer.WMS("Περιοχές Natura",
                    "http://localhost:8080/geoserver/surveying/wms", {
                        layers: "natura",
                        transparent: true,
                        format: "image/png"
                    }, {
                        isBaseLayer: false,
                        visibility: false,
                        projection:new OpenLayers.Projection("EPSG:900913"),
                        buffer: 0
                    }
                ),
             
             new OpenLayers.Layer.WMS("Όρια Δήμων Καλλικράτης",
                    "http://localhost:8080/geoserver/surveying/wms", {
                        layers: "oria_dhmwn_kallikraths",
                        transparent: true,
                        format: "image/png"
                    }, {
                        isBaseLayer: false,
                        visibility: false,
                        projection:new OpenLayers.Projection("EPSG:900913"),
                        buffer: 0
                    }
                ),

             new OpenLayers.Layer.WMS("Νομοί (ΟΚΧΕ)",
                    "http://localhost:8080/geoserver/surveying/wms", {
                        layers: "nomoi_okxe",
                        transparent: true,
                        format: "image/png"
                    }, {
                        isBaseLayer: false,
                        visibility: false,
                        projection:new OpenLayers.Projection("EPSG:900913"),
                        buffer: 0
                    }
                ),


            ]
        });

        // create our own layer node UI class, using the TreeNodeUIEventMixin
        //var LayerNodeUI = Ext.extend(GeoExt.tree.LayerNodeUI, new GeoExt.tree.TreeNodeUIEventMixin());

        /*var treeConfig = [
            {nodeType: 'gx_layercontainer', layerStore: map.layers}
        {
            nodeType: "gx_baselayercontainer"
        }, {
            nodeType: "gx_overlaylayercontainer",
            expanded: true,
            // render the nodes inside this container with a radio button,
            // and assign them the group "foo".
            loader: {
                baseAttrs: {
                    radioGroup: "foo",
                    uiProvider: "layernodeui"
                }
            }
        }, {
            nodeType: "gx_layer",
            layer: "Tasmania (Group Layer)",
            isLeaf: false,
            // create subnodes for the layers in the LAYERS param. If we assign
            // a loader to a LayerNode and do not provide a loader class, a
            // LayerParamLoader will be assumed.
            loader: {
                param: "LAYERS"
            }
        }];*/

        var store = Ext.create('Ext.data.TreeStore', {
            model: 'GeoExt.data.LayerTreeModel',
            root: {
                expanded: true,
                children: [
                     {
                        plugins: ['gx_baselayercontainer'],
                        expanded: true,
                        text: "Base Maps"
                    }, {
                        plugins: ['gx_overlaylayercontainer'],
                        expanded: true
                    }
                ]
            }
        });

        var layer;

        // create the tree with the configuration from above
        tree = Ext.create('GeoExt.tree.Panel', {
            border: true,
            region: "west",
            title: "Layers",
            width: 250,
            split: true,
            collapsible: true,
            collapseMode: "mini",
            autoScroll: true,
            store: store,
            rootVisible: false,
            lines: true
        });

        Ext.create('Ext.Viewport', {
            layout: "fit",
            hideBorders: true,
            items: {
                layout: "border",
                deferredRender: false,
                items: [mapPanel, tree, {
                    contentEl: "desc",
                    region: "east",
                    bodyStyle: {"padding": "5px"},
                    collapsible: true,
                    collapseMode: "mini",
                    split: true,
                    width: 200,
                    title: "Description"
                }]
            }
        });
    }
});
