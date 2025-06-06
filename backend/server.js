const express = require("express");
const cors = require("cors");
const { Server } = require("ws");
const pty = require("node-pty");
const { trackCommand, trackedCommands } = require("./tracker");

const app = express();
const port = 3000;
app.use(cors());

const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const wss = new Server({ server });

wss.on("connection", function connection(ws) {
  console.log("New connection");
  const shell = pty.spawn("bash", [], {
    name: "xterm-color",
    cols: 80,
    rows: 30,
    cwd: process.env.HOME,
    env: process.env,
  });

  const commandState = new Set();

  shell.on("data", function (data) {
    ws.send(JSON.stringify({ type: "output", data }));
  });

  ws.on("message", function (msg) {
    try {
      shell.write(msg);
      // const { type, data } = JSON.parse(msg);
      // if (type === "input") {
      //   shell.write(data);
      //   if (trackCommand(data, commandState)) {
      //     ws.send(
      //       JSON.stringify({
      //         type: "progress",
      //         progress: Array.from(commandState),
      //         total: trackedCommands,
      //       })
      //     );
      //   }
      // }
    } catch (e) {
      console.error("Invalid message:", msg);
    }
  });

  ws.on("close", function () {
    console.log("Session closed");
    shell.kill();
  });
});
