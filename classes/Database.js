const sqlite3 = require("sqlite3")
const path = require("path")
const dbPath = path.resolve(__dirname, "../data.db")
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) return console.log(err)
})

/**
 * @typedef DatabaseOption
 */

module.exports = class Database {
  /**
   * @param {string} [table] Table in database
   * @param {string} [column] Columns in the database
   * @param {string} [value] Insert value
   */
  async add(options) {
    if (options.value) {
      db.run(`INSERT or IGNORE INTO ${options.table}(${options.column}) VALUES(${options.value});`)
      return true
    } else {
      throw new Error("넣고자 하는 값이 없습니다.")
    }
  }

  /**
   * @param {string} [table] Table in database
   * @param {string} [column] Columns in the database
   * @param {string} [where] Conditional statement (can be omitted)
   */
  async remove(options) {
    if (options.where) {
      db.run(`DELETE FROM ${options.table} WHERE ${options.where};`)
      return true
    } else {
      db.run(`DELETE FROM ${options.table};`)
      return true
    }
  }

  /**
   * @param {string} [table] Table in database
   * @param {string} [column] Columns in the database
   * @param {string} [where] Conditional statement (can be omitted)
   */
  async get(options) {
    db.serialize()
    return new Promise((resolve, reject) => {
      if (options.where) {
        db.all(`SELECT ${options.column} FROM ${options.table} WHERE ${options.where};`, (err, rows) => {
          if (err) reject(err)
          try {
            if (rows[0] === undefined) resolve("None")
            else resolve(rows)
          } catch {
            resolve("None")
          }
        })
      } else {
        db.all(`SELECT ${options.column} FROM ${options.table};`, (err, rows) => {
          if (err) reject(err)
          try {
            if (rows[0] === undefined) resolve("None")
            else resolve(rows)
          } catch {
            resolve("None")
          }
        })
      }
    })
  }
}
