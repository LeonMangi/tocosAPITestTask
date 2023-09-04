require('dotenv').config()
const { defineConfig } = require('cypress') // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

module.exports = defineConfig({
  projectId: '14jzus',
  viewportHeight: 1080,
  viewportWidth: 1920,
  chromeWebSecurity: false,
  defaultCommandTimeout: 10000,
  responseTimeout: 10000,
  requestTimeout: 10000,

  e2e: {
    baseUrl: 'https://staging.automate.amio.io/',
    setupNodeEvents (on, config) {
      // implement node event listeners here
    },
    specPattern: 'cypress/e2e/',
    supportFile: 'cypress/support/e2e.js'
  },

  env: {
    auth_id: process.env.CLIENT_ID,
    auth_secret: process.env.CLIENT_SECRET,
    auth_type: process.env.GRANT_TYPE,
    auth_name: process.env.USER_NAME,
    auth_password: process.env.PASSWORD,
    auth_audience: process.env.AUDIENCE,
    realm: process.env.REALM
  }
})
