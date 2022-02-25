const sharedConfig = {
  client: 'sqlite3',
  useNullAsDefault: true,
  migrations: {
    directory: './data/migrate'
  },
  seeds: {
    directory: './data/seed'
  },
  pool: {
    afterCreate: (conn, done) => {
      conn.run('PRAGMA foreign_keys = ON', done)
    }
  }
}

module.exports = {

  development: {
    ...sharedConfig,
    connection: {
      filename: './data/schemes.db3'
    }
  },
  testing: {
    ...sharedConfig,
    connection: {
      filename: 'data/testing.db3'
    }
  }
};
