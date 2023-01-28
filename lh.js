const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const constants = require('./constants.js')
const fs = require('fs')

const resultsTable = {}
const mobileResults = []
const desktopResults = []

const getMedian = (arr) => {
  arr.sort((a, b) => a - b)
  const mid = Math.floor(arr.length / 2)
  const median = arr.length % 2 === 1 ?
    arr[mid] : 
    (arr[mid - 1] + arr[mid]) / 2;
  return median;
}

const singleRun = async (target, device) => {
  const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
  let options = {
    logLevel: 'error',
    output: 'html',
    onlyCategories: ['performance'],
    port: chrome.port,
    throttling: constants.THROTTLING_MOBILE
  };

  if (device === "desktop") {
    options = {
      ...options,
      screenEmulation: constants.CONFIG_DESKTOP,
      formFactor: "desktop",
      throttling: constants.THROTTLING_DESKTOP
    }
  }

  const runnerResult = await lighthouse(target, options);
  fs.writeFileSync("lhReport.html", runnerResult.report)

  await chrome.kill();
  return runnerResult.lhr.categories.performance.score * 100
}

const loopRun = async (target, num, device) => {
  for (let currentRun = 1; currentRun <= num; currentRun++) {
    const currentResult = await singleRun(target, device)
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