import React, { useState } from "react";
import GraphView from "../components/GraphView";
import Paths from "../components/Paths"; // Import the Paths component
import { GraphModel, Node, Edge } from "../models/GraphModel";
import { Solve } from "../models/Solve";
import {BellmanFord} from '../models/BellmanFord';
import {FloydWarshall} from '../models/Floyd-Warshall';


const GraphController: React.FC = () => {
    // we can start with USD
    const initialNodes: Node[] = [
        { id: 0, x: 350, y: 550, label: "USD", color: "#FF5733" },
        { id: 1, x: 550, y: 140, label: "EUR", color: "#33FF57" },
        { id: 2, x: 650, y: 300, label: "JPY", color: "#3357FF" },
        { id: 3, x: 350, y: 150, label: "CLP", color : `#${Math.floor(Math.random() * 16777215).toString(16)}`},
    ];

    const initialEdges: Edge[] = [
        // ref USD
        { source: 0, target: 1, weight: 0.9 },
        { source: 0, target: 2, weight: 1./0.0095 },
        { source: 0, target: 3, weight: 976.18 },
         // ref EUR
        { source: 1, target: 0, weight: 1./0.9 },
        { source: 1, target: 2, weight: 120 },
        { source: 1, target: 3, weight: 1026.3 },
        // ref JPY
        { source: 2, target: 0, weight: 0.0095 },
        { source: 2, target: 1, weight: 0.00083 },
        { source: 2, target: 3, weight: 6.3390 },
        // ref CLP
        { source: 3, target: 0, weight: 0.0010242},
        { source: 3, target: 1, weight: 0.00097467},
        { source: 3, target: 2, weight: 0.15781},
        
    ];

  const [graph] = useState(new GraphModel(initialNodes, initialEdges));
  const [bellmanFordSolution, setBellmanFordSolution] = useState<any>(null); // Store Bellman-Ford solution
  const [recursiveSolution, setRecursiveSolution] = useState<any>(null); // Store Recursive solution
  const [FloydWarshallSolution, setFloydWarshallSolution] = useState<any>(null); // Store Recursive solution

  const runSolve = () => {
    const adjacencyMatrix = graph.getAdjacencyMatrix();
    const sol = Solve(adjacencyMatrix, 0);
    setRecursiveSolution(sol); // Pass Recursive solution to Paths
    console.log(sol);
  };

  const runFW = () => {
    const adjacencyMatrix = graph.getAdjacencyMatrix();
    const sol = FloydWarshall(adjacencyMatrix);
    setFloydWarshallSolution(sol); // Pass Bellman-Ford solution to Paths
    console.log(sol);
  };

  const runBF= () => {
    const adjacencyMatrix = graph.getAdjacencyMatrix();
    const sol = BellmanFord(adjacencyMatrix, 0);
    setBellmanFordSolution(sol); // Pass Bellman-Ford solution to Paths
    console.log(sol);
  };

  return (
    <div className="area-container">
        
        <GraphView
          nodes={graph.getNodes()}
          edges={graph.getEdges()}
        />
        
        <button onClick={runSolve}>Run RecursiveSol</button>
        <button onClick={runBF}>Run BellmanFord</button>
        <button onClick={runFW}>Run FloydWarshall</button>

        <Paths
          bellmanFordSolution={bellmanFordSolution}
          recursiveSolution={recursiveSolution}
          floydWarshallSolution={FloydWarshallSolution}
          nodes={graph.getNodes()}
          matrixCost={graph.getAdjacencyMatrixNotLog()}
        />
    </div>
  );
};

export default GraphController;
