数据库课程设计
===========================================
### 开发模块选择：
1.[async](https://github.com/caolan/async)<br/>
2.[crypto](http://nodejs.org/api/crypto.html)<br/>
3.[node-mongodb](https://github.com/mongodb/node-mongodb-native)<br/>

###数据库设计
        |-------------------------------------------------------------|
        | Database |          |           |       |          |        |
        |----------|----------|-----------|-------|----------|--------|
        | users                                                       |
        |----------|----------|-----------|-------|----------|--------|
        | username | password |           |       |          |        |
        |----------|----------|-----------|-------|----------|--------|
        | readers                                                     |
        |----------|----------|-----------|-------|----------|--------|
        | name     | number   | arrear    |       |          |        |
        |----------|----------|-----------|-------|----------|--------|
        | books                                                       |
        |----------|----------|-----------|-------|----------|--------|
        | name     | price    | reader_id | start | continue | broken |
        |----------|----------|-----------|-------|----------|--------|
        | fines                                                       |
        |----------|----------|-----------|-------|----------|--------|
        | reader   | book     | money     |       |          |        |
        |----------|----------|-----------|-------|----------|--------|
        | records                                                     |
        |----------|----------|-----------|-------|----------|--------|
        | reader   | book     | start     | end   | broken   | money  |
        |-------------------------------------------------------------|
