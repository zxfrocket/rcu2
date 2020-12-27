BEGIN;
DROP DATABASE IF EXISTS rcu;
CREATE DATABASE IF NOT EXISTS rcu 
DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
GRANT ALL PRIVILEGES
ON rcu.*
TO 'rcu_admin'@'localhost'
IDENTIFIED BY 'rcu_admin';
GRANT ALL PRIVILEGES
ON rcu.*
TO 'rcu_vistor'@'%'
IDENTIFIED BY 'rcu_vistor';
COMMIT;

/*********************创建不可修改的表*************************/
USE rcu;
BEGIN;
DROP TABLE IF EXISTS RCU_TEMP_RECORD;
DROP TABLE IF EXISTS RCU_ALL_LOG;
DROP TABLE IF EXISTS RCU_LIGHT_NAME;
DROP TABLE IF EXISTS RCU_ROOM_STATE;
DROP TABLE IF EXISTS RCU_BULB_POSITION;
DROP TABLE IF EXISTS RCU_BAND_POSITION;
DROP TABLE IF EXISTS RCU_PARA_DEFINE;

/*总日志，包括了工单，串口接收数据的总和*/
CREATE TABLE RCU_ALL_LOG (
log_id SERIAL,
username varchar(20),
log_type int not null,/*0接收，1发送*/
log_time DATETIME not null,/*时间*/                                                           
log_data varchar(200),
PRIMARY KEY(log_id));

