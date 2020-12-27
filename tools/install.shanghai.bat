%~d0
cd %~dp0
::convert \ to /==============================================================================================
echo %cd% > .\RcuTemp.txt
echo \tools-^> > .\argRcuTemp.txt
.\bwfr\bwfr.exe .\RcuTemp.txt -f -argfile:.\argRcuTemp.txt
for /f %%t in (.\RcuTemp.txt) do set orgrcuhome=%%t
echo %orgrcuhome%
echo \-^>/ > .\argRcuTemp.txt
.\bwfr\bwfr.exe .\RcuTemp.txt -f -argfile:.\argRcuTemp.txt
for /f %%t in (.\RcuTemp.txt) do set rcuhome=%%t
echo %rcuhome%
del .\RcuTemp.txt
del .\argRcuTemp.txt
::pause
::copy env to RcuHome
xcopy .\env ..\env\ /E/y
xcopy .\conf\env ..\env\ /E/y
mkdir ..\env\mysql\tmp
mkdir ..\env\php\tmp
::config php==================================================================================================
echo RcuHome-^>%orgrcuhome% > ..\env\php\RcuHome.txt
.\bwfr\bwfr.exe ..\env\php\php.ini -f -argfile:..\env\php\RcuHome.txt
del ..\env\php\RcuHome.txt
copy ..\env\php\php5apache2_2.dll ..\env\apache\modules\ /y
::pause
::config apache===============================================================================================
echo RcuHome-^>%rcuhome% > ..\env\apache\RcuHome.txt
.\bwfr\bwfr.exe ..\env\apache\conf\httpd.conf -f -argfile:..\env\apache\RcuHome.txt
.\bwfr\bwfr.exe ..\env\apache\conf\extra\httpd-autoindex.conf -f -argfile:..\env\apache\RcuHome.txt
.\bwfr\bwfr.exe ..\env\apache\conf\extra\httpd-dav.conf -f -argfile:..\env\apache\RcuHome.txt
.\bwfr\bwfr.exe ..\env\apache\conf\extra\httpd-default.conf -f -argfile:..\env\apache\RcuHome.txt
.\bwfr\bwfr.exe ..\env\apache\conf\extra\httpd-info.conf -f -argfile:..\env\apache\RcuHome.txt
.\bwfr\bwfr.exe ..\env\apache\conf\extra\httpd-languages.conf -f -argfile:..\env\apache\RcuHome.txt
.\bwfr\bwfr.exe ..\env\apache\conf\extra\httpd-manual.conf -f -argfile:..\env\apache\RcuHome.txt
.\bwfr\bwfr.exe ..\env\apache\conf\extra\httpd-mpm.conf -f -argfile:..\env\apache\RcuHome.txt
.\bwfr\bwfr.exe ..\env\apache\conf\extra\httpd-multilang-errordoc.conf -f -argfile:..\env\apache\RcuHome.txt
.\bwfr\bwfr.exe ..\env\apache\conf\extra\httpd-ssl.conf -f -argfile:..\env\apache\RcuHome.txt
.\bwfr\bwfr.exe ..\env\apache\conf\extra\httpd-userdir.conf -f -argfile:..\env\apache\RcuHome.txt
.\bwfr\bwfr.exe ..\env\apache\conf\extra\httpd-vhosts.conf -f -argfile:..\env\apache\RcuHome.txt
del ..\env\apache\RcuHome.txt
::config apache service
..\env\apache\bin\httpd.exe -k install -n apache
net start apache
sc config apache start= auto
::pause
::config mysql=================================================================================================
echo RcuHome-^>%rcuhome% > ..\env\mysql\RcuHome.txt
.\bwfr\bwfr.exe ..\env\mysql\my.ini -f -argfile:..\env\mysql\RcuHome.txt
del ..\env\mysql\RcuHome.txt
..\env\mysql\bin\mysqld.exe --install mysql --defaults-file="%orgrcuhome%\env\mysql\my.ini"
net start mysql
sc config mysql start= auto
::pause
::Create Rcu Service============================================================================================
xcopy ..\RcuProcess\conf.ini ..\RcuService\conf\ /y
xcopy .\jdk ..\RcuService\jdk\ /E/y
xcopy ..\RcuProcess\log ..\RcuService\log\ /T/E/y
mkdir ..\RcuService\log\service
::compile
set packpath=com\dlrtie\rcu\
mkdir ..\RcuService\RcuAll\lib\%packpath%
copy ..\RcuProcess\lib\*.jar ..\RcuService\RcuAll\lib\ /y
copy ..\RcuProcess\lib\*.dll ..\RcuService\RcuAll\lib\ /y
copy ..\RcuProcess\src\com\dlrtie\rcu\*.java ..\RcuService\RcuAll\lib\%packpath% /y
.\jdk\bin\javac.exe -classpath ..\RcuService\RcuAll\lib\mysql.jar;..\RcuService\RcuAll\lib\RXTXcomm.jar -encoding utf-8 ..\RcuService\RcuAll\lib\%packpath%*.java
del ..\RcuService\RcuAll\lib\%packpath%*.java
::because we have know the Main-Class in wrapper.conf, we need not add mainfest list when package
.\jdk\bin\jar.exe -cvfM ..\RcuService\RcuAll\lib\RcuAll.jar -C ..\RcuService\RcuAll\lib\ com
for %%f in (RcuClear RcuOrder RcuPoll RcuAuto) do call .\scripts\sub1.bat %%f ..\RcuService\RcuAll\lib\RcuAll.jar
rmdir /s /Q ..\RcuService\RcuAll /S
