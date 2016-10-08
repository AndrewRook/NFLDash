/*
     Copyright 2016 Andrew Schechtman-Rook
     Distributed under the terms of the GNU General Public License v3
*/

function make_barchart (ndx, colname, div_id, width, height, bin_width, y_axis_style)
{
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
    if (y_axis_style == "sqrt")
    {
	chart.yAxis().tickFormat(function(v) {return v*v;});
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
	.width(160)
	.height(160)
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
								  $(this).siblings("button").css("background", "rgb(255, 255, 255) linear-gradient(rgb(255, 255, 255) 0px, rgb(224, 224, 224) 100%) ").css("color", "black").css("text-shadow", "0 1px 0 #fff");
								  var players = $(this).val();
								  if (players.length > 0)
								  {
								      $(this).siblings("button").css("background", "#3182BD").css("color", "white").css("text-shadow", "0px 0px 0px #fff");
								      var player_dict = {};
								      for (var i in players)
								      {
									  player_dict[players[i]] = 1;
								      }
								      player_dicts.push(player_dict);
								  }
							      });
				    dim.filterAll();
				    $('#player-reset').css('visibility','hidden');
				    if (player_dicts.length > 0)
				    {
					$('#player-reset').css('visibility','visible');
					dim.filter(function(d) {
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
				    }
				    dc.redrawAll();
				    RefreshTable(datatable, dim);
				});
}

function show_hide_general_reset()
{
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

function make_season_result_selector(ndx, select_name, column_name, datatable, player_dim)
{
    
    var dim = ndx.dimension(function(d){ return d[column_name];});
    $(select_name).change(function()
			  {
			      $(this).siblings("button").css("background", "rgb(255, 255, 255) linear-gradient(rgb(255, 255, 255) 0px, rgb(224, 224, 224) 100%) ").css("color", "black").css("text-shadow", "0 1px 0 #fff");
			      show_hide_general_reset();
			      dim.filterAll();
			      var values = $(this).val();
			      if (values.length > 0)
			      {
				  $(this).siblings("button").css("background", "#3182BD").css("color", "white").css("text-shadow", "0px 0px 0px #fff");
				  dim.filter(function(d) {
				      return values.indexOf(String(d)) != -1;
				  });
			      }
			      dc.redrawAll();
			      RefreshTable(datatable, player_dim);
			  });
    return dim;
}

function make_team_selector(ndx, select_name, offense_select_name, home_column, away_column, datatable, player_dim)
{
    
    var dim = ndx.dimension(function(d){ return [d[home_column], d[away_column]];});
    $(select_name).change(function()
			  {
			      $(this).siblings("button").css("background", "rgb(255, 255, 255) linear-gradient(rgb(255, 255, 255) 0px, rgb(224, 224, 224) 100%) ").css("color", "black").css("text-shadow", "0 1px 0 #fff");
			      $(offense_select_name).prop("disabled", false);
			      show_hide_general_reset();
			      dim.filterAll();
			      var values = $(this).val();
			      if (values.length > 0)
			      {
				  $(this).siblings("button").css("background", "#3182BD").css("color", "white").css("text-shadow", "0px 0px 0px #fff");
				  dim.filter(function(d) {
				      return values.indexOf(String(d[0])) != -1 || values.indexOf(String(d[1])) != -1;
				  });
			      }
			      else
			      {	  
				  $(offense_select_name).prop("disabled", true);
			      }
			      dc.redrawAll();
			      RefreshTable(datatable, player_dim);
			      $(offense_select_name).trigger("change");
			      $(offense_select_name).selectpicker("refresh");
			      
			  });
    return dim;
}

function make_offense_selector(ndx, select_name, team_select_name, offense_column, defense_column, datatable, player_dim)
{
    var dim = ndx.dimension(function(d){ return [d[offense_column], d[defense_column]];});
    $(select_name).change(function()
			  {
			      $(this).siblings("button").css("background", "rgb(255, 255, 255) linear-gradient(rgb(255, 255, 255) 0px, rgb(224, 224, 224) 100%) ").css("color", "black").css("text-shadow", "0 1px 0 #fff");
			      show_hide_general_reset();
			      dim.filterAll();
			      var values = $(this).val();
			      var selected_teams = $(team_select_name).val();
			      if (values.length > 0)
			      {
				  $(this).siblings("button").css("background", "#3182BD").css("color", "white").css("text-shadow", "0px 0px 0px #fff");
				  
				  if (values.length > 0 && selected_teams.length > 0)
				  {
				      
				      var value = values[0];
				      dim.filter(function(d) {
					  if ((value == "offense" && String(selected_teams).indexOf(d[0]) != -1) || (value == "defense" && String(selected_teams).indexOf(d[1]) != -1))
					  {
					      return true;
					  }
					  else
					  {
					      return false;
					  }
				      });
				  }
			      } 
			      dc.redrawAll();
			      RefreshTable(datatable, player_dim);
			  });
}

function make_home_selector(ndx, select_name, home_column, offense_column, datatable, player_dim)
{
    var dim = ndx.dimension(function(d){ return d[offense_column] == d[home_column];});
    $(select_name).change(function()
			  {
			      $(this).siblings("button").css("background", "rgb(255, 255, 255) linear-gradient(rgb(255, 255, 255) 0px, rgb(224, 224, 224) 100%) ").css("color", "black").css("text-shadow", "0 1px 0 #fff");
			      show_hide_general_reset();
			      dim.filterAll();
			      var values = $(this).val();
			      if (values.length != 0)
			      {
				  
				  $(this).siblings("button").css("background", "#3182BD").css("color", "white").css("text-shadow", "0px 0px 0px #fff");
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

function make_offense_won_selector(ndx, select_name, offense_won_column, datatable, player_dim)
{
    var dim = ndx.dimension(function(d){ return d[offense_won_column] == "True";});
    $(select_name).change(function()
			  {
			      $(this).siblings("button").css("background", "rgb(255, 255, 255) linear-gradient(rgb(255, 255, 255) 0px, rgb(224, 224, 224) 100%) ").css("color", "black").css("text-shadow", "0 1px 0 #fff");
			      show_hide_general_reset();
			      dim.filterAll()
			      var values = $(this).val();
			      if (values.length != 0)
			      {
				  $(this).siblings("button").css("background", "#3182BD").css("color", "white").css("text-shadow", "0px 0px 0px #fff");
				  var value = values[0];
				  dim.filter(function(d) {
				      if ((value == "won" && d) || (value == "loss" && d == false))
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

function update_progress_bar(title_id, bar_id, title_text, increment_amount, max_value)
{
    $(title_id).text(title_text);
    var curr_value = +($(bar_id).css("width").slice(0, -1));
    var new_value = curr_value + increment_amount;
    if (new_value > max_value)
    {
	new_value = max_value;
    }
    $(bar_id).css("width", new_value+"%");
}
