var io = {
    load_plays: function(filename, progress_url, progress_bar_id, info_dict, callback)
    {
	var max_progress_fraction = 0.60;
	var progress_increment = 0.10;
	info_dict.unique_seasons = {};
	info_dict.unique_play_results = {};
	//var count = 0;
	d3.csv(filename)
	    .row(function(row)
		 {

		     //Parsing player ids:
		     //player_ids = row.player_ids.replace(/[ \'u\[\]]/g, '').replace("-","").split(",").map(Number);
		     //player_ids = row.player_ids.replace(/[ \'u\[\]]/g, '').split(",");
		     player_ids_string = row.player_ids.replace(/[ \'u\[\]]/g, '');
		     //console.log(player_ids_string);
		     
		     //Converting to offense/defense score:
		     var off_score = +row.curr_home_score;
		     var def_score = +row.curr_away_score;
		     if (row.offense_team != row.home_team)
		     {
			 off_score = +row.curr_away_score;
			 def_score = +row.curr_home_score;
		     }

		     //Intelligently handling weeks:
		     var week = +row.week;
		     if(week > 21)
		     {
			 week = 21; //ignore bye week before superbowl
		     }

		     //Convert seconds elapsed to time remaining:
		     var seconds_left = 900 - +row.seconds_elapsed;

		     //Find defense:
		     var defense_team = row.away_team;
		     if (row.offense_team == row.away_team)
		     {
			 defense_team = row.home_team;
		     }

		     //Parse yardline into human-readable form:
		     var yardline_text = "Opp " + (50 - +row.yardline).toString();
		     if (+row.yardline == 0)
		     {
			 yardline_text = "50";
		     }
		     else if (+row.yardline < 0)
		     {
			 yardline_text = "Own " + (+row.yardline + 50).toString();
		     }
		     
		     info_dict.unique_seasons[row.season_year] = 1;
		     info_dict.unique_play_results[row.play_result] = 1;
		     
		     parsed_row = {
			 //'player_ids': player_ids,
			 'play_type': row.play_type,
			 "wp": +row.wp*100.,
			 "wpa": +row.wpa*100.,
			 "off_score": off_score,
			 "def_score": def_score,
			 "down": +row.down,
			 "yards_to_go": +row.yards_to_go,
			 "yardline": +row.yardline,
			 "yardline_text": yardline_text,
			 "quarter": row.quarter,
			 "seconds_left": seconds_left,
			 "week": week,
			 'home_team': constants.team_mapping[row.home_team],
			 'away_team': constants.team_mapping[row.away_team],
			 'offense_team': constants.team_mapping[row.offense_team],
			 'defense_team': constants.team_mapping[defense_team],
			 'offense_team_abbrev': row.offense_team,
			 'defense_team_abbrev': defense_team,
			 'offense_won': row.offense_won,
			 'season_year': +row.season_year,
			 'play_result': row.play_result,
			 'description': row.description,
			 'player_ids_string': player_ids_string,
		     };
		     return parsed_row;
		 })
	    .on("progress", function (request)
		{
		    if(request.responseURL == progress_url)
		    {
			utilities.update_progress_bar(progress_bar_id, progress_increment, max_progress_fraction);
		    }
		})
	    .get(function(error, player_data)
		 {
		     callback(null, player_data);
		 });
    },
    load_players: function(filename, info_dict, callback)
    {
	info_dict.player_dict = {};
	d3.csv(filename)
	    .row(function(row)
		 {
		     //row.player_id = row.player_id.replace("-","");
		     //row.player_id = +row.player_id;
		     info_dict.player_dict[row.player_id] = {"name": row.full_name, "position": row.position};
		     if (row["position"] == "QB")
		     {
		     	 $("#qb-select").append("<option value=\""+row["player_id"]+"\">"+row["full_name"]+"</option>");
		     }
		     else if (row["position"] == "RB" || row["position"] == "FB")
		     {
		     	 $("#rb-select").append("<option value=\""+row["player_id"]+"\">"+row["full_name"]+"</option>");
		     }
		     else if (row["position"] == "WR" || row["position"] == "TE")
		     {
		     	 $("#receiver-select").append("<option value=\""+row["player_id"]+"\">"+row["full_name"]+"</option>");
		     }
		     else if (row["position"] == "DE" || row["position"] == "DT" || row["position"] == "LB" || row["position"] == "CB" || row["position"] == "DB" || row["position"] == "FS" || row["position"] == "ILB" || row["position"] == "MLB" || row["position"] == "NT" || row["position"] == "OLB" || row["position"] == "SS")
		     {
		     	 $("#d-select").append("<option value=\""+row["player_id"]+"\">"+row["full_name"]+"</option>");
		     }
		     else
		     {
		     	 $("#other-select").append("<option value=\""+row["player_id"]+"\">"+row["full_name"]+"</option>");
		     }
		     return row;
		 })
	    .get(function(error, player_data)
		 {
		     callback(null, player_data);
		 });
    },
};
