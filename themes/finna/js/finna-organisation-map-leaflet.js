function getQueryParam(param) {
    location.search.substr(1)
        .split("&")
        .some(function(item) { // returns first occurence and stops
            return item.split("=")[0] == param && (param = item.split("=")[1])
        })
    return param;
}

finna = $.extend(finna, {
    organisationMap: function() {
        var zoomLevel = {initial: 27, far: 5, close: 15};
        var holder = null;
        var imgPath = null;
        var map = null;
        var view = null;
        var mapMarkers = {};
        var markers = [];
        var selectedMarker = null;
        var infoInterval = null;
        var defaultId = null;
        var infoWindow = null;
        var organisations = null;
        var initialZoom = true;


        L.TileLayer.Provider.providers.DigiTransit = {
            url: '//api.digitransit.fi/map/v1/{id}/{z}/{x}/{y}.png',
            options: {
                maxZoom: 19,
                attribution:
                '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }
        };

        var mapConf = {
            OpenStreetMap: {},
            MapBox: {
                id: 'examples.map-zr0njcqy',
                accessToken: 'pk.eyJ1Ijoic2FtdWxpc2lsbGFucGFhIiwiYSI6ImNpcWhucTBxMDAwOG5oeG5od2w1NnljaTQifQ.BhPSzbFYIksrEEZxp2hSBA'
            },
            'DigiTransit': {
                id: 'hsl-map',
                tileSize: 512,
                zoomOffset: -1
            }
        };
        
        var mapProvider = getQueryParam('map'); //'DigiTransit'; //'MapBox'; //OpenStreetMap';
        if (mapProvider == 'map') {
            mapProvider = 'DigiTransit';
        }
        mapConf = mapConf[mapProvider];

        var attribution = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
        var draw = function(organisationList, id) {
            defaultId = id;
            var me = $(this);
            organisations = organisationList;

            map = L.map($(holder).attr('id'), {
                closePopupOnClick: false,
                minZoom: zoomLevel.far,
                maxZoom: zoomLevel.close + 5.0,
                zoomDelta: 0.1,
                zoomSnap: 0.1
            });
            L.tileLayer.provider(mapProvider, mapConf).addTo(map);

            // Center popup
            map.on('popupopen', function(e) {
                var px = map.project(e.popup._latlng); 
                px.y -= e.popup._container.clientHeight/2;
                map.panTo(map.unproject(px),{animate: true});
            });
            
            map.on('popupclose', function(e) {
//                reset();
            });
           
            //addMyLocationButton(map, $(this), holder);

            var LeafIcon = L.Icon.extend({
                options: {
                    iconSize:     [21, 35],
                    iconAnchor:   [10, 35],
                    popupAnchor:  [0, -36],
                    labelAnchor: [-5, -86]
                }
            });

            // Map points
            $.each(organisations, function(ind, obj) {
                var cnt = 0;
                if (obj.address != null && obj.address.coordinates != null) {
                    var markerIcon = new LeafIcon({iconUrl: obj['map']['icon']});

                    var infoWindowContent = obj['map']['info'];
                    var point = obj.address.coordinates;

                    var marker = L.marker(
                        [point.lat, point.lon], 
                        {icon: markerIcon}
                    ).addTo(map);
                    marker.on('mouseover', function(ev) {
                        if (marker == selectedMarker) {
                            return;
                        }
                        var holderOffset = $(holder).offset();
                        var offset = $(ev.originalEvent.target).offset();
                        var x = offset.left - holderOffset.left;
                        var y = offset.top - holderOffset.top;
                        
                        me.trigger(
                            'marker-mouseover', {id: obj.id, x: x, y: y}
                        );
                    });

                    marker.on('mouseout', function(ev) {
                        me.trigger('marker-mouseout');
                    });

                    marker.on('click', function(ev) {
                        me.trigger('marker-click', obj.id);
                        map.setView(ev.latlng, zoomLevel.close, {animate: false});
                    });

                    marker
                        .bindPopup(infoWindowContent)
                        .addTo(map);

                    mapMarkers[obj.id] = marker;
                    markers.push(marker);
                }
            });

            reset();
        };
        
        var reset = function() {
            group = new L.featureGroup(markers);
            var bounds = group.getBounds();
            // Fit markers to screen
            map.fitBounds(bounds, {zoom: {animate: true}});

            selectedMarker = null;
        };

        var resize = function() {
            map.invalidateSize(true);
        };

        var selectMarker = function(id) {
            var marker = null;
            if (id in mapMarkers) {
                marker = mapMarkers[id];
            }
            if (!marker && selectedMarker) {
                hideMarker();
                return;
            }
            marker.openPopup();
            selectedMarker = marker;
        };

        var hideMarker = function() {
            selectedMarker.closePopup();
        };

        var addMyLocationButton = function(map, me, mapHolder) {
            if (navigator.geolocation) {
                var view = map.getView();
                var btn = $(".my-location-btn").removeClass('hide');

                btn.on('click', function() {
                    navigator.geolocation.getCurrentPosition(function(pos) {
                        var coord = latLonToCoord(pos.coords.latitude, pos.coords.longitude);
                        view.setZoom(zoomLevel.close);
                        view.setCenter(coord);
                        
                        $('.my-location-marker').not('.template').remove();
                        var el = $('.my-location-marker.template').clone().removeClass('hide template');
                        map.addOverlay(new ol.Overlay({
                            position: map.getView().getCenter(),
                            element: el
                        }));
                    });
                });
                
                var control = new ol.control.Control({
                    element: btn[0]
                });
                map.addControl(control);
            }
        };

        var init = function(mapHolder, path) {
            holder = mapHolder;
            imgPath = path;
        };
        
        var my = {
            hideMarker: hideMarker,
            reset: reset,
            resize: resize,
            selectMarker: selectMarker,
            init: init,
            draw: draw
        };
        return my;
    }
});