/*suite_id的初始状态与room_id一样，但是每当合并房间后，
suite_id的值就是合并房间后的第一个id
例如：
room_id     suite_id
101         101
102         101
103         101
上面的数据就表示,101,102,103合并后，用101表示套间的id,
这个表这样设计，是根据一个经典表“雇员信息”，那个表中，列出了所有雇员的id(相当于room_id)
和该雇员的直接主管的id(相当于suite_id)，
如果有了合并房间，那么room_name和room_desc就只以suite_id的为准，其余在suite_id范围内
的其他room_name和room_desc就不显示了，也就是说,room_name和room_desc是以suite_id为单位的
*/
CREATE TABLE RCU_ROOM_STATE(
room_id int NOT NULL DEFAULT 0,
suite_id int NOT NULL DEFAULT 0,
room_name varchar(100) NOT NULL,
room_desc varchar(1000) DEFAULT '标准间',
room_type int not null default 0,
if_have int NOT NULL DEFAULT 1,
if_comp int NOT NULL DEFAULT 0,
cmd int NULL DEFAULT 0,
break_count INT NOT NULL DEFAULT 0,
/*常用字段*/
holder int NULL DEFAULT 0,/*占位状态，无意义*/
/*8008返回字段*/
card int NULL DEFAULT 0,
busy int NULL DEFAULT 0,
setting_temp int NULL DEFAULT 20,
room_temp int NULL DEFAULT 20,
wind_level int NULL DEFAULT 1,
valve_state int NULL DEFAULT 1,
setting_temp1 int NULL DEFAULT 20,
room_temp1 int NULL DEFAULT 20,
wind_level1 int NULL DEFAULT 1,
valve_state1 int NULL DEFAULT 1,
setting_temp2 int NULL DEFAULT 20,
room_temp2 int NULL DEFAULT 20,
wind_level2 int NULL DEFAULT 1,
valve_state2 int NULL DEFAULT 1,
geotherm_state int NULL DEFAULT 0,
geotherm_temp int NULL DEFAULT 30,
setting_geotherm int NULL DEFAULT 30,
door_clock int NULL DEFAULT 1,
/*入住设置*/
if_in int NULL DEFAULT 0,/*是否有客人入住(opera返回)*/
in_setting_temp int NULL DEFAULT 22,
in_wind_level int NULL DEFAULT 0x11,/*低速*/
in_welcome_level int NULL DEFAULT 0x11,/*欢迎风机风速*/
/*一些设置字段*/
/*插卡延迟*/
card_delay int NULL DEFAULT 1,
/*温度设置*/
temp_ctrl_dn int NULL DEFAULT 16,
temp_ctrl_up int NULL DEFAULT 22,
temp_hold_dn int NULL DEFAULT 16,
temp_hold_up int NULL DEFAULT 22,
/*模式设置*/
ctrl_mode int NULL DEFAULT 1,
season_mode int NULL DEFAULT 1,
/*风机设置*/
run_time int NULL DEFAULT 5,
stop_time int NULL DEFAULT 5,
set_wind_level int NULL DEFAULT 1,
/*温度补偿*/
temp_comp int NULL DEFAULT 0,
/*地热设置*/
set_geotherm_state int NULL DEFAULT 0,
set_geotherm_yes int NULL DEFAULT 30,
set_geotherm_no int NULL DEFAULT 25,
/*删除远程灯组控制的状态，因为这个状态直接反应在light_state上*/
light_state_1 int NULL DEFAULT 0,
light_state_10 int NULL DEFAULT 0,
light_state_11 int NULL DEFAULT 0,
light_state_12 int NULL DEFAULT 0,
light_state_13 int NULL DEFAULT 0,
light_state_14 int NULL DEFAULT 0,
light_state_15 int NULL DEFAULT 0,
light_state_16 int NULL DEFAULT 0,
light_state_17 int NULL DEFAULT 0,
light_state_18 int NULL DEFAULT 0,
light_state_19 int NULL DEFAULT 0,
light_state_2 int NULL DEFAULT 0,
light_state_20 int NULL DEFAULT 0,
light_state_21 int NULL DEFAULT 0,
light_state_22 int NULL DEFAULT 0,
light_state_23 int NULL DEFAULT 0,
light_state_24 int NULL DEFAULT 0,
light_state_25 int NULL DEFAULT 0,
light_state_26 int NULL DEFAULT 0,
light_state_27 int NULL DEFAULT 0,
light_state_28 int NULL DEFAULT 0,
light_state_29 int NULL DEFAULT 0,
light_state_3 int NULL DEFAULT 0,
light_state_30 int NULL DEFAULT 0,
light_state_31 int NULL DEFAULT 0,
light_state_32 int NULL DEFAULT 0,
light_state_4 int NULL DEFAULT 0,
light_state_5 int NULL DEFAULT 0,
light_state_6 int NULL DEFAULT 0,
light_state_7 int NULL DEFAULT 0,
light_state_8 int NULL DEFAULT 0,
light_state_9 int NULL DEFAULT 0,
light_day_1 int NULL DEFAULT 0,
light_day_10 int NULL DEFAULT 0,
light_day_11 int NULL DEFAULT 0,
light_day_12 int NULL DEFAULT 0,
light_day_13 int NULL DEFAULT 0,
light_day_14 int NULL DEFAULT 0,
light_day_15 int NULL DEFAULT 0,
light_day_16 int NULL DEFAULT 0,
light_day_17 int NULL DEFAULT 0,
light_day_18 int NULL DEFAULT 0,
light_day_19 int NULL DEFAULT 0,
light_day_2 int NULL DEFAULT 0,
light_day_20 int NULL DEFAULT 0,
light_day_21 int NULL DEFAULT 0,
light_day_22 int NULL DEFAULT 0,
light_day_23 int NULL DEFAULT 0,
light_day_24 int NULL DEFAULT 0,
light_day_25 int NULL DEFAULT 0,
light_day_26 int NULL DEFAULT 0,
light_day_27 int NULL DEFAULT 0,
light_day_28 int NULL DEFAULT 0,
light_day_29 int NULL DEFAULT 0,
light_day_3 int NULL DEFAULT 0,
light_day_30 int NULL DEFAULT 0,
light_day_31 int NULL DEFAULT 0,
light_day_32 int NULL DEFAULT 0,
light_day_4 int NULL DEFAULT 0,
light_day_5 int NULL DEFAULT 0,
light_day_6 int NULL DEFAULT 0,
light_day_7 int NULL DEFAULT 0,
light_day_8 int NULL DEFAULT 0,
light_day_9 int NULL DEFAULT 0,
light_night_1 int NULL DEFAULT 0,
light_night_10 int NULL DEFAULT 0,
light_night_11 int NULL DEFAULT 0,
light_night_12 int NULL DEFAULT 0,
light_night_13 int NULL DEFAULT 0,
light_night_14 int NULL DEFAULT 0,
light_night_15 int NULL DEFAULT 0,
light_night_16 int NULL DEFAULT 0,
light_night_17 int NULL DEFAULT 0,
light_night_18 int NULL DEFAULT 0,
light_night_19 int NULL DEFAULT 0,
light_night_2 int NULL DEFAULT 0,
light_night_20 int NULL DEFAULT 0,
light_night_21 int NULL DEFAULT 0,
light_night_22 int NULL DEFAULT 0,
light_night_23 int NULL DEFAULT 0,
light_night_24 int NULL DEFAULT 0,
light_night_25 int NULL DEFAULT 0,
light_night_26 int NULL DEFAULT 0,
light_night_27 int NULL DEFAULT 0,
light_night_28 int NULL DEFAULT 0,
light_night_29 int NULL DEFAULT 0,
light_night_3 int NULL DEFAULT 0,
light_night_30 int NULL DEFAULT 0,
light_night_31 int NULL DEFAULT 0,
light_night_32 int NULL DEFAULT 0,
light_night_4 int NULL DEFAULT 0,
light_night_5 int NULL DEFAULT 0,
light_night_6 int NULL DEFAULT 0,
light_night_7 int NULL DEFAULT 0,
light_night_8 int NULL DEFAULT 0,
light_night_9 int NULL DEFAULT 0,
/*删除远程空调控制valve_state_set和wind_level_set，因为空调设置后的状态，直接反应到了空调状态本身*/
PRIMARY KEY(room_id),
FOREIGN KEY (suite_id) REFERENCES RCU_ROOM_STATE(room_id));

