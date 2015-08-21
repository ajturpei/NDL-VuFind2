var finna = (function() {

    var my = {
        init: function() {
            // List of modules to be inited
            var modules = [
                'advSearch', 
                'bx',
                'combinedResults', 
                'common', 
                'dateRangeVis', 
                'feed', 
                'feedback', 
                'imagePopup', 
                'layout', 
                'myList', 
                'openUrl', 
                'persona', 
                'record'
            ];

            $.each(modules, function(ind, module) {
                if (typeof finna[module] !== 'undefined') {
                    finna[module].init();
                }
            });
        },
    };

    return my;
})();

$(document).ready(function() {
    finna.init();

    // Override global checkSaveStatus
    checkSaveStatuses = finna.layout.checkSaveStatuses;

    // Override global callback that is executed after a Lightbox login
    var updatePageForLogin_vf = updatePageForLogin;
    updatePageForLogin = function() {
        if (finna.layout.isPageRefreshNeeded()) {
            if ((module == 'combined' && action == 'results')
               || (module == 'primo' && action == 'search')
            ) {
                // Login action was triggered from authorization notification:
                // reload page to refresh search results
                window.location.reload();
                return;
            }
        } else {
            // We don't know if the user is authorized, so it's best to
            // hide the authorization note (it's displayed again at next
            // page reload if needed).
            $('.authorization-notification').hide();
        }
        updatePageForLogin_vf();
    };
});
