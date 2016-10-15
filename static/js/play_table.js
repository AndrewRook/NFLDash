var play_table = {}

play_table.create_table = function(table_id, table_header_id, column_name_mapping, info_dict) {
    setTimeout(function () {
	var column_def_list = [];
	var column_count = 0;
	for (var i = 0; i < column_name_mapping.length; i++)
	{
	    $(table_header_id).append("<th>"+column_name_mapping[i][0]+"</th>");
	    var tempfunc = (
		function(i)
		{
		    return function(d)
		    {
			return d[column_name_mapping[i][1]];
		    }
		} )(i);
	    var param_dict = {
		targets: i,
		width: column_name_mapping[i][2],
		data: tempfunc
	    };
	    if (column_name_mapping[i].length > 3)
	    {
		param_dict["type"] = column_name_mapping[i][3];
	    }
	    column_def_list.push(param_dict);
	    column_count = column_count + 1;
	}
	var play_table_options = {
	    autoWidth: false,
	    columnDefs: column_def_list,
	    language: {"emptyTable": "Too many plays to display (> 1000)"}
	};
	var datatable = $(table_id).dataTable(play_table_options);
	info_dict.datatable = datatable;
    }, 50);
};
