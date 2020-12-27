USE rcu;
BEGIN;
DROP PROCEDURE IF EXISTS addFieldProc;
CREATE PROCEDURE addFieldProc()
BEGIN

DECLARE num INT;  

/*if_link*/
select count(*) INTO @num from information_schema.COLUMNS
where TABLE_SCHEMA='rcu'
and TABLE_NAME='RCU_ROOM_STATE'
and column_name = 'if_link';
IF @num = 0 THEN
	ALTER TABLE RCU_ROOM_STATE ADD if_link int NOT NULL DEFAULT 0;
ELSE
	ALTER TABLE RCU_ROOM_STATE MODIFY if_link int NOT NULL DEFAULT 0;
END IF;

/*set_link*/
select count(*) INTO @num from information_schema.COLUMNS
where TABLE_SCHEMA='rcu'
and TABLE_NAME='RCU_ROOM_STATE'
and column_name = 'set_link';
IF @num = 0 THEN
	ALTER TABLE RCU_ROOM_STATE ADD set_link int NOT NULL DEFAULT 0;
ELSE
	ALTER TABLE RCU_ROOM_STATE MODIFY set_link int NOT NULL DEFAULT 0;
END IF;

/*suite_name*/
select count(*) INTO @num from information_schema.COLUMNS
where TABLE_SCHEMA='rcu'
and TABLE_NAME='RCU_ROOM_STATE'
and column_name = 'suite_name';
IF @num = 0 THEN
	ALTER TABLE RCU_ROOM_STATE ADD suite_name varchar(100) NOT NULL DEFAULT 'xx';
ELSE
	ALTER TABLE RCU_ROOM_STATE MODIFY suite_name varchar(100) NOT NULL DEFAULT 'xx';
END IF;
UPDATE RCU_ROOM_STATE set suite_name = suite_id;

/*air_temp_set*/
select count(*) INTO @num from information_schema.COLUMNS
where TABLE_SCHEMA='rcu'
and TABLE_NAME='RCU_ROOM_STATE'
and column_name = 'air_temp_set';
IF @num = 0 THEN
	ALTER TABLE RCU_ROOM_STATE ADD air_temp_set int NOT NULL DEFAULT 0;
ELSE
	ALTER TABLE RCU_ROOM_STATE MODIFY air_temp_set int NOT NULL DEFAULT 0;
END IF;

/*temp_addr_set*/
select count(*) INTO @num from information_schema.COLUMNS
where TABLE_SCHEMA='rcu'
and TABLE_NAME='RCU_ROOM_STATE'
and column_name = 'temp_addr_set';
IF @num = 0 THEN
	ALTER TABLE RCU_ROOM_STATE ADD temp_addr_set int NOT NULL DEFAULT 0;
ELSE
	ALTER TABLE RCU_ROOM_STATE MODIFY temp_addr_set int NOT NULL DEFAULT 0;
END IF;

END;

CALL addFieldProc();

COMMIT;                  