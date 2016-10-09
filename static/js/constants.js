var constants = {
    
    team_mapping : {
	"NYJ": "New York Jets",
	"BUF": "Buffalo Bills",
	"NE": "New England Patriots",
	"MIA": "Miami Dolphins",
	"CLE": "Cleveland Browns",
	"CIN": "Cincinnati Bengals",
	"PIT": "Pittsburgh Steelers",
	"BAL": "Baltimore Ravens",
	"DEN": "Denver Broncos",
	"KC": "Kansas City Chiefs",
	"SD": "San Diego Chargers",
	"OAK": "Oakland Raiders",
	"JAC": "Jacksonville Jaguars",
	"IND": "Indianapolis Colts",
	"HOU": "Houston Texans",
	"TEN": "Tennessee Titans",
	"NYG": "New York Giants",
	"WAS": "Washington",
	"PHI": "Philadelphia Eagles",
	"DAL": "Dallas Cowboys",
	"GB": "Green Bay Packers",
	"MIN": "Minnesota Vikings",
	"CHI": "Chicago Bears",
	"DET": "Detroit Lions",
	"SEA": "Seattle Seahawks",
	"ARI": "Arizona Cardinals",
	"SF": "San Francisco 49ers",
	"STL": "St. Louis/Los Angeles Rams",
	"LA": "St. Louis/Los Angeles Rams",
	"NO": "New Orleans Saints",
	"ATL": "Atlanta Falcons",
	"TB": "Tampa Bay Buccaneers",
	"CAR": "Carolina Panthers"
    },
    column_name_mapping : [
	["Season", "season_year", "8%"],
	["Week", "week", "7%"],
	["Off", "offense_team_abbrev", "6%"],
	["Def", "defense_team_abbrev", "6%"],
	["Off Score", "off_score", "10%"],
	["Def Score", "def_score", "10%"],
	["Yardline", "yardline_text", "9%", "yardline"],
	["Down", "down", "7%"],
	["Dist", "yards_to_go", "6%"],
	["Qtr", "quarter", "6%"],
	["Description", "description", "25%"]],
};

var sorted_team_names = [];
var unique_team_names = {};
for (var key in constants.team_mapping)
{
    if (!(constants.team_mapping[key] in unique_team_names))
    {
	sorted_team_names.push(constants.team_mapping[key]);
	unique_team_names[constants.team_mapping[key]] = 1; 
    }
}
sorted_team_names = sorted_team_names.sort();

constants.sorted_team_names = sorted_team_names;
constants.unique_team_names = unique_team_names;
