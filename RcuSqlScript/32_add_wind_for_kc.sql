/*
only run this process for update kc's existed database
北京中国大饭店又给加上了 wind_level_set 2018-10-16
*/
ALTER TABLE RCU_ROOM_STATE ADD wind_level_set int NULL DEFAULT 1 ;