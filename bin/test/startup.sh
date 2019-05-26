#!/bin/bash
DK_HOME=$(cd "$(dirname "$0")"; pwd)
DEPLOY_DIR="${DK_HOME}/.."
CONFDIR="${DK_HOME}/../conf"
LOG_HOME="${DK_HOME}/../logs"
WORK_HOME="${DK_HOME}/../work"
CLASSPATH="${DK_HOME}/../lib/*:${CONFDIR}"
MAINCLASS="com.jimmy.Application"

if [ ! -d $LOG_HOME ]; then
    mkdir $LOG_HOME
fi
STDOUT_FILE=$LOG_HOME/stdout.log

if [ -z $JAVA_HOME ]; then
	JAVA=java
else
	JAVA="$JAVA_HOME/bin/java"
fi

JAVA_OPTS=" -Djava.awt.headless=true -Djava.net.preferIPv4Stack=true "

JAVA_MEM_OPTS=""
BITS=`java -version 2>&1 | grep -i 64-bit`
if [ -n "$BITS" ]; then
    JAVA_MEM_OPTS=" -server -Xmx200m -Xms200m -Xmn128m -XX:PermSize=128m -Xss256k -XX:+DisableExplicitGC -XX:+UseConcMarkSweepGC -XX:+CMSParallelRemarkEnabled -XX:+UseCMSCompactAtFullCollection -XX:LargePageSizeInBytes=128m -XX:+UseFastAccessorMethods -XX:+UseCMSInitiatingOccupancyOnly -XX:CMSInitiatingOccupancyFraction=70 "
else
    JAVA_MEM_OPTS=" -server -Xms200m -Xmx200m -XX:PermSize=128m -XX:SurvivorRatio=2 -XX:+UseParallelGC "
fi


"$JAVA" $JAVA_OPTS $JAVA_MEM_OPTS "-Dlog4j.level=WARN" "-Dlog.home=${LOG_HOME}" "-Dwork.home=${WORK_HOME}" -cp $CLASSPATH $MAINCLASS > $STDOUT_FILE 2>&1 &

COUNT=0
while [ $COUNT -lt 1 ]; do
    echo -e ".\c"
    sleep 1
    COUNT=`ps -ef | grep java | grep "$DEPLOY_DIR" | awk '{print $2}' | wc -l`
    if [ $COUNT -gt 0 ]; then
        break
    fi
done


echo " OK!"
##echo "STDOUT: $STDOUT_FILE"


PIDS=`ps -ef | grep java | grep "$DEPLOY_DIR" | awk '{print $2}'`
echo "PID: $PIDS"
