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
xcopy .\env\mysql ..\env\mysql\ /E/y
xcopy .\conf\env\mysql ..\env\mysql\ /E/y
mkdir ..\env\mysql\tmp
::config mysql=================================================================================================
echo RcuHome-^>%rcuhome% > ..\env\mysql\RcuHome.txt
.\bwfr\bwfr.exe ..\env\mysql\my.ini -f -argfile:..\env\mysql\RcuHome.txt
del ..\env\mysql\RcuHome.txt
..\env\mysql\bin\mysqld.exe --install mysql --defaults-file="%orgrcuhome%\env\mysql\my.ini"
net start mysql
sc config mysql start= auto
