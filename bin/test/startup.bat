setlocal
SET CONFDIR=%~dp0%..\conf
SET CLASSPATH=%~dp0..\*;%~dp0..\lib\*;%CLASSPATH%;%CONFDIR%
SET LOG_HOME=%~dp0%..\logs
SET WORK_HOME=%~dp0%..\work
SET MAINCLASS=com.jimmy.Application
echo on
java "-Dlog4j.level=WARN" "-Dlog.home=%LOG_HOME%" "-Dwork.home=%WORK_HOME%" "-Dspring.proﬁles.active=test"  -Xms64m -Xmx512m -XX:MaxPermSize=64M -cp "%CLASSPATH%" "%MAINCLASS%"
endlocal
