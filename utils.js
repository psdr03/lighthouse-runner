import lighthouse from 'lighthouse'
import chromeLauncher from 'chrome-launcher'
import { CONFIG_DESKTOP, THROTTLING_DESKTOP,THROTTLING_MOBILE } from './constants.js'
import fs from 'fs'

export const singleRun = async (target, device) => {
  const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
  let options = {
    logLevel: 'error',
    output: 'html',
    onlyCategories: ['performance'],
    port: chrome.port,
    throttling: THROTTLING_MOBILE
  };

  if (device === "desktop") {
    options = {
      ...options,
      screenEmulation: CONFIG_DESKTOP,
      formFactor: "desktop",
      throttling: THROTTLING_DESKTOP
    }
  }

  const runnerResult = await lighthouse(target, options);
  fs.writeFileSync("lhReport.html", runnerResult.report)

  await chrome.kill();
  return runnerResult.lhr.categories.performance.score * 100
}

export const getMedian = (arr) => {
  arr.sort((a, b) => a - b)
  const mid = Math.floor(arr.length / 2)
  const median = arr.length % 2 === 1 ?
    arr[mid] : 
    (arr[mid - 1] + arr[mid]) / 2;
  return median;
}