#!/bin/bash

while read -p "select install profiles[dev,prod,qprod,test]:" envType
do
	if [ "$envType" == "dev" -o "$envType" == "prod" -o "$envType" == "qprod" -o "$envType" == "test" ]; then
		mvn -Dmaven.test.skip=true clean install -P$envType assembly:assembly -U
		break
	fi
done