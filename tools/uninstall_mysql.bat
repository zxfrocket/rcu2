%~d0
cd %~dp0
net stop mysql
..\env\mysql\bin\mysqld.exe --remove
rmdir /s /Q ..\env\mysql /S
rmdir /s /Q ..\env\mysql /S
::ause