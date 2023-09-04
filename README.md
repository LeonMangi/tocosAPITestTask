# Cypress Installation Guide

This is a solution and guide on how to start testing the suite using Node.js and Cypress

For the first time [installation](https://docs.cypress.io/guides/getting-started/installing-cypress#What-you-ll-learn)

## Installation

Download Node.js for your operating system from the [official site](https://nodejs.org/en/).

Navigate to the root folder of the project. Install Cypress via node package manager [npm](https://www.npmjs.com/).

```bash
npm install
```

## Start Cypress tests

For Cypress test runner to open, use the following command:

```bash
npm run cypress:open
```

Upon opening of Cypress test runner, follow the steps and click on tests to run.
Note that videos won't be recorded automatically using the test runner method. They will be generated when headless mode is used, and stored in the cypress/videos folder in the .mp4 format.

To run Cypress tests in headless mode, use the following command:

```bash
npm run cypress:run
```