function make_barchart (ndx, colname, div_id, width, height, bin_width)
{
    var dim = ndx.dimension(function(d){ return d[colname];});
    var group = dim.group();
    if (bin_width != 1)
    {
	group = dim.group(function(d) {return Math.floor(d/bin_width)*bin_width;});
    }
    var chart = dc.barChart(div_id);
    var min_x = dim.bottom(1)[0][colname] - bin_width / 2.;
    var max_x = dim.top(1)[0][colname] + bin_width / 2.;
    var num_bins = (max_x - min_x) / bin_width;
    chart
	.dimension(dim)
	.group(group)
	.margins({top: 10, right: 40, bottom: 30, left: 40})
	.centerBar(true)
	.x(d3.scale.linear().domain([min_x, max_x]))
	.elasticY(true)
	.barPadding(0.1)
	.width(width).height(height);
    //console.log(max_x, min_x, bin_width, num_bins);
    if (bin_width != 1)
    {
	chart.xUnits(function(){return num_bins;});
    }
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

function make_player_selector (ndx, position, div_id, player_dict)
{
    var dim = ndx.dimension(function(d){ return d.player_ids;}, true);
    
    var group = dim.group();
    var select = dc.selectMenu(div_id);
    select
	.dimension(dim)
	.group(group)
	.filterDisplayed(function (d) {
	    return true;
	    // if (typeof(position) == "string")
	    // {
	    // 	position = [position];
	    // }
	    // if ($.inArray(player_dict[d.key]["position"], position) > -1)
	    // {
	    // 	return true;
	    // }
	    // else
	    // {
	    // 	return false;
	    // }
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

function make_team_selector(ndx, column_name, div_id)
{
    var dim = ndx.dimension(function(d){ return d[column_name];});
    
    var group = dim.group();
    var select = dc.selectMenu(div_id);
    select
	.dimension(dim)
	.group(group)
	.filterDisplayed(function (d) {
	    return true;
	})
	.multiple(true)
	.title(function(d) {
	    return d.key + ": " + d.value;
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

function playerFilterHandler (dimension, filters) {
    dimension.filter(null);
    console.log("dimension:", dimension);
    if (filters.length === 0) {
        dimension.filter(null);
    } else {
        dimension.filterFunction(function (d, test) {
	    var e = new Error('dummy');
	    var stack = e.stack.replace(/^[^\(]+?[\n$]/gm, '')
		.replace(/^\s+at\s+/gm, '')
		.replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@')
		.split('\n');
	    console.log(stack);
	    //console.log("test", d, test, dimension.top(Infinity)[test]);
	    //var filtered = true;
            for (var i = 0; i < filters.length; i++) {
                var filter = filters[i];
                // if (filter.isFiltered && filter.isFiltered(d)) {
                //     return true;
                // } else if (filter <= d && filter >= d) {
		//     console.log("test", filter, d);
                //     return true;
	    	// }
		if (filter > d || filter < d)
		{
		    return false;
		}
            
            }
            return true;
        });
    }
    return filters;
}
