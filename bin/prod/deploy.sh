#!/bin/bash
kill `ps -ef |grep shared|awk '{print $2}'`

rm -rf /opt/shared/*/*

tar zxvf release-shared-region.tar.gz -C /opt/shared/region/
tar zxvf release-shared-delivery.tar.gz -C /opt/shared/delivery/

chmod -R 775 /opt/shared/*

/opt/shared/region/bin/startup.sh &
sleep 3s
/opt/shared/delivery/bin/startup.sh &
sleep 3s
echo -e "deploy succeed !!!"

exit