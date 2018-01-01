set RcuClass=%1
set RcuAll=%2
mkdir ..\RcuService\%RcuClass%
mkdir ..\RcuService\%RcuClass%\bin
mkdir ..\RcuService\%RcuClass%\conf
mkdir ..\RcuService\%RcuClass%\lib
::bin
copy .\JavaServiceWrapper\bin\wrapper.exe ..\RcuService\%RcuClass%\bin\ /y
copy .\JavaServiceWrapper\src\bin\App.bat.in ..\RcuService\%RcuClass%\bin\App.bat /y
copy .\JavaServiceWrapper\src\bin\AppCommand.bat.in ..\RcuService\%RcuClass%\bin\AppCommand.bat /y
copy .\JavaServiceWrapper\src\bin\InstallApp-NT.bat.in ..\RcuService\%RcuClass%\bin\InstallApp-NT.bat /y
copy .\JavaServiceWrapper\src\bin\UninstallApp-NT.bat.in ..\RcuService\%RcuClass%\bin\UninstallApp-NT.bat /y
copy .\JavaServiceWrapper\src\bin\StartApp-NT.bat.in ..\RcuService\%RcuClass%\bin\StartApp-NT.bat /y
copy .\JavaServiceWrapper\src\bin\StopApp-NT.bat.in ..\RcuService\%RcuClass%\bin\StopApp-NT.bat /y
copy .\JavaServiceWrapper\src\bin\PauseApp-NT.bat.in ..\RcuService\%RcuClass%\bin\PauseApp-NT.bat /y
copy .\JavaServiceWrapper\src\bin\ResumeApp-NT.bat.in ..\RcuService\%RcuClass%\bin\ResumeApp-NT.bat /y
::lib
copy .\JavaServiceWrapper\lib\wrapper.dll ..\RcuService\%RcuClass%\lib\ /y
copy .\JavaServiceWrapper\lib\wrapper.jar ..\RcuService\%RcuClass%\lib\ /y
copy ..\RcuProcess\lib\*.jar ..\RcuService\%RcuClass%\lib\ /y
copy ..\RcuProcess\lib\*.dll ..\RcuService\%RcuClass%\lib\ /y
copy %RcuAll% ..\RcuService\%RcuClass%\lib\%RcuClass%.jar /y
::conf
copy .\conf\conf.ini ..\RcuService\%RcuClass%\bin\ /y
copy .\conf\wrapper.conf ..\RcuService\%RcuClass%\conf\ /y
echo RcuXXXX-^>%RcuClass% > ..\RcuService\%RcuClass%\conf\%RcuClass%.txt
.\bwfr\bwfr.exe ..\RcuService\%RcuClass%\conf\wrapper.conf -f -argfile:..\RcuService\%RcuClass%\conf\%RcuClass%.txt
del ..\RcuService\%RcuClass%\conf\%RcuClass%.txt
::install windows service
call ..\RcuService\%RcuClass%\bin\InstallApp-NT.bat
::call ..\RcuService\%RcuClass%\bin\StartApp-NT.bat