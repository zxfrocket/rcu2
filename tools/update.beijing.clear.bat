%~d0
cd %~dp0
::compile
for %%f in (RcuClear) do call .\scripts\update1.bat %%f
set packpath=com\dlrtie\rcu\
mkdir ..\RcuService\RcuAll\lib\%packpath%
copy ..\RcuProcess\lib\*.jar ..\RcuService\RcuAll\lib\ /y
copy ..\RcuProcess\lib\*.dll ..\RcuService\RcuAll\lib\ /y
copy ..\RcuProcess\src\com\dlrtie\rcu\*.java ..\RcuService\RcuAll\lib\%packpath% /y
.\jdk\bin\javac.exe -classpath ..\RcuService\RcuAll\lib\mysql.jar;..\RcuService\RcuAll\lib\RXTXcomm.jar -encoding utf-8 ..\RcuService\RcuAll\lib\%packpath%*.java
del ..\RcuService\RcuAll\lib\%packpath%*.java
::because we have know the Main-Class in wrapper.conf, we need not add mainfest list when package
.\jdk\bin\jar.exe -cvfM ..\RcuService\RcuAll\lib\RcuAll.jar -C ..\RcuService\RcuAll\lib\ com
for %%f in (RcuClear) do call .\scripts\update2.bat %%f ..\RcuService\RcuAll\lib\RcuAll.jar
rmdir /s /Q ..\RcuService\RcuAll /S
