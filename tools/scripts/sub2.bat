set RcuClass=%1
::uninstall windows service
call ..\RcuService\%RcuClass%\bin\StopApp-NT.bat
call ..\RcuService\%RcuClass%\bin\UninstallApp-NT.bat