from __future__ import print_function, division


import nflwin.model
import nflwin.utilities
import numpy as np
import pandas as pd

def query_db_players():
    "Make the database query for player information."

    engine = nflwin.utilities.connect_nfldb()

    sql_string = "select player_id, full_name, position from player"
    #sql_string += " limit 10"
    sql_string += ";"

    player_df = pd.read_sql(sql_string, engine)
    
    return player_df

def query_db_plays():
    "Make the database query for play data."

    engine = nflwin.utilities.connect_nfldb()

    sql_string = ("select play.gsis_id, "
                  "play.drive_id, "
                  "play.play_id, "
                  "play.down, "
                  "(play.time).phase as quarter, "
                  "(play.time).elapsed as seconds_elapsed, "
                  "(play.yardline).pos as yardline, "
                  "play.yards_to_go, "
                  "play.description, "
                  "play.pos_team as offense_team, "
                  "game.home_team, "
                  "game.away_team, "
                  )
    sql_string += ("greatest((agg_play.fumbles_rec_tds * 6), (agg_play.kicking_rec_tds * 6), (agg_play.passing_tds * 6), (agg_play.receiving_tds * 6), (agg_play.rushing_tds * 6), (agg_play.kicking_xpmade * 1), (agg_play.passing_twoptm * 2), (agg_play.receiving_twoptm * 2), (agg_play.rushing_twoptm * 2), (agg_play.kicking_fgm * 3)) as offense_play_points, "
                   "greatest((agg_play.defense_frec_tds * 6), (agg_play.defense_int_tds * 6), (agg_play.defense_misc_tds * 6), (agg_play.kickret_tds * 6), (agg_play.puntret_tds * 6), (agg_play.defense_safe * 2)) as defense_play_points, ")
    sql_string += "agg_player.player_ids "
    sql_string += "from play "
    sql_string += ("inner join (select gsis_id, drive_id, play_id, array_agg(player_id) as player_ids "
                   "from play_player "
                   "group by (play_player.gsis_id, play_player.drive_id, play_player.play_id) "
                   ") agg_player "
                   )
    sql_string += ("on play.gsis_id = agg_player.gsis_id "
                   "and play.drive_id = agg_player.drive_id "
                   "and play.play_id = agg_player.play_id "
                   )
    sql_string += ("inner join game on play.gsis_id = game.gsis_id ")
    sql_string += ("inner join agg_play on play.gsis_id = agg_play.gsis_id and play.drive_id = agg_play.drive_id and play.play_id = agg_play.play_id ")
    sql_string += " limit 10"
    sql_string += ";"

    plays_df = pd.read_sql(sql_string, engine)
    plays_df['down'] = plays_df['down'].fillna(value=0).astype(np.int8)
    plays_df = nflwin.utilities._aggregate_nfldb_scores(plays_df)

    wpmodel = nflwin.model.WPModel.load_model()
    wp = wpmodel.predict_wp(plays_df)
    plays_df["wp"] = wp
    print(plays_df)
    return plays_df
    
if __name__ == "__main__":
    plays_df = query_db_plays()
    plays_df.to_csv("plays.csv", index=False)
    #player_df = query_db_players()
    #player_df.to_csv("players.csv", index=False)
