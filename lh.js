// const utils = require('./utils.js')
// import utils from './utils.js'
import { singleRun, getMedian } from './utils.js'
// const ora = require('ora');
import ora from 'ora'

const resultsTable = {}
const mobileResults = []
const desktopResults = []

const loopRun = async (target, num, device) => {
  for (let currentRun = 1; currentRun <= num; currentRun++) {
    const throbber = ora(`running ${device} number: ${currentRun}...`).start();
    const currentResult = await singleRun(target, device)
    if (currentResult) {
      throbber.stop()
    }
    resultsTable[currentRun] = {
      ...resultsTable[currentRun],
      [device]: currentResult
    }
    if (device === "mobile") {
      mobileResults.push(currentResult)
    } else {
      desktopResults.push(currentResult)
    }
    console.log(`${device} run number: ${currentRun}: ${currentResult}`)
  }
}

(async () => {
  const target = process.argv[2]
  const device = process.argv[3]
  const count = process.argv[4]

  if (device === "1") {
    await loopRun(target, count, "mobile")
  } else if (device === "2") {
    await loopRun(target, count, "desktop")
  } else {
    await loopRun(target, count, "mobile")
    await loopRun(target, count, "desktop")
  }

  const mobileMedian = mobileResults.length > 1 ? getMedian(mobileResults) : null
  const desktopMedian = desktopResults.length > 1 ? getMedian(desktopResults) : null

  if (mobileMedian) {
    resultsTable.median = {
      ...resultsTable.median,
      "mobile": mobileMedian
    }
  }

  if (desktopMedian) {
    resultsTable.median = {
      ...resultsTable.median,
      "desktop": desktopMedian
    }
  }
  console.table(resultsTable)
})();