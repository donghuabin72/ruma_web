#!/bin/bash
/etc/init.d/postgresql restart
sleep 10
/etc/init.d/ssh restart
/etc/init.d/tomcat7 restart

# The container will run as long as the script is running, that's why
# we need something long-lived here
/root/redis-3.0.7/src/redis-server &
tail -f /var/log/tomcat7/catalina.out