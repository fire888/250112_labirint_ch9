export default {
  spec_dir: "spec",
  spec_files: [
    "**/*[sS]pec.?(m)ts"
  ],
  helpers: [
    "helpers/**/*.?(m)ts"
  ],
  env: {
    stopSpecOnExpectationFailure: false,
    random: true,
    forbidDuplicateNames: true
  }
}
