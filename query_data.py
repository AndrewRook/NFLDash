from __future__ import print_function, division


import nflwin.model
import nflwin.utilities
import numpy as np
import pandas as pd

def query_db_players():
    "Make the database query for player information."

    engine = nflwin.utilities.connect_nfldb()

    sql_string = ("select player.player_id, player.full_name, player.position "
                  "from player "
                  "inner join play_player on player.player_id = play_player.player_id "
                  "group by (player.player_id, player.full_name, player.position) "
                  "having count(player.player_id) > 100 "
                  "order by player.full_name; ")
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
                  "case when game.season_type = 'Regular' then game.week when game.season_type = 'Postseason' then game.week+17 else 0 end as week, "
                  "game.season_year, "
                  )
    sql_string += ("greatest((agg_play.fumbles_rec_tds * 6), (agg_play.kicking_rec_tds * 6), (agg_play.passing_tds * 6), (agg_play.receiving_tds * 6), (agg_play.rushing_tds * 6), (agg_play.kicking_xpmade * 1), (agg_play.passing_twoptm * 2), (agg_play.receiving_twoptm * 2), (agg_play.rushing_twoptm * 2), (agg_play.kicking_fgm * 3)) as offense_play_points, "
                   "greatest((agg_play.defense_frec_tds * 6), (agg_play.defense_int_tds * 6), (agg_play.defense_misc_tds * 6), (agg_play.kickret_tds * 6), (agg_play.puntret_tds * 6), (agg_play.defense_safe * 2)) as defense_play_points, ")
    sql_string += "((game.home_score > game.away_score and play.pos_team = game.home_team) or (game.away_score > game.home_score and play.pos_team = game.away_team)) as offense_won, "
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
    sql_string += ("where play.pos_team != 'UNK'  and (play.time).phase not in ('Pregame', 'Half', 'Final') and game.season_type != 'Preseason' ")
    #sql_string += " limit 10000"
    sql_string += ";"

    plays_df = pd.read_sql(sql_string, engine)
    plays_df['down'] = plays_df['down'].fillna(value=0).astype(np.int8)
    plays_df = nflwin.utilities._aggregate_nfldb_scores(plays_df)

    wpmodel = nflwin.model.WPModel.load_model()
    wp = wpmodel.predict_wp(plays_df)
    plays_df["wp"] = wp
    plays_df = compute_wpa(plays_df)
    return plays_df

def compute_wpa(plays_df):
    next_gsis_id = plays_df["gsis_id"].values[1:]
    next_gsis_id = np.append(next_gsis_id, -999)
    next_play_id = plays_df["play_id"].values[1:]
    next_play_id = np.append(next_play_id, -999)
    next_play_wp = plays_df["wp"].values[1:]
    next_play_wp = np.append(next_play_wp, -999)
    next_play_offense = plays_df["offense_team"].values[1:]
    next_play_offense = np.append(next_play_offense, -999)

    
    plays_df["next_gsis_id"] = next_gsis_id
    plays_df["next_play_id"] = next_play_id
    plays_df["next_play_wp"] = next_play_wp
    plays_df["next_play_offense"] = next_play_offense
    # print(plays_df[["next_play_id", "play_id", "next_gsis_id", "gsis_id"]].head())
    # test = (plays_df["next_play_id"] < plays_df["play_id"]) & (plays_df["next_gsis_id"] == plays_df["gsis_id"])
    # print(test.head())
    plays_df = plays_df[(plays_df["next_play_id"] > plays_df["play_id"]) | (plays_df["next_gsis_id"] != plays_df["gsis_id"])].copy()
    plays_df["wpa"] = plays_df.apply(_compute_wpa_play, axis=1)
    plays_df.drop(labels=["next_gsis_id", "next_play_id", "next_play_wp", "next_play_offense"], axis=1, inplace=True)
    #next_play_id = [plays_df["gsis_id"].values.astype(np.str) + plays_df["drive_id"].values.astype(np.str) + plays_df["play_idf"].values.astype(np.str)
    return plays_df

def _compute_wpa_play(play):
    wpa = play.next_play_wp - play.wp
    if play.next_play_offense != play.offense_team:
        wpa = (1 - play.next_play_wp) - play.wp
    if play.next_play_id < play.play_id:
        if (play.quarter not in ["Q1", "Q2", "Q3"]) or play.seconds_elapsed < 800: #too much time left, missing plays
            wpa = 0
        elif play.offense_won == True:
            wpa = 1. - play.wp
        else:
            wpa = -1 * play.wp
    # if play.gsis_id == "2009082952" and (play.drive_id == 22 or play.drive_id == 23) and play.play_id >= 3864:
    #     print(play)
    #     print("  ",wpa)
    return wpa
    
if __name__ == "__main__":
    plays_df = query_db_plays()
    plays_df.to_csv("plays.csv", index=False)
    player_df = query_db_players()
    player_df.to_csv("players.csv", index=False)
