const fs = require("fs");

const trackedCommands = JSON.parse(fs.readFileSync("./trackedCommands.json"));
function sanitize(input) {
  return input.trim().split(" ")[0];
}

function trackCommand(cmd, state) {
  const sanitized = sanitize(cmd);
  if (trackedCommands.includes(sanitized) && !state.has(sanitized)) {
    state.add(sanitized);
    return true;
  }
  return false;
}

module.exports = { trackCommand, trackedCommands };
