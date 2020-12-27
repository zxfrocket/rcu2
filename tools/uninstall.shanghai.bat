%~d0
cd %~dp0
for %%f in (RcuClear RcuOrder RcuPoll RcuAuto) do call .\scripts\sub2.bat %%f
net stop apache
..\env\apache\bin\httpd.exe -k uninstall -n apache
net stop mysql
..\env\mysql\bin\mysqld.exe --remove
rmdir /s /Q ..\RcuService /S
rmdir /s /Q ..\RcuService /S
rmdir /s /Q ..\env /S
rmdir /s /Q ..\env /S
::ause