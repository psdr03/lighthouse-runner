(async () => {
  const flag = process.argv.indexOf('-f')
  console.log(`flagIndex: ${flag}`)
  console.log(`value: ${process.argv[flag + 1]}`)

  console.log()
})();