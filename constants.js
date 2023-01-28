const DEVTOOLS_RTT_ADJUSTMENT_FACTOR = 3.75
const DEVTOOLS_THROUGHPUT_ADJUSTMENT_FACTOR = 0.9

const CONFIG_DESKTOP = {
  mobile: false,
  width: 1350,
  height: 940,
  deviceScaleFactor: 1,
  disabled: false
}

const THROTTLING_DESKTOP = {
  rttMs: 40,
  throughputKbps: 10 * 1024,
  cpuSlowdownMultiplier: 1,
  requestLatencyMs: 0,
  downloadThroughputKbps: 0,
  uploadThroughputKbps: 0,
}

const THROTTLING_MOBILE = {
  rttMs: 150,
  throughputKbps: 1638.4,
  requestLatencyMs: 150 * DEVTOOLS_RTT_ADJUSTMENT_FACTOR,
  downloadThroughputKbps: 700 * DEVTOOLS_THROUGHPUT_ADJUSTMENT_FACTOR,
  uploadThroughputKbps: 700 * DEVTOOLS_THROUGHPUT_ADJUSTMENT_FACTOR,
  cpuSlowdownMultiplier: 4
}

module.exports = {
  CONFIG_DESKTOP,
  THROTTLING_DESKTOP,
  THROTTLING_MOBILE
}

