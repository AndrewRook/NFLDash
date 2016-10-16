/*
     Copyright 2016 Andrew Schechtman-Rook
     Distributed under the terms of the GNU General Public License v3
*/

jQuery.extend( jQuery.fn.dataTableExt.oSort, {
    "yardline-pre": function ( a ) {
	var x = a.replace("Opp ", "");
	x = parseInt(x.replace("Own ", "-"));
	if (x < 0)
	{
	    return -50 - x;
	}
	else
	{
	    return 50 - x;
	}
    },
 
    "yardline-asc": function ( a, b ) {
        return ((a < b) ? -1 : ((a > b) ? 1 : 0));
    },
 
    "yardline-desc": function ( a, b ) {
        return ((a < b) ? 1 : ((a > b) ? -1 : 0));
    }
} );

utilities = {
    update_progress_bar : function(progress_bar_id, increment_fraction, max_fraction)
    {
	var curr_width = $(progress_bar_id).width();
	var max_width = $(progress_bar_id).offsetParent().width();
	var new_width = curr_width + increment_fraction * max_width;
	//console.log($(progress_bar_id).width());
	if (new_width > max_fraction * max_width)
	{
	    new_width = max_fraction * max_width;
	    //console.log(curr_width, new_width);
	}
	$(progress_bar_id).width(new_width);
    }
};

utilities.show_hide_general_reset = function() {
    var is_selected_list = $("select.general-select").map(function() {return this.value != "";});
    var any_selected = false;
    for (var i = 0; i < is_selected_list.length; i++)
    {
	if (is_selected_list[i] === true)
	{
	    any_selected = true;
	    break;
	}
    }
    if (any_selected === true)
    {
	$('#general-reset').css('visibility','visible');
    }
    else
    {
	
	$('#general-reset').css('visibility','hidden');
    }
}
