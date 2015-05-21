finna.feed = (function() {
    var calculateScrollSpeed = function(scrollCnt) {
        return 750 * Math.max(1, (scrollCnt/5));
    };

    var centerImages = function(holder) {
        holder.find(".carousel-feed:not(.slick-vertical) .slick-slide .wrapper img").each (function() {
            centerImage($(this));
        });
    };

    var centerImage = function(img) {
        var offset = img.width() - img.closest(".slick-slide").width();
        img.css("margin-left", offset > 0 ? "-" + offset/2 + "px" : "auto");
    };
    
    var adjustWidth = function(holder) {
        holder.find(".carousel-slide-header p, .carousel-text")
            .width(holder.find(".slick-slide").width()-20);

        holder.find(".slick-slide .wrapper img").each (function() {
            centerImage($(this));
        });
    };

    var adjustTitles = function(holder) {
        // Move title field below image
        var maxH = 0;
        holder.find(".carousel-feed .slick-slide .carousel-slide-header p").each (function() {
            maxH = Math.max(maxH, $(this).innerHeight());
            $(this).addClass("title-bottom");
        });
        holder.find(".carousel-feed .slick-list").css("padding-bottom", maxH + "px");
        holder.find(".carousel-feed .slick-slide .carousel-text").addClass("text-bottom");
    };

    var loadFeed = function(holder) {        
        var id = holder.data('feed');
        if (typeof(id) == "undefined") {
            return;
        }

        // Append spinner
        holder.append('<i class="fa fa-spin fa-spinner"></i>');
        holder.find(".fa-spin").hide().delay(1000).fadeIn();

        var url = path + '/AJAX/JSON?method=getFeed&id=' + id;
        url += "&touch-device=" + (finna.layout.isTouchDevice() ? 1 : 0);

        $.getJSON(url, function(response) {
            if (response.status == 'ERROR') {
                holder.html('<div class="error">' + vufindString.error + '</div>');
                return;
            }

            if (response.status === 'OK' && response.data) {
                holder.html(response.data.html);
                var settings = response.data.settings;
                if (typeof(settings['height']) == 'undefined') {
                    settings['height'] = 700;
                }

                if (settings.type == "carousel") {
                    if (settings.images) {
                        holder.addClass("with-image");
                    }

                    var obj = holder.find(".carousel-feed").slick({
                        dots: settings['dots'],
                        swipe: true,
                        infinite: true,
                        touchThreshold: 8,
                        autoplay: settings['autoplay'],
                        autoplaySpeed: settings['autoplay'],
                        slidesToShow: settings['slidesToShow']['desktop'],
                        slidesToScroll: settings['scrolledItems']['desktop'],
                        speed: calculateScrollSpeed(settings['scrolledItems']['desktop']),
                        vertical: settings['vertical'],
                        responsive: responsive = [
                        {
                            breakpoint: 1200,
                            settings: {
                                slidesToShow: settings['slidesToShow']['desktop-small'],
                                slidesToScroll: settings['scrolledItems']['desktop-small'],
                                speed: calculateScrollSpeed(settings['scrolledItems']['desktop-small']),                                
                                infinite: true,
                                dots: true
                            }
                        },
                        {
                            breakpoint: 992,
                            settings: {
                                slidesToShow: settings['slidesToShow']['tablet'],
                                slidesToScroll: settings['scrolledItems']['tablet'],
                                speed: calculateScrollSpeed(settings['scrolledItems']['tablet']),                                
                                infinite: true,
                                dots: true
                            }
                        },
                        {
                            breakpoint: 768,
                            settings: {
                                slidesToShow: settings['slidesToShow']['mobile'],
                                slidesToScroll: settings['scrolledItems']['mobile'],
                                speed: calculateScrollSpeed(settings['scrolledItems']['mobile']),
                                infinite: true,
                                dots: true
                            }
                        }
                        ]
                    });
                    
                    if (settings['type'] == 'carousel' && !settings['vertical']) {
                        adjustWidth(holder);

                        holder.find(".carousel-feed .slick-slide .wrapper img").each (function() {
                            $(this).on("load", function() {
                                centerImage($(this));
                            });
                        });

                        var titleBottom =
                            typeof(settings['titlePosition']) != 'undefined'
                            && settings['titlePosition'] == 'bottom'
                        ;

                        if (titleBottom) {
                            adjustTitles(holder);
                        }

                        $(window).resize(function() {
                            setTimeout(function() {
                                adjustWidth(holder);
                                if (titleBottom) {
                                    adjustTitles(holder);
                                }
                                centerImages(holder);
                            }, 250);
                        });
                    

                    holder.find(".slick-slide")
                        .css("max-height", settings['height'] + "px")
                        .addClass('adjusted-height')
                        .find(".wrapper img").css("height", settings['height'] + "px")
                        .find(".slick-track, .slick-slide .wrapper").css("max-height", settings['height'] + "px");
                    }
                    else {
                        holder.find(".slick-track, .slick-slide .wrapper").css("height", settings['height'] + "px");
                    }
                    // Text hover for touch devices
                    if (finna.layout.isTouchDevice()
                        && typeof(settings['linkText'] == 'undefined')
                    ) {
                        holder.find(".slick-slide a").click(function(event) {
                            if (!$(this).closest(".slick-slide").hasClass("clicked")) {
                                $(this).closest(".slick-slide").addClass("clicked");
                                return false;
                            }
                        });
                    }

                    // Force refresh to make sure that the layout is ok
                    obj.slickGoTo(0, true);
                }
            }
        });        
    };
    
    var initComponents = function() {
        $(".feed-container").each(function() {
            loadFeed($(this));
        });
    };

    var my = {
        init: function() {
            initComponents();
        }
    };

    return my;

})(finna);