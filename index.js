'use strict';
const path = require('path');
require('dotenv').config({ path: path.join(process.cwd(), '.env') });

const mysql = require('mysql2/promise');

exports.createTest = async () => {
  const queryConnection = await mysql.createConnection({
    host: process.env.TESTER_HOST,
    user: process.env.TESTER,
    password: process.env.TESTER_PASSWORD,
    database: process.env.TEST_DATABASE,
  });
  const timeConnection = await mysql.createConnection({
    host: process.env.TESTER_HOST,
    user: process.env.TESTER,
    password: process.env.TESTER_PASSWORD,
    database: 'performance_schema',
  });
  return async (query, errorHandler = (err) => console.error(err)) => {
    try {
      const [queryResult] = await queryConnection.query(query);
      const [timeResult] = await timeConnection.query(
        `SELECT EVENT_ID, TRUNCATE(TIMER_WAIT/1000000000000,6) as Duration, SQL_TEXT
      FROM performance_schema.events_statements_history_long WHERE SQL_TEXT like ?;`,
        query
      );
      queryConnection.end();
      timeConnection.end();
      return { queryResult, timeResult };
    } catch (err) {
      queryConnection.end();
      timeConnection.end();
      errorHandler(err);
      return;
    }
  };
};
