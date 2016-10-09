var io = {
    load_plays: function(filename, progress_url, progress_bar_id, callback)
    {
	var max_progress_fraction = 0.30;
	var progress_increment = 0.05;
	//var count = 0;
	d3.csv(filename)
	    .row(function(row)
		 {
		     return row;
		 })
	    .on("progress", function (request)
		{
		    if(request.responseURL == progress_url)
		    {
			utilities.update_progress_bar(progress_bar_id, progress_increment, max_progress_fraction);
			// var curr_width = $(progress_bar_id).width();
			// var max_width = $(progress_bar_id).offsetParent().width();
			// var new_width = curr_width + progress_increment * max_width;
			// if (new_width < max_progress_fraction * max_width)
			// {
			//     $(progress_bar_id).width(new_width);
			// }
		    }
		})
	    .get(function(error, player_data)
		 {
		     //console.log(player_data[0]['season_year'], player_data.length, count)
		     callback(null, player_data);
		 })
    },
};
