USE rcu;
BEGIN;
DROP TABLE IF EXISTS RCU_CMD_LEN;
DROP TABLE IF EXISTS RCU_CMD_CONFIG ;
DROP TABLE IF EXISTS RCU_SET_CONFIG ;
DROP TABLE IF EXISTS RCU_CMD_CONTENT;
DROP TABLE IF EXISTS RCU_CMD_DEFINE;
DROP TABLE IF EXISTS RCU_DATA_DIRECTION;
DROP TABLE IF EXISTS RCU_GROUP_INFO;
DROP TABLE IF EXISTS RCU_GROUP_DEFINE;
DROP TABLE IF EXISTS RCU_TITLE_DEFINE;
DROP TABLE IF EXISTS RCU_USER_INFO;
DROP TABLE IF EXISTS RCU_ROOMTYPE_DESC;
DROP TABLE IF EXISTS RCU_CMD_FORMAT;
DROP TABLE IF EXISTS RCU_TOOLBAR_ITEMS;
DROP TABLE IF EXISTS RCU_TOOLBAR_DEFINE;
DROP TABLE IF EXISTS RCU_CONFIG_DEFINE;
DROP TABLE IF EXISTS RCU_CONFIG_PARAM;
DROP TABLE IF EXISTS RCU_WORK_DATA;
DROP TABLE IF EXISTS RCU_WORK_ORDER;
DROP TABLE IF EXISTS RCU_WORK_PRIORITY;

CREATE TABLE RCU_CMD_FORMAT(
fmt_name varchar(20) not null,
fmt_pos int not null,
fmt_val TINYINT UNSIGNED NOT NULL,
PRIMARY KEY (fmt_name,fmt_pos));

CREATE TABLE RCU_CMD_DEFINE (
cmd_name varchar(100) not null,
cmd_id int not null,
cmd_mean varchar(100) not null,
cmd_pos INT NOT NULL DEFAULT 0,
PRIMARY KEY (cmd_name),
UNIQUE (cmd_id));

CREATE TABLE RCU_TITLE_DEFINE (
title_id varchar(100) not null,
title_name varchar(100) not null,
title_desc varchar(20) default null,
PRIMARY KEY (title_id));

CREATE TABLE RCU_SET_CONFIG (    
set_id varchar(100) not null , 
cmd_data int NOT NULL,
set_define varchar(1000) NOT NULL,
PRIMARY KEY(set_id,cmd_data),
FOREIGN KEY(set_id) REFERENCES RCU_TITLE_DEFINE(title_id),
FOREIGN KEY(cmd_data) REFERENCES RCU_CMD_DEFINE(cmd_id));    

CREATE TABLE RCU_CMD_CONTENT (
cmd_name varchar(100) not null,
cmd_item varchar(100) not null,
cmd_pos int not null default 0,
PRIMARY KEY (cmd_name,cmd_item),
UNIQUE (cmd_name,cmd_pos),
FOREIGN KEY (cmd_name) REFERENCES RCU_CMD_DEFINE(cmd_name),
CHECK(cmd_pos >= 0));        

CREATE TABLE RCU_DATA_DIRECTION (
log_type int not null,
type_mean varchar(20));
CREATE UNIQUE INDEX I_RCU_DATA_DIRECTION ON RCU_DATA_DIRECTION(log_type);

CREATE TABLE RCU_CMD_LEN (
cmd_name varchar(100) not null,
cmd_direct INT NOT NULL,/*0接收，1发送*/
cmd_len INT NOT NULL,
PRIMARY KEY (cmd_name,cmd_direct),
FOREIGN KEY (cmd_name) REFERENCES RCU_CMD_DEFINE(cmd_name),
FOREIGN KEY (cmd_direct) REFERENCES RCU_DATA_DIRECTION(log_type));

CREATE TABLE RCU_CMD_CONFIG (
unit_id varchar(100) not null,
cmd_data int NOT NULL,
cmd_direct int NOT NULL DEFAULT 0,/*0接收,1发送*/
begin_byte_pos int NOT NULL,
byte_len int NOT NULL,
begin_bit_pos int NOT NULL,
bit_len int NOT NULL,
data_form int NOT NULL/*0为16进制,1为BCD码*/,
/*TODO 以后要删除这个字段的*/
data_change int NOT NULL/*0为不需要转换，1需要转换，转换的关系见表RCU_UNIT_RELATION(现在应该都不需要了)*/,
PRIMARY KEY (unit_id,cmd_data,cmd_direct),
FOREIGN KEY (unit_id) REFERENCES RCU_TITLE_DEFINE(title_id),
FOREIGN KEY (cmd_data) REFERENCES RCU_CMD_DEFINE(cmd_id),
FOREIGN KEY (cmd_direct) REFERENCES RCU_DATA_DIRECTION(log_type),
CHECK(begin_byte_pos >= 0 AND byte_len >= 1 AND begin_bit_pos >= 0 AND bit_len >= 1));

