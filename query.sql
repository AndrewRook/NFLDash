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

/* Full production query: */
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
