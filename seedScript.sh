export PATH=${PATH}:/usr/local/mysql/bin/
mysql -h 'localhost' -u 'root' '-pPassword123!!' 'SBO' < './ddl/ddl.sql'
export seed=2
node .