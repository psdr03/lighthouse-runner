import { singleRun, getMedian, loopRun } from './utils.js'
import { DEVICES } from './constants.js'

(async () => {
  const targetIndex = process.argv.indexOf('--target')
  const deviceIndex = process.argv.indexOf('--device') 
  const countIndex = process.argv.indexOf('--count')
  const summaryTable = {}
  let mobileResults = []
  let desktopResults = []

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

  if (deviceValue === DEVICES.mobile) {
    mobileResults = await loopRun(targetValue, countValue, DEVICES.mobile)
  } else if (deviceValue === "desktop") {
    desktopResults = await loopRun(targetValue, countValue, DEVICES.desktop)
  } else {
    mobileResults = await loopRun(targetValue, countValue, DEVICES.mobile)
    desktopResults = await loopRun(targetValue, countValue, DEVICES.desktop)
  }

  const mobileMedian = mobileResults.length > 1 ? getMedian(mobileResults) : null
  const desktopMedian = desktopResults.length > 1 ? getMedian(desktopResults) : null

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

  if (mobileMedian || desktopMedian) {
    console.table(summaryTable)
  }
  
  return
})();