CREATE TABLE RCU_TEMP_RECORD (
room_id int not null,
date_time DATETIME not null , 
room_temp int not null default 23,
PRIMARY KEY (room_id,date_time),
FOREIGN KEY (room_id) REFERENCES RCU_ROOM_STATE(room_id) );        

CREATE TABLE RCU_LIGHT_NAME(
room_id int NOT NULL DEFAULT 0,
light_index int NOT NULL,
light_name varchar(100) NULL,
PRIMARY KEY(room_id,light_index),
FOREIGN KEY(room_id) REFERENCES RCU_ROOM_STATE(room_id));

CREATE TABLE RCU_BULB_POSITION(
room_id int not null,
idx int not null,/*哪个灯，0指light1,1指light2*/
loc int not null,/*在canvas上画灯的顺序*/
x int not null ,
y int not null ,
w int not null ,
h int not null );
CREATE UNIQUE INDEX I_RCU_BULB_POSITION ON RCU_BULB_POSITION(room_id, idx, loc);

CREATE TABLE RCU_BAND_POSITION(
room_id int not null,
idx int not null,
loc int not null,
pos int not null,/*灯带点的顺序，0第一个点，以次类推*/
x int not null,
y int not null);
CREATE UNIQUE INDEX I_RCU_BAND_POSITION ON RCU_BAND_POSITION(room_id, idx, loc,pos);

CREATE TABLE RCU_PARA_DEFINE (
para_name varchar(20) not null,
para_value int not null  , 
para_desc varchar(20) not null,
PRIMARY KEY (para_name,para_value));

COMMIT;

