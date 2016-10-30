var charts = {}

charts.data_count = function(ndx, count_class) {
    
    var group = ndx.groupAll();
    dc.dataCount(count_class)
	.dimension(ndx)
	.group(group);
};

charts.make_barchart = function(ndx, colname, div_id, width, height, bin_width, y_axis_style) {
    var dim = ndx.dimension(function(d){ return d[colname];});
    var group = dim.group();
    if (bin_width != 1)
    {
	group = dim.group(function(d) {return Math.floor(d/bin_width)*bin_width;});
    }
    if (y_axis_style == "sqrt")
    {
	group.reduce(function(p, v) {return Math.sqrt(Math.round(p*p) + 1);}, function(p, v) {return Math.sqrt(Math.round(p*p) - 1);}, function(p, v) {return 0;});
    }
    var chart = dc.barChart(div_id);
    var min_x = dim.bottom(1)[0][colname] - bin_width / 2.;
    var max_x = dim.top(1)[0][colname] + bin_width / 2.;
    var num_bins = (max_x - min_x) / bin_width;
    var right_margin = 40;
    var left_margin = 40;
    if (width / right_margin < 5.)
    {
	right_margin = 0.10*width;
	left_margin = 0.10*width;
    }
    chart
	.dimension(dim)
	.group(group)
	.margins({top: 10, right: right_margin, bottom: 30, left: left_margin})
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
    if (y_axis_style == "sqrt")
    {
	chart.yAxis().tickFormat(function(v) {return v*v;});
    }
    return chart;
};

charts.make_piechart = function(ndx, colname, div_id, outer_radius, inner_radius)
{
    var dim = ndx.dimension(function(d){ return d[colname];});
    var group = dim.group();
    var chart = dc.pieChart(div_id);
    chart
	.dimension(dim)
	.group(group)
	.width(160)
	.height(160)
	.radius(outer_radius)
	.innerRadius(inner_radius);

    return chart;  
};

charts.create_charts = function(info_dict)
{
    charts.data_count(info_dict.cf, ".dc-data-count");
    
    // Play type
    var play_type_chart = charts.make_piechart(info_dict.cf, "play_type", "#play-type-chart", 80, 10);
    // WP and WPA
    var wp_chart = charts.make_barchart(info_dict.cf, "wp", "#wp-chart", $("#wp-chart").width(),
    					200, 1, 'linear');
    var wpa_chart = charts.make_barchart(info_dict.cf, "wpa", "#wpa-chart", $("#wpa-chart").width(),
    					 200, 0.5, 'sqrt');
    // Scores
    var off_score_chart = charts.make_barchart(info_dict.cf, "off_score", "#off-score-chart",
    					       $("#off-score-chart").width(), 200, 1, 'sqrt');			
    var def_score_chart = charts.make_barchart(info_dict.cf,"def_score", "#def-score-chart",
    					       $("#def-score-chart").width(), 200, 1, 'sqrt');
    // field position
    var down_chart = charts.make_piechart(info_dict.cf, "down", "#down-chart", 80, 10);
    var ytg_chart = charts.make_barchart(info_dict.cf, "yards_to_go", "#ytg-chart",
    					 $("#ytg-chart").width(), 200, 1, 'sqrt');
    var yardline_chart = charts.make_barchart(info_dict.cf, "yardline", "#yardline-chart",
    					      $("#ytg-chart").width(), 200, 1, 'linear');
    // temporal
    var quarter_chart = charts.make_piechart(info_dict.cf, "quarter", "#quarter-chart", 80, 10);
    var time_left_chart = charts.make_barchart(info_dict.cf, "seconds_left", "#time-left-chart",
    					       $("#time-left-chart").width(), 200, 30, 'linear');
    var week_chart = charts.make_barchart(info_dict.cf, "week", "#week-chart",
    					  $("#week-chart").width(), 200, 1, 'linear');
    dc.renderAll();

    info_dict.resizable_charts = [wp_chart, wpa_chart,
				  off_score_chart, def_score_chart,
				  ytg_chart, yardline_chart,
				  time_left_chart, week_chart];
    info_dict.chart_mapping = {"play_type_chart": play_type_chart,
			       "wp_chart": wp_chart,
			       "wpa_chart": wpa_chart,
			       "off_score_chart": off_score_chart,
			       "def_score_chart": def_score_chart,
			       "down_chart": down_chart,
			       "ytg_chart": ytg_chart,
			       "yardline_chart": yardline_chart,
			       "quarter_chart": quarter_chart,
			       "time_left_chart": time_left_chart,
			       "week_chart": week_chart
			      };
};

charts.set_resizable_charts = function(chart_list) {
    return function()
    {
	for (var i = 0; i < chart_list.length; i++)
	{
	    var width = 100;
	    if ($("#"+chart_list[i].anchorName()).width() > 100)
	    {
		width = $("#"+chart_list[i].anchorName()).width();
	    }
	    chart_list[i]
		.width(width)
		.rescale()
		.redraw();
	}
    }
};
