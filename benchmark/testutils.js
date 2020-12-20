const fuzzaldrinPlus = require("../fuzzaldrin-dist")
const legacy = require("fuzzaldrin-plus")

let performance = null

try {
  performance = require("perf_hooks").performance
} catch {
  performance = window.performance
}

/*function areArraysEqual2(a, b) {
  if (a.length != b.length)
    return false
  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i])
      return false
  }
  return true
}*/

function areArraysEqual(a, b) {
  a = new Set(a)
  b = new Set(b)
  if (a.size !== b.size) return false
  for (const a_item of a) {
    if (!b.has(a_item)) return false
  }
  return true
}

function start_timer() {
  return performance.now()
}

function elapsed_time(timer_start_time) {
  const time_final = performance.now()
  return Math.round(time_final - timer_start_time)
}

function doFilterTest(test_name, lines, query, params) {
  console.log(`====== Running test - query:${query} ======`)
  const timer_start_time = start_timer()
  const res_actual = fuzzaldrinPlus.filter(lines, query, params)
  const elapsed = elapsed_time(timer_start_time)

  const timer_start_time_legacy = start_timer()
  const res_expected = legacy.filter(lines, query)
  const elapsed_legacy = elapsed_time(timer_start_time_legacy)

  if (res_actual.length != res_expected.length) {
    console.error(`Results count changed! ${res_actual.length} instead of ${res_expected.length}`)
    process.exit(1)
  }
  if (!areArraysEqual(res_actual, res_expected)) {
    console.error(`Results different`)
    console.error(` counts: ${res_actual.length}`)
    process.exit(1)
  }

  console.log(`Elapsed time - fuzzaldrin-plus-fast: ${elapsed} ms vs. fuzzaldrin-plus: ${elapsed_legacy} ms\n`)
  console.log(`length of the result: ${res_actual.length}, length of the lines: ${lines.length}`)
  if (elapsed > elapsed_legacy) {
    console.error(`====== fuzzaldrin-plus-fast is SLOWER`)
  }
  console.log("")
}

function averageArray(nums) {
  return nums.reduce((a, b) => a + b, 0) / nums.length || 0
}

module.exports = {
  start_timer,
  elapsed_time,

  doFilterTest,
  averageArray,
}
