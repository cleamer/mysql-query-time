'use strict';
const path = require('path');
require('dotenv').config({ path: path.join(process.cwd(), '.env') });

const mysql = require('mysql2/promise');

exports.setMysql = async () => {
  try {
    const settingConnection = await mysql.createConnection({
      host: process.env.MASTER_HOST,
      user: process.env.MASTER,
      password: process.env.MASTER_PASSWORD,
      database: 'performance_schema',
      multipleStatements: true,
    });
    settingConnection.query(`
      GRANT SELECT ON performance_schema.* TO '${process.env.TESTER}'@'${process.env.TESTER_HOST}';
      INSERT INTO performance_schema.setup_actors (HOST,USER,ROLE,ENABLED,HISTORY)
      VALUES('${process.env.TESTER_HOST}','${process.env.TESTER}','%','YES','YES');
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
      WHERE NAME LIKE '%events_stages_%';`);
    settingConnection.end();
  } catch (error) {
    console.error(error);
  }
};

exports.createTest = async () => {
  try {
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
  } catch (connectionError) {
    console.error(connectionError);
  }
};
