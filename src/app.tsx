/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useCallback, useRef } from 'react';
import { produce } from 'immer';

const numRows = 20;
const numCols = 60;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
];

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }

  return rows;
};

const App: React.FC = () => {
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });

  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid(g => {
      return produce(g, gridCopy => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSimulation, 100);
  }, []);

  return (
    <div id="container">
      <div
        className="grid"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${numCols}, 20px)`
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
              key={`${i}-${k}`}
              style={{
                width: 20,
                height: 20,
                border: 'solid 1px #444',
                backgroundColor: grid[i][k] ? '#444' : undefined
              }}
              onClick={() => {
                const newGrid = produce(grid, gridCopy => {
                  gridCopy[i][k] = gridCopy[i][k] ? 0 : 1;
                });

                setGrid(newGrid);
              }}
              onBlur={() => {
                const newGrid = produce(grid, gridCopy => {
                  gridCopy[i][k] = gridCopy[i][k] ? 0 : 1;
                });

                setGrid(newGrid);
              }}
            ></div>
          ))
        )}
      </div>
      <div className="controls">
        <a
          onClick={() => {
            setRunning(!running);
            if (!running) {
              runningRef.current = true;
              runSimulation();
            }
          }}
          href="#"
          className="btn start"
        >
          {running ? 'stop' : 'start'}
        </a>
        <a
          onClick={() => {
            const rows = [];
            for (let i = 0; i < numRows; i++) {
              rows.push(
                Array.from(Array(numCols), () => (Math.random() > 0.7 ? 1 : 0))
              );
            }

            setGrid(rows);
          }}
          href="#"
          className="btn random"
        >
          random
        </a>
        <a
          onClick={() => {
            setGrid(generateEmptyGrid());
            setRunning(false);
          }}
          href="#"
          className="btn clear"
        >
          clear
        </a>
      </div>
    </div>
  );
};

export default App;