/****************************创建不可修改的存储过程**********************/
USE rcu;
DELETE FROM RCU_LIGHT_NAME;
DELETE FROM RCU_ROOM_STATE;
DELETE FROM RCU_TEMP_RECORD;
DELETE FROM RCU_PARA_DEFINE WHERE para_name in ('p_floor_no','p_room_no');
DROP PROCEDURE IF EXISTS createTableProc;
CREATE PROCEDURE createTableProc()
BEGIN
    DECLARE floorNo int;
    DECLARE roomNo int;
    DECLARE roomID int;
    DECLARE roomName varchar(8);
    DECLARE floorNoName varchar(8); 
    DECLARE roomNoName varchar(8);
    DECLARE beginFloorNo int;
    DECLARE beginRoomNo int;
    DECLARE endFloorNo int;
    DECLARE endRoomNo int;
    DECLARE lightNum int;
    DECLARE lightIndex int;
    DECLARE lightName varchar(8);
    SET @beginFloorNo = 27 ;
    SET @beginRoomNo = 1 ;
    SET @endFloorNo = 60 ;
    SET @endRoomNo = 40 ;
    SET @lightNum = 32 ;
    SET @lightIndex = 0 ;
    SET @floorNo = @beginFloorNo ;
    WHILE @floorNo <= @endFloorNo DO 
         SET @roomNo = @beginRoomNo;          
         WHILE @roomNo <= @endRoomNo DO 
            SET @roomID = @floorNo*100 + @roomNo ;
            IF @roomID <= 999 THEN 
                SET @roomName = CONCAT('0', (SELECT CAST(@roomID AS CHAR(3))) );
            ELSE 
                SET @roomName = (SELECT CAST(@roomID AS CHAR(4)));
            END  IF;
            PREPARE stmt1 FROM "INSERT INTO RCU_ROOM_STATE (room_id,suite_id,room_name) VALUES(?,?,?)";
            PREPARE stmt2 FROM "INSERT INTO RCU_TEMP_RECORD (room_id,date_time) VALUES(?,'2011-12-31 23:59:59')" ;
            /*PRINT @sqlStr;*/
            EXECUTE stmt1 USING @roomID,@roomID,@roomName;
            EXECUTE stmt2 USING @roomID;
            IF @floorNo = @beginFloorNo THEN
                SET @roomNoName = CONCAT((SELECT CAST(@roomNo AS CHAR(2))), '单元');
                PREPARE stmt4 FROM "INSERT INTO RCU_PARA_DEFINE(para_name,para_value,para_desc) VALUES('p_room_no',?,?)";
                EXECUTE stmt4 USING @roomNo,@roomNoName;
            END IF;
            /*增加灯组名称*/
            SET @lightIndex = 0;
            WHILE @lightIndex < @lightNum DO
                SET @lightName = CONCAT('灯',(SELECT CAST(@lightIndex AS CHAR(2))));
                PREPARE stmt5 FROM "INSERT INTO RCU_LIGHT_NAME (room_id,light_index,light_name) VALUES(?,?,?)";
                EXECUTE stmt5 USING @roomID,@lightIndex,@lightName;
                SET @lightIndex = @lightIndex + 1;
            END WHILE;
            SET @roomNo = @roomNo + 1;
         END WHILE;
         SET @floorNoName = CONCAT((SELECT CAST(@floorNo AS CHAR(2))), '层');
         PREPARE stmt4 FROM "INSERT INTO RCU_PARA_DEFINE(para_name,para_value,para_desc) VALUES('p_floor_no',?,?)";
         EXECUTE stmt4 USING @floorNo,@floorNoName;
         SET @floorNo = @floorNo + 1;
    END WHILE;
END;

CALL createTableProc();

COMMIT;

/*****************************创建不可修改的触发器************************/
USE rcu;

create trigger trgRoomStateChg
AFTER UPDATE
on RCU_ROOM_STATE
FOR EACH ROW 
BEGIN
    IF NEW.room_temp <> OLD.room_temp THEN
       INSERT INTO RCU_TEMP_RECORD(room_id,date_time,room_temp) VALUES (NEW.room_id,now(),NEW.room_temp);
    END IF;  
/*对于各种set命令(包括自检命令，只有轮询命令，工单表才自动将state变为2)，修改RCU_WORK_ORDER中的order_state，由1变成2*/
    UPDATE RCU_WORK_ORDER SET order_state = 2 WHERE room_id = NEW.room_id and cmd = NEW.cmd and order_type = 1 and order_state = 1 ;  
END;

COMMIT;                  