finna.StreetSearch = (function() {
    var getLocation = function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(reverseGeocode, geoLocationError);
        } else { 
            geoLocationError();
        }
    }
    
    var geoLocationError = function() {
        alert("Geolocation is inactive in your settings or not supported by this browser.");
    }
    
    var reverseGeocode = function(position) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://nominatim.openstreetmap.org/reverse?format=json&lat=" +
                        position.coords.latitude +
                        "&lon=" +
                        position.coords.longitude +
                        "&zoom=18&addressdetails=1",
                false);
        xhr.send();

        obj = JSON.parse(xhr.responseText);
        
        street = obj.address.road;
        city = obj.address.city;
        
        searchterm = encodeURIComponent(street + ' ' + city);
        
        window.location.href = VuFind.path + '/Search/Results?lookfor=' +
                                 searchterm +
                                 '&type=AllFields&limit=100&filter%5B%5D=%7Eformat%3A%220%2FImage%2F%22&filter%5B%5D=online_boolean%3A%221%22&view=grid';

    }

    var my = {
        init: function() {
            window.onload = function() {
                var ssbutton = document.getElementById("street-search-button");

                ssbutton.onclick = function() {
                    getLocation();
                }
            }
        }
    };

    return my;
})(finna);

finna['StreetSearch'].init();