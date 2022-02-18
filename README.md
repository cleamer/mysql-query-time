# MySQL query time

**Table of contents**

- [Why MySQL Query Time](#why-mysql-query-time)
- [Installation](#installation)
- [How to Use](#how-to-use)
- [Documentation](#documentation)

<br/>
<br/>

## Why MySQL Query Time

If you have ever developed backend, you may have tought about database performance. There are a lot of things about performance however execution time is one of most important things. This module will help you masure query execution time in your project.

<br/>

## Installation

```bash
npm install mysql-query-time
```

<br/>

## How to Use

### 1. Set MySQL

First of all you need to set MySQL fallowing [MySQL Documnetation(22.11 Performance Schema General Table Characteristics)](https://dev.mysql.com/doc/refman/8.0/en/performance-schema-query-profiling.html)

### 2. Set .env file

Make .env file and set some environment variable about your databse.

for example

```txt
TESTER='cloer'
TESTER_HOST='localhost'
TESTER_PASSWORD='my_password'
TEST_DATABASE='my_database'
```

### 3. Import mysql-query-time and call `createTest()`

```javascript
const { createTest } = require('mysql-query-time');

try {
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

- [`createTest()`](#1-createtest)
- [`Test Function`](#2-test-function)

### 1. `createTest()`

This module has only one function `createTest()`.  
`createTest()` makes 2 connections and returns `Test Function`. About connections, one is for the schema you want to test, the other is for performance_schema. And send these connections to `Test Function`

### 2. `Test Function`

`Test Function` is a result of `createTest()`. This function take 2 arguments. first one is query and second one is callback that is error handler. query is requried. This function sends the query to your schema and olso sends a query requesting execution time to performance_schema. It returns an object that contains queryResult and timeResult. You can get query execution time from timeResult.
