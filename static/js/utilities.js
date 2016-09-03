function make_barchart (ndx, colname, div_id, width, height)
{    
    var dim = ndx.dimension(function(d){ return d[colname];});
    var group = dim.group();
    var chart = dc.barChart(div_id);
    var min_x = dim.bottom(1)[0][colname];
    var max_x = dim.top(1)[0][colname];
    chart
	.dimension(dim)
	.group(group)
	.margins({top: 10, right: 40, bottom: 30, left: 40})
	.centerBar(true)
	.x(d3.scale.linear().domain([min_x, max_x]))
	.elasticY(true)
	.width(width).height(height);
    return chart;
}

function make_piechart (ndx, colname, div_id, outer_radius, inner_radius)
{
    var dim = ndx.dimension(function(d){ return d[colname];});
    var group = dim.group();
    var chart = dc.pieChart(div_id);
    chart
	.dimension(dim)
	.group(group)
	.radius(outer_radius)
	.innerRadius(inner_radius);

    return chart;
    
}

function make_player_selector (ndx, position, div_id)
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
    return select;
}

function render_selectors(selector_list, chart_list, titles_list)
{
    for (var i = 0; i < selector_list.length; i++)
    {
	var selector = $(selector_list[i]).children("select")[0];
	$(selector).addClass("selectpicker");
	$(selector).attr("data-live-search", "true");
	$(selector).attr("title", titles_list[i]);
	$(selector).selectpicker('refresh'); 
	$(selector_list[i]).append('<span class="reset_span" style="font-size:10px; font-weight: normal;">' +
                                   '<a class="reset" href="javascript:' + chart_list[i] + '.filterAll(); dc.redrawAll();" style="display:none">' +
				   'reset chart</a>' +
				   '</span>');
    }
}