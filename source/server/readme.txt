//get by task name
curl -i -X GET http://localhost:3000/tasks/TName?taskname=t1
//get by id
curl -i -X GET http://localhost:3000/tasks/52a3181d4813a02c17000001
//Add
curl -i -X POST -H 'Content-Type: application/json' -d '{"seqid":1, "taskname":"t2"}' http://localhost:3000/tasks
//update
curl -i -X PUT -H 'Content-Type: application/json' -d '{"seqid":2, "taskname":"t5"}' http://localhost:3000/tasks/52a3190bb2dad09c18000001
//delte
curl -i -X DELETE http://localhost:3000/tasks/52a3190bb2dad09c18000001
