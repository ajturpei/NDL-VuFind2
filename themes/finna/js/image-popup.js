finna.imagePopup = (function(finna) {

    var initThumbnailNavi = function() {

        // Assign image indices to UI components. 
        var index = 0;
        $(".image-popup").each(function() {
            $(this).data('ind', index++);
        });

        // Assign image indices for individual images.
        $(".recordcovers").each(function() {
            var thumbInd = 0;
            $(this).find('.image-popup').each(function() {
                $(this).data('thumbInd', thumbInd++);
            });
        });

        // Open image-popup from medium size record image.
        $(".image-popup-trigger").each(function() {
            var links = $(this).closest('.recordcover-holder').find('.recordcovers .image-popup');
            var index = links.eq(0).data('ind');
            $(this).data('ind', index);
            $(this).data('thumbInd', 0);
        });

        // Roll-over thumbnail images: update medium size record image and indices.
        $(".image-popup-navi").mouseenter(function() {
            var trigger = $(this).closest('.recordcover-holder').find('.image-popup-trigger');
            trigger.data('ind', $(this).data('ind'));
            trigger.data('thumbInd', $(this).data('thumbInd'));
            trigger.find('img').attr('src', $(this).attr('href'));
        });

        // Open image-popup from medium size record image.
        $(".image-popup-trigger").click(function(e) {
            var ind = $(this).data('ind');
            var links = $(this).closest('.recordcover-holder').find('.image-popup');
            var link = links.filter(function() { 
                return $(this).data('ind') === ind 
            } );
            link.click();
            e.preventDefault();
        });      
    };

    var initRecordImage = function() {
        // Collect data for all image-popup triggers on page.
        urls = $('.image-popup').map(
            function() {
                var id = null;
                if (controller === 'Record' && action === 'Home') {
                    id = $(this).closest('.record.recordId').find('.hiddenId').val();
                } else if (controller === 'Search' && action === 'Results') {
                    id = $(this).closest('.result').find('.hiddenId').val();
                }
                if (!id) {
                    return;
                }
                var ind = $(this).data('ind');
                var thumbInd = $(this).data('thumbInd');
                var src = path + '/AJAX/JSON?method=getImagePopup&id=' + encodeURIComponent(id) + '&index=' + thumbInd;
                return {
                    src: src,
                    href: $(this).attr('href'),
                    ind: ind,
                }
            } 
        ).toArray();
        
        // Init image-popup components.
        $('.image-popup').each(function() {
            var href = $(this).attr('href');
            var img = urls.filter(function(obj) {
                return obj.href === href;
            });
            index = img[0].ind;
            $(this).magnificPopup({
                items: urls,
                index: index,
                type: 'ajax',
	            tLoading: vufindString.loading,
                ajax: {
                    cursor: ''
                },

                callbacks: {
                    ajaxContentAdded: function() {
                        var popup = $(".imagepopup-holder");
                        var type = popup.data("type");
                        var id = popup.data("id");

                        $(".imagepopup-holder .image img").one("load", function() {
				            $(".imagepopup-holder .image").addClass('loaded');
                        }).each(function() {
                            if(this.complete) {
                                $(this).load();
                            }
                        });
                        
                        // Prevent navigation button CSS-transitions on touch-devices
                        if (finna.isTouchDevice()) {
                            $(".mfp-container .mfp-arrow-right, .mfp-container .mfp-arrow-left").addClass('touch-device');
                        }                        

                        // Image copyright information
                        $(".imagepopup-holder .image-rights .copyright-link a").on("click", function() {
                            var mode = $(this).data("mode") == 1;                                      
                            
                            var moreLink = $(".imagepopup-holder .image-rights .more-link");
                            var lessLink = $(".imagepopup-holder .image-rights .less-link");
                            
                            moreLink.toggle(!mode);
                            lessLink.toggle(mode);
                            
                            $(".imagepopup-holder .image-rights .copyright").toggle(mode);
                            
                            return false;                                      
                        });

                        // Load book description                        
                        if (type == 'marc') {
                            var url = path + '/AJAX/JSON?method=getDescription&id=' + id;
                            $.getJSON(url, function(response) {
                                console.log("status: " + response.status);
                                if (response.status === 'OK' && response.data.length > 0) {
                                    console.log("show desc");
                                    $(".imagepopup-holder .summary > div").html(response.data);
                                }
                            });
                        }
                    },
                },

                gallery: {                 
                    enabled: true,
                    preload: [0,2],
                    navigateByImgClick: true,
                    arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
                    tPrev: 'trPrev',
                    tNext: 'trNext',
                    tCounter: ''
                }
            });
        });
    };

    var my = {
        init: function() {
            initThumbnailNavi();
            initRecordImage();
        }
    };
    
    return my;

})(finna);

