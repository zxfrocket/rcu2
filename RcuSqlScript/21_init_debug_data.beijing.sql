USE rcu ;

/*if_in*/
UPDATE RCU_ROOM_STATE SET if_in = 0 WHERE room_id = 501;
UPDATE RCU_ROOM_STATE SET if_in = 1 WHERE room_id = 502;
/*card*/
UPDATE RCU_ROOM_STATE SET card = 0 WHERE room_id = 501;
UPDATE RCU_ROOM_STATE SET card = 1 WHERE room_id = 502;
/*busy*/
UPDATE RCU_ROOM_STATE SET busy = 0 WHERE room_id = 501;
UPDATE RCU_ROOM_STATE SET busy = 1 WHERE room_id = 502;
/*wind_level*/
UPDATE RCU_ROOM_STATE SET wind_level = 1 WHERE room_id = 501;
UPDATE RCU_ROOM_STATE SET wind_level = 2 WHERE room_id = 502;
UPDATE RCU_ROOM_STATE SET wind_level = 4 WHERE room_id = 503;
UPDATE RCU_ROOM_STATE SET wind_level = 8 WHERE room_id = 504;
UPDATE RCU_ROOM_STATE SET wind_level = 0 WHERE room_id = 505;
/*valve_state*/
UPDATE RCU_ROOM_STATE SET valve_state = 0 WHERE room_id = 501;
UPDATE RCU_ROOM_STATE SET valve_state = 1 WHERE room_id = 502;
UPDATE RCU_ROOM_STATE SET valve_state = 2 WHERE room_id = 503;
UPDATE RCU_ROOM_STATE SET valve_state = 3 WHERE room_id = 504;
/*temp*/
UPDATE RCU_ROOM_STATE SET setting_temp = 22 WHERE room_id = 501;
UPDATE RCU_ROOM_STATE SET room_temp = 28 WHERE room_id = 501;
UPDATE RCU_ROOM_STATE SET setting_temp = 29 WHERE room_id = 502;
UPDATE RCU_ROOM_STATE SET room_temp = 30 WHERE room_id = 502;
/*suite room*/
UPDATE RCU_ROOM_STATE SET suite_id = 504 WHERE room_id = 504;
UPDATE RCU_ROOM_STATE SET suite_id = 504 WHERE room_id = 505;
UPDATE RCU_ROOM_STATE SET suite_id = 504 WHERE room_id = 506;
UPDATE RCU_ROOM_STATE SET suite_id = 504 WHERE room_id = 507;
/*ctrl mode*/
UPDATE RCU_ROOM_STATE SET ctrl_mode = 1 WHERE room_id = 501;
UPDATE RCU_ROOM_STATE SET ctrl_mode = 2 WHERE room_id = 502;
/*season mode*/
UPDATE RCU_ROOM_STATE SET season_mode = 1 WHERE room_id = 501;
UPDATE RCU_ROOM_STATE SET season_mode = 2 WHERE room_id = 502;
UPDATE RCU_ROOM_STATE SET season_mode = 4 WHERE room_id = 503;
/*set_wind_level*/
UPDATE RCU_ROOM_STATE SET set_wind_level = 1 WHERE room_id = 501;
UPDATE RCU_ROOM_STATE SET set_wind_level = 2 WHERE room_id = 502;
UPDATE RCU_ROOM_STATE SET set_wind_level = 4 WHERE room_id = 503;
UPDATE RCU_ROOM_STATE SET set_wind_level = 8 WHERE room_id = 504;
UPDATE RCU_ROOM_STATE SET set_wind_level = 0 WHERE room_id = 505;
/*light_state*/
UPDATE RCU_ROOM_STATE SET light_state_1 = 1 WHERE room_id = 501;
UPDATE RCU_ROOM_STATE SET light_state_2 = 1 WHERE room_id = 501;
UPDATE RCU_ROOM_STATE SET light_state_3 = 1 WHERE room_id = 501;
UPDATE RCU_ROOM_STATE SET light_state_4 = 1 WHERE room_id = 501;
/*card_delay*/
UPDATE RCU_ROOM_STATE SET card_delay = 1 WHERE room_id = 501;
UPDATE RCU_ROOM_STATE SET card_delay = 2 WHERE room_id = 502;
UPDATE RCU_ROOM_STATE SET card_delay = 3 WHERE room_id = 503;
UPDATE RCU_ROOM_STATE SET card_delay = 4 WHERE room_id = 504;
UPDATE RCU_ROOM_STATE SET card_delay = 5 WHERE room_id = 505;
UPDATE RCU_ROOM_STATE SET card_delay = 6 WHERE room_id = 506;
UPDATE RCU_ROOM_STATE SET card_delay = 7 WHERE room_id = 507;
UPDATE RCU_ROOM_STATE SET card_delay = 8 WHERE room_id = 508;
UPDATE RCU_ROOM_STATE SET card_delay = 9 WHERE room_id = 509;
UPDATE RCU_ROOM_STATE SET card_delay = 10 WHERE room_id = 510;
UPDATE RCU_ROOM_STATE SET card_delay = 0 WHERE room_id = 511;
/*temp_comp*/
UPDATE RCU_ROOM_STATE SET temp_comp = 1 WHERE room_id = 501;
UPDATE RCU_ROOM_STATE SET temp_comp = 2 WHERE room_id = 502;
UPDATE RCU_ROOM_STATE SET temp_comp = 3 WHERE room_id = 503;
UPDATE RCU_ROOM_STATE SET temp_comp = 4 WHERE room_id = 504;
UPDATE RCU_ROOM_STATE SET temp_comp = 5 WHERE room_id = 505;
UPDATE RCU_ROOM_STATE SET temp_comp = 129 WHERE room_id = 506;
UPDATE RCU_ROOM_STATE SET temp_comp = 130 WHERE room_id = 507;
UPDATE RCU_ROOM_STATE SET temp_comp = 131 WHERE room_id = 508;
UPDATE RCU_ROOM_STATE SET temp_comp = 132 WHERE room_id = 509;
UPDATE RCU_ROOM_STATE SET temp_comp = 133 WHERE room_id = 510;
UPDATE RCU_ROOM_STATE SET temp_comp = 0 WHERE room_id = 511;
/*run_time*/
UPDATE RCU_ROOM_STATE SET run_time = 10 WHERE room_id = 501;
UPDATE RCU_ROOM_STATE SET run_time = 15 WHERE room_id = 502;
UPDATE RCU_ROOM_STATE SET run_time = 20 WHERE room_id = 503;
UPDATE RCU_ROOM_STATE SET run_time = 25 WHERE room_id = 504;
UPDATE RCU_ROOM_STATE SET run_time = 30 WHERE room_id = 505;
UPDATE RCU_ROOM_STATE SET run_time = 35 WHERE room_id = 506;
UPDATE RCU_ROOM_STATE SET run_time = 40 WHERE room_id = 507;
UPDATE RCU_ROOM_STATE SET run_time = 45 WHERE room_id = 508;
UPDATE RCU_ROOM_STATE SET run_time = 50 WHERE room_id = 509;
UPDATE RCU_ROOM_STATE SET run_time = 55 WHERE room_id = 510;
UPDATE RCU_ROOM_STATE SET run_time = 60 WHERE room_id = 511;
/*stop_time*/
UPDATE RCU_ROOM_STATE SET stop_time = 10 WHERE room_id = 501;
UPDATE RCU_ROOM_STATE SET stop_time = 15 WHERE room_id = 502;
UPDATE RCU_ROOM_STATE SET stop_time = 20 WHERE room_id = 503;
UPDATE RCU_ROOM_STATE SET stop_time = 25 WHERE room_id = 504;
UPDATE RCU_ROOM_STATE SET stop_time = 30 WHERE room_id = 505;
UPDATE RCU_ROOM_STATE SET stop_time = 35 WHERE room_id = 506;
UPDATE RCU_ROOM_STATE SET stop_time = 40 WHERE room_id = 507;
UPDATE RCU_ROOM_STATE SET stop_time = 45 WHERE room_id = 508;
UPDATE RCU_ROOM_STATE SET stop_time = 50 WHERE room_id = 509;
UPDATE RCU_ROOM_STATE SET stop_time = 55 WHERE room_id = 510;
UPDATE RCU_ROOM_STATE SET stop_time = 60 WHERE room_id = 511;
/*door_clock*/
UPDATE RCU_ROOM_STATE SET door_clock = 1 WHERE room_id = 501;
UPDATE RCU_ROOM_STATE SET door_clock = 2 WHERE room_id = 502;
/*in_wind_level*/
UPDATE RCU_ROOM_STATE SET in_wind_level = 0x11 WHERE room_id = 501;
UPDATE RCU_ROOM_STATE SET in_wind_level = 0x22 WHERE room_id = 502;
UPDATE RCU_ROOM_STATE SET in_wind_level = 0x44 WHERE room_id = 503;
UPDATE RCU_ROOM_STATE SET in_wind_level = 0x88 WHERE room_id = 504;

COMMIT;
