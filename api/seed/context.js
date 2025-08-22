'use strict';

const Database = require('better-sqlite3');

class Context {
  constructor (filename, enableLogging) {
    this.db = new Database(filename);
    this.enableLogging = enableLogging;
  }

  static prepareQuery (text) {
    return text
      .replace(/\s+/g, ' ')
      .trim();
  }

  static log (text, params) {
    console.info(`Running query: "${text}", with params: ${JSON.stringify(params)}`);
  }

  execute (text, ...params) {
    const sql = Context.prepareQuery(text);
    if (this.enableLogging) {
      Context.log(sql, params);
    }
    try {
      const stmt = this.db.prepare(sql);
      const result = stmt.run(...params);
      return Promise.resolve(result);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  query (text, ...params) {
    const sql = Context.prepareQuery(text);
    if (this.enableLogging) {
      Context.log(sql, params);
    }
    try {
      const stmt = this.db.prepare(sql);
      const data = stmt.all(...params);
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async retrieve (text, ...params) {
    return this.query(text, ...params);
  }

  async retrieveSingle (text, ...params) {
    const data = await this.query(text, ...params);
    let record;
    if (data) {
      if (data.length === 1) {
        [record] = data;
      } else if (data.length > 1) {
        throw new Error('Unexpected number of rows encountered.');
      }
    }
    return record;
  }

  async retrieveValue (text, ...params) {
    const data = await this.query(text, ...params);
    let record;
    let value;
    if (data && data.length === 1) {
      [record] = data;
      const keys = Object.keys(record);
      if (keys.length === 1) {
        value = record[keys[0]];
      } else {
        throw new Error('Unexpected number of values encountered.');
      }
    } else {
      throw new Error('Unexpected number of rows encountered.');
    }
    return value;
  }
}

module.exports = Context;
