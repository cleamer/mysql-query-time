# MySQL query time

**Table of contents**

- [Why MySQL Query Time](#why-mysql-query-time)
- [Installation](#installation)
- [How to Use](#how-to-use)
- [Documentation](#documentation)

<br/>
<br/>

## Why MySQL Query Time

If you have ever developed backend, you may have tought about database performance. There are a lot of things about performance however execution time is one of the most important things. This module will help you measure query execution time in your project.

<br/>

## Installation

```bash
npm install -D mysql-query-time
```

<br/>

## How to Use

### 1. Set MySQL

First of all you need to set MySQL using `setMysql()`. This function must be executed only once each time the database is started.

Also you can do it yourself whitout `setMysql()` fallowing [MySQL Documnetation(22.11 Performance Schema General Table Characteristics)](https://dev.mysql.com/doc/refman/8.0/en/performance-schema-query-profiling.html)

```SQL
UPDATE performance_schema.setup_actors
SET ENABLED = 'NO', HISTORY = 'NO'
WHERE HOST = '%' AND USER = '%';

INSERT INTO performance_schema.setup_actors
(HOST,USER,ROLE,ENABLED,HISTORY)
VALUES('localhost','test_user','%','YES','YES');

UPDATE performance_schema.setup_instruments
SET ENABLED = 'YES', TIMED = 'YES'
WHERE NAME LIKE '%statement/%';

UPDATE performance_schema.setup_instruments
SET ENABLED = 'YES', TIMED = 'YES'
WHERE NAME LIKE '%stage/%';

UPDATE performance_schema.setup_consumers
SET ENABLED = 'YES'
WHERE NAME LIKE '%events_statements_%';

UPDATE performance_schema.setup_consumers
SET ENABLED = 'YES'
WHERE NAME LIKE '%events_stages_%';
```

### 2. Set .env file

Make .env file and set some environment variables about your databse.  
If you set MySQL yourself instead of `setMysql()`, you don't need to set variables about `MASTER`.

for example

```txt
MASTER_HOST='localhost'
MASTER='root'
MASTER_PASSWORD='root_password'

TESTER='cloer'
TESTER_HOST='localhost'
TESTER_PASSWORD='my_password'
TEST_DATABASE='my_database'
```

### 3. Import mysql-query-time and call `createTest()`

Import the package and call `createTest()`. It returns an functon called `Test Function`

for example

```javascript
const { setMysql, createTest } = require('mysql-query-time');

try {
  /* 
  setMysql() function must be executed only once each time the database is started.
  When you run this script again, you should change the line to a comment.
  */
  await setMysql();
  const test = await createTest();
  const result = await test('SELECT * FROM User1 WHERE userId=1');
  console.log(result.queryResult);
  console.log(result.timeResult);
} catch (err) {
  console.error(err);
}
```

<br/>

## Documentation

- [`setMysql()`](#1-setmysql)
- [`createTest()`](#2-createtest)
- [`Test Function`](#3-test-function)

### 1. `setMysql()`

`setMysql()` sets MySQL. This function must be executed only once each time the database is started. When databese restarts, this function should be executed.

### 2. `createTest()`

`createTest()` makes 2 connections and returns `Test Function`. About connections, one is for the schema you want to test, the other is for performance_schema. And send these connections to `Test Function`

### 3. `Test Function`

`Test Function` is a result of `createTest()`. This function take 2 arguments. first one is query and second one is callback that is error handler. query is requried. This function sends the query to your schema and olso sends a query requesting execution time to performance_schema. It returns an object that contains queryResult and timeResult. You can get query execution time from timeResult.
