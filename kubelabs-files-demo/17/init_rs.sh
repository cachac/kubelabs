# inicializa el MongoDB replica set
mongo admin --eval "rs.initiate({_id: 'rs0', members: [{ _id: 0, priority: 3, host: 'mongodb-sts-0.mongodb-svc.default.svc.cluster.local' }]});"
# configura el usuario root de la base de datos
mongo admin --eval "db.getSiblingDB('admin').createUser({ user: '${DB_ROOT}', pwd: '${DB_PASSWORD}', roles: [{ role: 'root', db: 'admin' }]});"
# rs members
mongo admin -u ${DB_ROOT} -p ${DB_PASSWORD} --eval "rs.add({ _id: 1, priority: 1, host: 'mongodb-sts-1.mongodb-svc.default.svc.cluster.local' });"
mongo admin -u ${DB_ROOT} -p ${DB_PASSWORD} --eval "rs.add({ _id: 2, priority: 1, host: 'mongodb-sts-2.mongodb-svc.default.svc.cluster.local' });"
