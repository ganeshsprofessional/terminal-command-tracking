import React, { useEffect, useRef } from "react";
import { Terminal as XTerm } from "xterm";
import "xterm/css/xterm.css";

export default function Terminal({ onCommand }) {
  const terminalRef = useRef(null);
  const socketRef = useRef(null);
  const term = useRef(null);
  let commandBuffer = "";

  useEffect(() => {
    term.current = new XTerm({
      cursorBlink: true,
      theme: {
        background: "#1a1a1a",
        foreground: "#ffffff",
      },
    });

    term.current.open(terminalRef.current);

    socketRef.current = new WebSocket("ws://localhost:3000");

    socketRef.current.onopen = () => {
      term.current.write("Connected to terminal backend\r\n");
    };

    socketRef.current.onmessage = (event) => {
      term.current.write(JSON.parse(event.data).data);
    };

    term.current.onData((data) => {
      socketRef.current.send(data.toString());
      // console.log(data);

      if (data === "\r") {
        onCommand(commandBuffer);
        commandBuffer = "";
      } else if (data === "\u007f") {
        commandBuffer = commandBuffer.slice(0, -1);
      } else {
        commandBuffer += data;
      }
    });

    return () => {
      socketRef.current.close();
      term.current.dispose();
    };
  }, []);

  return <div ref={terminalRef} style={{ width: "100%", height: "400px" }} />;
}
