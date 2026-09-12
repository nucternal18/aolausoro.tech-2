// Any setup scripts you might need go here

// Load .env files
import 'dotenv/config'

// Integration specs must never touch the real database. Point them at a
// throwaway `<db>_test` database (or DATABASE_URL_TEST if set). Safe to drop.
if (process.env.DATABASE_URL_TEST) {
  process.env.DATABASE_URL = process.env.DATABASE_URL_TEST
} else if (process.env.DATABASE_URL && !/_test(\?|$)/.test(process.env.DATABASE_URL)) {
  process.env.DATABASE_URL = process.env.DATABASE_URL.replace(
    /\/([^/?]+)(\?|$)/,
    (_m, db, tail) => `/${db}_test${tail}`,
  )
}
