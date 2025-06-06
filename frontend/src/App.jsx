import React, { useState, useEffect } from "react";
import Terminal from "./components/Terminal";

const commandsToTrack = ["ls", "mkdir test", "cd test"];

export default function App() {
  const [progress, setProgress] = useState(["something"]);

  useEffect(() => {
    console.log("Updated progress:", progress);
  }, [progress]);

  const updateProgress = (cmd) => {
    const trimmed = cmd.trim();
    console.log(progress); //why progress is an empty array here

    setProgress((prev) => {
      console.log({ prev });
      if (commandsToTrack.includes(trimmed) && !prev.includes(trimmed))
        return [...prev, trimmed];
      return prev;
    });
    // console.log(cmd);
    // console.log(progress);
  };

  return (
    <div className="container">
      <h1>OS Lab Terminal Tracker</h1>
      <div className="terminal-wrapper">
        <Terminal onCommand={updateProgress} />
      </div>
      <div className="progress">
        <h2>Progress</h2>
        <ul>
          {commandsToTrack.map((cmd) => (
            <li key={cmd} className={progress.includes(cmd) ? "done" : ""}>
              {cmd}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
