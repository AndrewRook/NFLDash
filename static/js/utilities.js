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

function make_player_selector(dim, select_class_name, datatable)
{
    $(select_class_name).change(function()
				{
				    var player_dicts = [];
				    $(select_class_name).each(function()
							      {
								  var players = $(this).val();
								  if (players.length > 0)
								  {
								      var player_dict = {};
								      for (var i in players)
								      {
									  player_dict[players[i]] = 1;
								      }
								      player_dicts.push(player_dict);
								  }
							      });
				    dim.filterAll();
				    dim.filter(function(d) {
					if (player_dicts.length == 0)
					{
					    return true;
					}
					for (var i in player_dicts)
					{
					    var found = false;
					    for (var j in d)
					    {
						if (player_dicts[i][d[j]] != null)
						{
						    found = true;
						    break;
						}
					    }
					    if (found === false)
					    {
						return false;
					    }
					}
					return true;
				    });
				    dc.redrawAll();
				    RefreshTable(datatable, dim);
				});
}

function make_team_selector(ndx, select_name, column_name, datatable, player_dim)
{
    
    var dim = ndx.dimension(function(d){ return d[column_name];});
    $(select_name).change(function()
			  {
			      dim.filterAll();
			      var values = $(this).val();
			      if (values.length != 0)
			      {
				  dim.filter(function(d) {
				      return values.indexOf(d) != -1;
				  });
			      }
			      dc.redrawAll();
			      RefreshTable(datatable, player_dim);
			  });
    return dim;
}
function make_home_selector(ndx, select_name, home_column, offense_column, datatable, player_dim)
{
    var dim = ndx.dimension(function(d){ return d[offense_column] == d[home_column];});
    $(select_name).change(function()
			  {
			      dim.filterAll();
			      var values = $(this).val();
			      if (values.length != 0)
			      {
				  var value = values[0];
				  dim.filter(function(d) {
				      if ((value == "home" && d) || (value == "away" && d == false))
				      {
					  return true;
				      }
				      else
				      {
					  return false;
				      }
				  });
			      }
			      dc.redrawAll();
			      RefreshTable(datatable, player_dim);
			  });
    
    return dim;
    
}


function RefreshTable(datatable, player_dim) {
    dc.events.trigger(function () {
	//console.log("test", player_dim.top(1000).length);
	if (player_dim.top(1001).length < 1001)
	{
	    datatable.fnSettings().oLanguage.sEmptyTable = "All plays filtered";
	    datatable.api()
		.clear()
		.rows.add( player_dim.top(Infinity) )
		.draw();
	}
	else
	{
	    datatable.fnSettings().oLanguage.sEmptyTable = "Too many plays to display (> 1000)";
	    datatable.api()
		.clear()
		.draw();
	}
    });
}
