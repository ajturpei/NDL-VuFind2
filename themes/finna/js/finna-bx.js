finna.bx = (function() {

    var initBxRecommendations = function() {
        var url = path + '/AJAX/JSON?method=getbXRecommendations';
        var id = $('.hiddenSource')[0].value + '|' + $('.hiddenId')[0].value;
        var jqxhr = $.getJSON(url, {id: id}, function(response) {
            if (response.status == 'OK') {
              $('#bx-recommendations-holder').html(response.data);
            }
        })
        .fail(function() {
            $('#bx-recommendations-holder').text("Request for bX recommendations failed.");
        });

    };

    var my = {
        init: function() {
            initBxRecommendations();
        }
    };

    return my;

})(finna);
