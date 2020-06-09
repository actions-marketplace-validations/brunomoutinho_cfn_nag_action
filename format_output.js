const fs = require("fs");

const CFN_NAG_OUTPUT_FILE = "cfn_nag_scan_output.txt";

function flatten(acc = [], val) {
  return acc.concat(val);
}

function getTextFromFileAsJSON(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function unwrapViolationsPerLine(violation) {
  const { id, type, message, line_numbers: lineNumbers } = violation;

  // We need to format severity as this so that
  // GitHub can understand and create the right
  // annotations.
  let severity = type;
  if (type == "FAIL") {
    severity = "ERROR";
  } else if (type == "WARN") {
    severity = "WARNING";
  }

  const unwrappedViolations = lineNumbers.map((lineNumber) => ({
    id,
    severity,
    message,
    lineNumber,
  }));
  return unwrappedViolations;
}

function formatViolationAsOneLineMessage(violation) {
  const { id, severity, message, lineNumber } = violation;

  return `  ${severity} - ${id} - ${message} - ${lineNumber}`;
}

function formatIncidentObjects(file) {
  const {
    filename: fileName,
    file_results: { violations },
  } = file;

  const formattedViolations = violations
    .map(unwrapViolationsPerLine)
    .reduce(flatten, [])
    .map(formatViolationAsOneLineMessage);

  return {
    fileName,
    formattedViolations,
  };
}

function outputFormattedViolations(violationsList) {
  for ({ fileName, formattedViolations } of violationsList) {
    console.log(`File: ${fileName}`);
    for (violation of formattedViolations) {
      console.log(violation);
    }
  }
}

function main() {
  const cfnNagOutput = getTextFromFileAsJSON(CFN_NAG_OUTPUT_FILE);
  const formattedViolations = cfnNagOutput.map(formatIncidentObjects);

  outputFormattedViolations(formattedViolations);

  if (formattedViolations.length > 0) {
    // Exit with error so that GitHub can mark as not passing.
    process.exit(1);
  }
}

main();

