var select = {};

select.make_team_selector = function(ndx, select_name, offense_select_name, home_column, away_column, datatable, player_dim)
{
    
    var dim = ndx.dimension(function(d){ return d[home_column] + "_" + d[away_column];}); 
    $(select_name).change(function()
			  {
			      $(this).siblings("button").css("background", "rgb(255, 255, 255) linear-gradient(rgb(255, 255, 255) 0px, rgb(224, 224, 224) 100%) ").css("color", "black").css("text-shadow", "0 1px 0 #fff");
			      $(offense_select_name).prop("disabled", false);
			      utilities.show_hide_general_reset();
			      dim.filterAll();
			      var values = $(this).val();
			      if (values.length > 0)
			      {
				  $(this).siblings("button").css("background", "#3182BD").css("color", "white").css("text-shadow", "0px 0px 0px #fff");
				  dim.filter(function(d) {
				      for (var i = 0; i < values.length; i++)
				      {
					  if (d.indexOf(values[i]) != -1)
					  {
					      return true;
					  }
				      }
				      return false;
				  });
			      }
			      else
			      {	  
				  $(offense_select_name).prop("disabled", true);
			      }
			      dc.redrawAll();
			      play_table.RefreshTable(datatable, player_dim);
			      $(offense_select_name).trigger("change");
			      $(offense_select_name).selectpicker("refresh");
			      
			  });
    return dim;
};

select.make_offense_selector = function(ndx, select_name, team_select_name, offense_column, defense_column, datatable, player_dim)
{
    var dim = ndx.dimension(function(d){ return "offense-" + d[offense_column] + "_defense-" + d[defense_column];});
    $(select_name).change(function()
			  {
			      $(this).siblings("button").css("background", "rgb(255, 255, 255) linear-gradient(rgb(255, 255, 255) 0px, rgb(224, 224, 224) 100%) ").css("color", "black").css("text-shadow", "0 1px 0 #fff");
			      utilities.show_hide_general_reset();
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
					  for (var i = 0; i < selected_teams.length; i++) {
					      if (d.indexOf(value + "-" + selected_teams[i]) != -1) {
						  return true;
					      }
					  }
					  return false;
				      });
				  }
			      } 
			      dc.redrawAll();
			      play_table.RefreshTable(datatable, player_dim);
			  });
}

select.make_home_selector = function(ndx, select_name, home_column, offense_column, datatable, player_dim)
{
    var dim = ndx.dimension(function(d){ return d[offense_column] == d[home_column];});
    $(select_name).change(function()
			  {
			      $(this).siblings("button").css("background", "rgb(255, 255, 255) linear-gradient(rgb(255, 255, 255) 0px, rgb(224, 224, 224) 100%) ").css("color", "black").css("text-shadow", "0 1px 0 #fff");
			      utilities.show_hide_general_reset();
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
			      play_table.RefreshTable(datatable, player_dim);
			  });
    
    return dim;
    
};

select.make_offense_won_selector = function(ndx, select_name, offense_won_column, datatable, player_dim)
{
    var dim = ndx.dimension(function(d){ return d[offense_won_column] == "True";});
    $(select_name).change(function()
			  {
			      $(this).siblings("button").css("background", "rgb(255, 255, 255) linear-gradient(rgb(255, 255, 255) 0px, rgb(224, 224, 224) 100%) ").css("color", "black").css("text-shadow", "0 1px 0 #fff");
			      utilities.show_hide_general_reset();
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
			      play_table.RefreshTable(datatable, player_dim);
			  });
    return dim;
};

select.make_season_result_selector = function(ndx, select_name, column_name, datatable, player_dim)
{
    
    var dim = ndx.dimension(function(d){ return d[column_name];});
    $(select_name).change(function()
			  {
			      $(this).siblings("button").css("background", "rgb(255, 255, 255) linear-gradient(rgb(255, 255, 255) 0px, rgb(224, 224, 224) 100%) ").css("color", "black").css("text-shadow", "0 1px 0 #fff");
			      utilities.show_hide_general_reset();
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
			      play_table.RefreshTable(datatable, player_dim);
			  });
    return dim;
};

select.wire_general_selects = function(cf, datatable, player_dim) {
    var start = performance.now();
    var team_dim = select.make_team_selector(cf, "#team-select", "#team-offense-select", "home_team", "away_team",
					     datatable, player_dim);
    
    var team_offense_dim = select.make_offense_selector(cf, "#team-offense-select", "#team-select",
    						 "offense_team", "defense_team",
    						 datatable, player_dim);
    
    var offense_home_dim = select.make_home_selector(cf, "#offense-home-select",
    					      "home_team", "offense_team",
    					      datatable, player_dim);
    
    var offense_won_dim = select.make_offense_won_selector(cf, "#offense-won-select",
    						    "offense_won", datatable, player_dim);
    
    var season_dim = select.make_season_result_selector(cf, "#season-select", "season_year",
    						 datatable, player_dim);
    
    var result_dim = select.make_season_result_selector(cf, "#result-select", "play_result",
    						 datatable, player_dim);

};

select.wire_player_selects = function(dim, select_class_name, datatable)
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
					    for (var i = 0; i < player_dicts.length; i++)
					    {
						var found = false;
						for (var j = 0; j < d.length; j += 10)
						{
						    var curr_id = d.substring(j, j + 10);
						    if (player_dicts[i][curr_id] != null)
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
				    play_table.RefreshTable(datatable, dim);
				});
};
