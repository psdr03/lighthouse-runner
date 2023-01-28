import { singleRun, getMedian } from './utils.js'
import ora from 'ora'

const mobileResults = []
const desktopResults = []

const loopRun = async (target, num, device) => {
  for (let currentRun = 1; currentRun <= num; currentRun++) {
    const throbber = ora(`running ${device} number: ${currentRun}...`).start();
    const currentResult = await singleRun(target, device)
    if (currentResult) {
      throbber.stop()
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
  const targetIndex = process.argv.indexOf('--target')
  const deviceIndex = process.argv.indexOf('--device') 
  const countIndex = process.argv.indexOf('--count')

  if (targetIndex === -1 ) {
    throw Error('No target specified. Use `--target [website]`')
  }
  const targetValue = process.argv[targetIndex + 1]

  const deviceValue = deviceIndex !== -1 ? process.argv[deviceIndex + 1] : "all"
  if (deviceIndex === -1 || process.argv[deviceIndex + 1] === undefined) {
    console.log('No device selection specified, use `--device [mobile | desktop | all]` to set a device. Running with all')
  }

  const countValue = countIndex !== -1 ? process.argv[countIndex + 1] : 5
  if (countIndex === -1 || process.argv[countIndex + 1] === undefined) {
    console.log('No run count specified, use `--count [num]` to set the number of runs. Running with 5')
  } 

  if (deviceValue === "mobile") {
    await loopRun(targetValue, countValue, "mobile")
  } else if (deviceValue === "desktop") {
    await loopRun(targetValue, countValue, "desktop")
  } else {
    await loopRun(targetValue, countValue, "mobile")
    await loopRun(targetValue, countValue, "desktop")
  }

  const mobileMedian = mobileResults.length > 1 ? getMedian(mobileResults) : null
  const desktopMedian = desktopResults.length > 1 ? getMedian(desktopResults) : null

  const summaryTable = {}

  if (mobileMedian) {
    summaryTable.mobile = {
      min: Math.min(...mobileResults),
      max: Math.max(...mobileResults),
      median: mobileMedian
    }
  }

  if (desktopMedian) {
    summaryTable.desktop = {
      min: Math.min(...desktopResults),
      max: Math.max(...desktopResults),
      median: desktopMedian
    }
  }
  
  console.table(summaryTable)
})();