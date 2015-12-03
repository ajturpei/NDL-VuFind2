/* Add your custom template javascript here */

function finnaCustomInit() {
  $('.do-search').click(function() {
      variable = $('input[name="pre-filter"]:checked').val();
      if (variable == "images") {
           $('form.searchForm').append('<input class="applied-filter" id="applied_filter_1" type="hidden" name="filter[]" value="online_boolean:&quot;1&quot;">');
          $('form.searchForm').append('<input class="applied-filter" id="applied_filter_2" type="hidden"  name="filter[]" value="~format:&quot;0/Image/&quot;">');
          $('form.searchForm').append('<input class="applied-filter" id="applied_filter_3" type="hidden"  name="filter[]" value="~format:&quot;0/PhysicalObject/&quot;">');
          $('form.searchForm').append('<input class="applied-filter" id="applied_filter_4" type="hidden"  name="filter[]" value="~format:&quot;0/WorkOfArt/&quot;">');
         $('form.searchForm').append(' <input class="applied-filter" id="applied_filter_5" type="hidden"  name="filter[]" value="~format:&quot;0/Map/&quot;">');
         $('form.searchForm').append(' <input class="applied-filter" id="applied_filter_6" type="hidden"  name="filter[]" value="~format:&quot;0/Place/&quot;">');
          $('form.searchForm').append('<input class="applied-filter" id="applied_filter_7" type="hidden"  name="filter[]" value="~format:&quot;1/Other/Letter/&quot;">');
          $('form.searchForm').append('<input class="applied-filter" id="applied_filter_8" type="hidden"  name="filter[]" value="~format:&quot;1/Other/Print/&quot;">');
      }
      if (variable == "online") {
        $('form.searchForm').append('<input class="filter" id="filter_2" type="hidden" name="filter[]" value="online_boolean:&quot;1&quot;">');
      }
       if (variable == "archives") {
        $('form.searchForm').append('<input class="filter" id="applied_filter_1" type="hidden" name="filter[]" value="~sector_str_mv:&quot;0/arc/&quot;">');
      }
      if (variable == "books") {
           $('form.searchForm').append('<input class="filter" id="applied_filter_1" type="hidden" name="filter[]" value="~sector_str_mv:&quot;0/lib/&quot;">');
      }
      $('.searchForm').submit();
  });
}
