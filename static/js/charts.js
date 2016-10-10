var charts = {}

charts.data_count = function(ndx, count_class) {
    
    var group = ndx.groupAll();
    dc.dataCount(count_class)
	.dimension(ndx)
	.group(group);
}

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
}

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
}
