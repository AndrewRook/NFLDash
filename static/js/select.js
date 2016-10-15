var select = {};

select.make_team_selector = function(ndx, select_name, offense_select_name, home_column, away_column, datatable, player_dim)
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
};

select.make_offense_selector = function(ndx, select_name, team_select_name, offense_column, defense_column, datatable, player_dim)
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

select.make_home_selector = function(ndx, select_name, home_column, offense_column, datatable, player_dim)
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
    
};

select.make_offense_won_selector = function(ndx, select_name, offense_won_column, datatable, player_dim)
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
};

select.make_season_result_selector = function(ndx, select_name, column_name, datatable, player_dim)
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
};

select.create_selects = function(cf, player_dim, info_dict) {
    if ("datatable" in info_dict) {
	for (var i in constants.sorted_team_names)
	{
	    $("#team-select").append("<option value=\""+constants.sorted_team_names[i]+"\">"+constants.sorted_team_names[i]+"</option>");
	}
	$("#team-select").selectpicker('refresh');
	
	var team_dim = select.make_team_selector(cf, "#team-select", "#team-offense-select", "home_team",
					  "away_team", info_dict.datatable, player_dim);
	
	var team_offense_dim = select.make_offense_selector(cf, "#team-offense-select", "#team-select",
						     "offense_team", "defense_team", info_dict.datatable, player_dim);
	
	var offense_home_dim = select.make_home_selector(cf, "#offense-home-select",
						  "home_team", "offense_team", info_dict.datatable, player_dim);
	
	var offense_won_dim = select.make_offense_won_selector(cf, "#offense-won-select",
							"offense_won", info_dict.datatable, player_dim);
	
	var season_dim = select.make_season_result_selector(cf, "#season-select", "season_year", info_dict.datatable, player_dim);
	for (var season in constants.unique_seasons)
	{
	    $("#season-select").append("<option value=\""+season+"\">"+season+"</option>");
	}
	$("#season-select").selectpicker('refresh');
	
	var result_dim = select.make_season_result_selector(cf, "#result-select", "play_result", datatable, player_dim);
	for (var result in constants.unique_play_results)
	{
	    $("#result-select").append("<option value=\""+result+"\">"+result+"</option>");
	}
	$("#result-select").selectpicker('refresh');
	
	$("#qb-select").selectpicker('refresh');
	$("#rb-select").selectpicker('refresh');
	$("#receiver-select").selectpicker('refresh');
	$("#d-select").selectpicker('refresh');
	$("#other-select").selectpicker('refresh');
	// make_player_selector(player_dim, ".selectpicker.player-select", datatable);
	// for (var i in sorted_team_names)
	// {
	//     $("#team-select").append("<option value=\""+sorted_team_names[i]+"\">"+sorted_team_names[i]+"</option>");
	// }
	// $("#team-select").selectpicker('refresh');
	
	// var team_dim = make_team_selector(cf, "#team-select", "#team-offense-select", "home_team", "away_team", datatable, player_dim);
	
	// var team_offense_dim = make_offense_selector(cf, "#team-offense-select", "#team-select", "offense_team", "defense_team", datatable, player_dim);
	
	// var offense_home_dim = make_home_selector(cf, "#offense-home-select",
	// 					  "home_team", "offense_team", datatable, player_dim);
	
	// var offense_won_dim = make_offense_won_selector(cf, "#offense-won-select",
	// 						"offense_won", datatable, player_dim);
	
	// var season_dim = make_season_result_selector(cf, "#season-select", "season_year", datatable, player_dim);
	// for (var season in unique_seasons)
	// {
	//     $("#season-select").append("<option value=\""+season+"\">"+season+"</option>");
	// }
	// $("#season-select").selectpicker('refresh');
	
	// var result_dim = make_season_result_selector(cf, "#result-select", "play_result", datatable, player_dim);
	// for (var result in unique_play_results)
	// {
	//     $("#result-select").append("<option value=\""+result+"\">"+result+"</option>");
	// }
	// $("#result-select").selectpicker('refresh');
	
	// $("#qb-select").selectpicker('refresh');
	// $("#rb-select").selectpicker('refresh');
	// $("#receiver-select").selectpicker('refresh');
	// $("#d-select").selectpicker('refresh');
	// $("#other-select").selectpicker('refresh');
	// make_player_selector(player_dim, ".selectpicker.player-select", datatable);
    } else {
	setTimeout(select.create_selects(cf, info_dict), 250);
    }
    };
