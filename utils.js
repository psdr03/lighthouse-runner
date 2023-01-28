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
  const sorted = arr.slice().sort((a, b) => a - b);
  if (sorted.length % 2 === 1) return sorted[(sorted.length - 1) / 2];
  const lowerValue = sorted[sorted.length / 2 - 1];
  const upperValue = sorted[sorted.length / 2];
  return (lowerValue + upperValue) / 2;
}