function make_selector (ndx, position, div_id)
{
    var dim = ndx.dimension(function(d){ return d.player_ids;}, true);
    var group = dim.group();
    var select = dc.selectMenu(div_id);
    select
	.dimension(dim)
	.group(group)
	.filterDisplayed(function (d) {
	    if (typeof(position) == "string")
	    {
		position = [position];
	    }
	    if ($.inArray(player_dict[d.key]["position"], position) > -1)
	    {
		return true;
	    }
	    else
	    {
		return false;
	    }
	})
	.multiple(true)
	.order(function (a, b) {
	    //Handle cases where there is no name:
	    if (player_dict[a.key]["name"] == "") {return 1;}
	    if (player_dict[b.key]["name"] == "") {return -1;}
	    
	    if (player_dict[a.key]["name"] > player_dict[b.key]["name"])
	    {
		return 1;
	    }
	    else if (player_dict[b.key]["name"] > player_dict[a.key]["name"])
	    {
		return -1;
	    }
	    else
	    {return 0;}
	})
	.title(function(d) {
	    if (player_dict[d.key]["name"] !== "")
	    {
		return player_dict[d.key]["name"] + ": " + d.value;
	    }
	    else
	    {return d.key + ": " + d.value;}
	})
    ;
}

function render_selectors(selector_list, titles_list)
{
    for (var i = 0; i < selector_list.length; i++)
    {
	var selector = $(selector_list[i]).children("select")[0];
	$(selector).addClass("selectpicker");
	$(selector).attr("data-live-search", "true");
	$(selector).attr("title", titles_list[i]);
	$(selector).selectpicker('refresh'); 
    }
}
