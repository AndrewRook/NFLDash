/* Demo query used to pick out play types: */
select play.yardline, play.time, play.yards_to_go,
(case when agg_play.passing_att = 1 or agg_play.defense_sk = 1 or agg_play.passing_twopta = 1
      or play.description like '%sacked%' then 'pass'
      when agg_play.rushing_att = 1 or agg_play.rushing_twopta = 1 then 'run'
      when agg_play.kicking_xpa = 1 or play.description like '%extra point is Aborted%' then 'xp attempt'
      when agg_play.kicking_fga = 1 then 'fg attempt'
      when play.penalty >= 1 or play.description like '%Penalty%' then 'penalty'
      when agg_play.punting_tot > 0 or agg_play.punting_blk = 1 then 'punt'
      when agg_play.kicking_tot > 0 then 'kickoff'
      else 'unknown'
end) as play_type,
play.description
from play
inner join agg_play on play.gsis_id = agg_play.gsis_id and play.drive_id = agg_play.drive_id and play.play_id = agg_play.play_id
where play.timeout = 0 and play.description not like 'END QUARTER%'
and play.description not like 'Two-Minute Warning'
and play.description not like 'END GAME'
and play.description not like 'End of %'
and play.description not like 'Timeout at%'
and play.description not like '(_:__)'
and play.description not like '(__:__)'
and agg_play.passing_att = 0 and agg_play.rushing_att = 0 and agg_play.kicking_xpa = 0 and agg_play.kicking_fga = 0 and agg_play.defense_sk = 0 and play.penalty = 0 and agg_play.punting_tot = 0 and agg_play.kicking_tot = 0 and agg_play.passing_twopta = 0 and agg_play.rushing_twopta = 0 and play.description not like '%Penalty%' and agg_play.punting_blk = 0 and play.description not like '%sacked%' and play.description not like '%extra point is Aborted%'
limit 10;

/* Testing getting player ids */
select pp.drive_id,
(array_agg((play.time).phase))[1] as quarter, (array_agg((play.time).elapsed::int))[1] as seconds_elapsed,
(array_agg((play.yardline).pos::int))[1] as yardline,
(array_agg(play.yards_to_go))[1] as yards_to_go,
array_agg(pp.player_id) as player_ids
from play_player pp
inner join play on pp.gsis_id = play.gsis_id and pp.drive_id = play.drive_id and pp.play_id = play.play_id
group by (pp.gsis_id, pp.drive_id, pp.play_id) limit 10;

/* oh hey, a subquery is a little cleaner looking. could be slow though... */
select play.drive_id, (play.time).phase as quarter, (play.time).elapsed as seconds_elapsed, (play.yardline).pos as yardline, play.yards_to_go, agg_player.player_ids
from play
inner join (select gsis_id, drive_id, play_id, array_agg(player_id) as player_ids
      	   from play_player
	   group by (play_player.gsis_id, play_player.drive_id, play_player.play_id)
	   ) agg_player
on play.gsis_id = agg_player.gsis_id and play.drive_id = agg_player.drive_id and play.play_id = agg_player.play_id
limit 10;

/* Full production query. Contains:
yardline (-50 to 50)
time (quarter, second tuple, needs to be broken up)
yards_to_go
play_type (run, pass, etc. There are a very tiny fraction of plays classified as unknown, which can probably be filtered out of the dashboard at some point (but WPA would need to be computed first)
description (the full text of the play)

To be included:
offensive team
home team
away team
season year
week
home/away records?
yards gained?
sacks?
fumbles/ints?
first down conversions
players involved
*/
select play.yardline, play.time, play.yards_to_go,
(case when agg_play.passing_att = 1 or agg_play.defense_sk = 1 or agg_play.passing_twopta = 1
      or play.description like '%sacked%' then 'pass'
      when agg_play.rushing_att = 1 or agg_play.rushing_twopta = 1 then 'run'
      when agg_play.kicking_xpa = 1 or play.description like '%extra point is Aborted%' then 'xp attempt'
      when agg_play.kicking_fga = 1 then 'fg attempt'
      when play.penalty >= 1 or play.description like '%Penalty%' then 'penalty'
      when agg_play.punting_tot > 0 or agg_play.punting_blk = 1 then 'punt'
      when agg_play.kicking_tot > 0 then 'kickoff'
      else 'unknown'
end) as play_type,
play.description
from play
inner join agg_play on play.gsis_id = agg_play.gsis_id and play.drive_id = agg_play.drive_id and play.play_id = agg_play.play_id
where play.timeout = 0 and play.description not like 'END QUARTER%'
and play.description not like 'Two-Minute Warning'
and play.description not like 'END GAME'
and play.description not like 'End of %'
and play.description not like 'Timeout at%'
and play.description not like '(_:__)'
and play.description not like '(__:__)'

