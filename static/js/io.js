var io = {
    load_plays: function(filename, progress_url, progress_bar_id, callback)
    {
	var max_progress_fraction = 0.30;
	var progress_increment = 0.05;
	//var count = 0;
	d3.csv(filename)
	    .row(function(row)
		 {
		     parsed_row = {
			 "wp": +row.wp*100.,
			 "wpa": +row.wpa*100.,
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
