var io = {
    load_plays: function(filename, progress_url, progress_bar_id, callback)
    {
	var max_progress_fraction = 0.30;
	var progress_increment = 0.05;
	//var count = 0;
	d3.csv(filename)
	    .row(function(row)
		 {

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
		     
		     parsed_row = {
			 'play_type': row.play_type,
			 "wp": +row.wp*100.,
			 "wpa": +row.wpa*100.,
			 "off_score": off_score,
			 "def_score": def_score,
			 "down": +row.down,
			 "yards_to_go": +row.yards_to_go,
			 "yardline": +row.yardline,
			 "quarter": row.quarter,
			 "seconds_left": seconds_left,
			 "week": week,
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
    load_players: function(filename, callback)
    {
	d3.csv(filename)
	    .row(function(row)
		 {
		     return row;
		 })
	    .get(function(error, player_data)
		 {
		     callback(null, player_data);
		 });
    },
};
