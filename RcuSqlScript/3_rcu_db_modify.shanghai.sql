/*********************修改触发器*************************/
USE rcu;
BEGIN;

DROP TABLE IF EXISTS RCU_TEMP_RECORD1;
CREATE TABLE RCU_TEMP_RECORD1 (
room_id int not null,
date_time DATETIME not null , 
room_temp int not null default 23,
PRIMARY KEY (room_id,date_time),
FOREIGN KEY (room_id) REFERENCES RCU_ROOM_STATE(room_id) ); 

DROP TABLE IF EXISTS RCU_TEMP_RECORD2;
CREATE TABLE RCU_TEMP_RECORD2 (
room_id int not null,
date_time DATETIME not null , 
room_temp int not null default 23,
PRIMARY KEY (room_id,date_time),
FOREIGN KEY (room_id) REFERENCES RCU_ROOM_STATE(room_id) ); 


DELETE FROM RCU_TEMP_RECORD1;
DELETE FROM RCU_TEMP_RECORD2;
DROP PROCEDURE IF EXISTS createTableProc1;
CREATE PROCEDURE createTableProc1()
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
            PREPARE stmt1 FROM "INSERT INTO RCU_TEMP_RECORD1 (room_id,date_time) VALUES(?,'2011-12-31 23:59:59')" ;
            /*PRINT @sqlStr;*/
            EXECUTE stmt1 USING @roomID;
            PREPARE stmt2 FROM "INSERT INTO RCU_TEMP_RECORD2 (room_id,date_time) VALUES(?,'2011-12-31 23:59:59')" ;
            /*PRINT @sqlStr;*/
            EXECUTE stmt2 USING @roomID;
            SET @roomNo = @roomNo + 1;
         END WHILE;
         SET @floorNo = @floorNo + 1;
    END WHILE;
END;

CALL createTableProc1();

COMMIT;

drop trigger trgRoomStateChg;
create trigger trgRoomStateChg
AFTER UPDATE
on RCU_ROOM_STATE
FOR EACH ROW 
BEGIN
    IF NEW.room_temp <> OLD.room_temp THEN
       INSERT INTO RCU_TEMP_RECORD(room_id,date_time,room_temp) VALUES (NEW.room_id,now(),NEW.room_temp);
    END IF; 
    IF NEW.room_temp1 <> OLD.room_temp1 THEN
       INSERT INTO RCU_TEMP_RECORD1(room_id,date_time,room_temp) VALUES (NEW.room_id,now(),NEW.room_temp1);
    END IF; 
    IF NEW.room_temp2 <> OLD.room_temp2 THEN
       INSERT INTO RCU_TEMP_RECORD2(room_id,date_time,room_temp) VALUES (NEW.room_id,now(),NEW.room_temp2);
    END IF;  
/*对于各种set命令(包括自检命令，只有轮询命令，工单表才自动将state变为2)，修改RCU_WORK_ORDER中的order_state，由1变成2*/
    UPDATE RCU_WORK_ORDER SET order_state = 2 WHERE room_id = NEW.room_id and cmd = NEW.cmd and order_type = 1 and order_state = 1 ;  
END;