CREATE TABLE RCU_GROUP_DEFINE (
group_id int not null default 0,
group_desc varchar(20) not null,
PRIMARY KEY(group_id));

CREATE TABLE RCU_GROUP_INFO (
group_id int not null default 0,
state_name varchar(30) not null,
state_pos INT NOT NULL DEFAULT 0,
state_type INT NOT NULL DEFAULT 0,/*0显示图片(如card)，1显示温度text(如room_temp),2显示其他text(如card_delay)*/
UNIQUE (group_id,state_pos),
FOREIGN KEY (group_id) REFERENCES RCU_GROUP_DEFINE(group_id));

CREATE TABLE RCU_USER_INFO(
username varchar(20) not null,                                                                
password varchar(20) not null,
reg_time DATETIME not null,
login_count int not null default 0,
last_time DATETIME not null,
level int not null default 4);/*0程序员级,1系统管理员(仅admin),2普通管理员,3高级用户,4普通用户*/
CREATE UNIQUE INDEX I_RCU_USER_INFO ON RCU_USER_INFO(username); 

CREATE TABLE RCU_ROOMTYPE_DESC(
room_type int not null,/*和RCU_ROOM_STATE中的room_type一致*/
type_desc varchar(100) not null,
type_image varchar(100) not null,
width int not null,
height int not null);
CREATE UNIQUE INDEX I_RCU_ROOMTYPE_DESC ON RCU_ROOMTYPE_DESC(room_type);

CREATE TABLE RCU_TOOLBAR_DEFINE(
tool_name varchar(20) not null,
tool_desc varchar(20) not null,
tool_pos int not null,
lowest_level int not null default 0,
PRIMARY KEY (tool_name));

CREATE TABLE RCU_TOOLBAR_ITEMS(
tool_name varchar(20) not null,
item_name varchar(20) not null,
item_desc varchar(20) not null,
item_pos int not null,
lowest_level int not null default 4,
PRIMARY KEY (tool_name,item_name),
UNIQUE (tool_name,item_pos),
FOREIGN KEY(tool_name) REFERENCES RCU_TOOLBAR_DEFINE(tool_name));

CREATE TABLE RCU_CONFIG_PARAM(
cfg_name varchar(20) not null,
cfg_value int not null default 0,
PRIMARY KEY (cfg_name));

CREATE TABLE RCU_CONFIG_DEFINE(
cfg_name varchar(20) not null,
cfg_value int not null,
cfg_text varchar(50) not null,
PRIMARY KEY (cfg_name,cfg_value),
FOREIGN KEY(cfg_name) REFERENCES RCU_CONFIG_PARAM(cfg_name));

CREATE TABLE RCU_WORK_PRIORITY(
pri_id VARCHAR(20) NOT NULL,
pri_val INT NOT NULL,/*优先级的值越低，越要优先处理*/
pri_text varchar(20) NOT NULL,
PRIMARY KEY (pri_id));

CREATE TABLE RCU_WORK_ORDER(
order_id SERIAL,
pri_val INT NOT NULL,
username varchar(20),
create_time DATETIME,/*工单生成时间*/
process_time DATETIME,/*工单处理时间*/
order_state int not null,/*工单状态，0-未处理，1-正在处理(order_type=1时，有用)，2-处理过了,3-出现异常，工单无效, 4-防止工单积压，将某些工单设为无效*/
order_type int not null,/*0只发不回(轮询命令),1有发有回(设置命令),2直接设置，根本不发(入住设置命令)*/
room_id int not null,
cmd int not null,
PRIMARY KEY (order_id));

CREATE TABLE RCU_WORK_DATA(
data_id BIGINT UNSIGNED NOT NULL,
data_pos int NOT NULL,
data_val TINYINT UNSIGNED NOT NULL,
PRIMARY KEY (data_id,data_pos),
FOREIGN KEY(data_id) REFERENCES RCU_WORK_ORDER(order_id));

COMMIT;                   