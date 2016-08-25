from __future__ import print_function, division

import nflwin.utilities
import pandas as pd

def query_db():
    "Make the database query."

    engine = nflwin.utilities.connect_nfldb()

    sql_string = ("select play.drive_id, "
                  "(play.time).phase as quarter, "
                  "(play.time).elapsed as seconds_elapsed, "
                  "(play.yardline).pos as yardline, "
                  "play.yards_to_go, "
                  "play.description, "
                  "agg_player.player_ids "
                  )
    sql_string += ("from play "
                   "inner join (select gsis_id, drive_id, play_id, array_agg(player_id) as player_ids "
                   "from play_player "
                   "group by (play_player.gsis_id, play_player.drive_id, play_player.play_id) "
                   ") agg_player "
                   )
    sql_string += ("on play.gsis_id = agg_player.gsis_id "
                   "and play.drive_id = agg_player.drive_id "
                   "and play.play_id = agg_player.play_id "
                   )
    sql_string += "limit 10;"

    plays_df = pd.read_sql(sql_string, engine)

    plays_df.to_csv("wooo.csv", index=False)

    print(plays_df.head())
    
if __name__ == "__main__":
    query_db()
