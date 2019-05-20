@echo off

:inputType
cls
set envType=
set /p "envType=select install profiles[dev,prod,qprod,test]:"

if not defined envType GOTO inputType

IF %envType% == dev GOTO executeMvn
IF %envType% == prod GOTO executeMvn
IF %envType% == qprod GOTO executeMvn
IF %envType% == test GOTO executeMvn

GOTO inputType

:executeMvn
echo you select install type is %envType%

mvn -Dmaven.test.skip=true -Ddockerfile.skip=true clean install -P%envType% assembly:assembly -U