export PATH=${PATH}:/usr/local/mysql/bin/
mysql -h 'localhost' -u 'root' '-pPassword123!!' < './ddl/seed.sql'
export seed=0
node .
