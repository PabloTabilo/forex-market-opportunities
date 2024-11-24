import React, { useState } from "react";
import GraphView from "../components/GraphView";
import { GraphModel, Node, Edge } from "../models/GraphModel";
import { Solve } from "../models/Solve";
import {BellmanFord} from '../models/BellmanFord';

interface GraphControllerProps {
  width: number;
  height: number;
}

const GraphController: React.FC<GraphControllerProps> = ({ width, height }) => {
    // we can start with USD
    const initialNodes: Node[] = [
        { id: 0, x: 350, y: 550, label: "USD", color: "#FF5733" },
        { id: 1, x: 550, y: 140, label: "EUR", color: "#33FF57" },
        { id: 2, x: 650, y: 300, label: "JPY", color: "#3357FF" },
        //{ id: 3, x: 350, y: 150, label: "GBP", color : `#${Math.floor(Math.random() * 16777215).toString(16)}`},
        //{ id: 4, x: 250, y: 350, label: "CAD", color : `#${Math.floor(Math.random() * 16777215).toString(16)}`},
        //{ id: 5, x: 450, y: 150, label: "CLP", color : `#${Math.floor(Math.random() * 16777215).toString(16)}`},
        //{ id: 6, x: 630, y: 450, label: "CNY", color : `#${Math.floor(Math.random() * 16777215).toString(16)}`},
    ];

    const initialEdges: Edge[] = [
        // ref USD
        { source: 0, target: 1, weight: 0.9 }, // EUR
        { source: 0, target: 2, weight: 1./0.0095 }, // JPY
        
        //{ source: 0, target: 3, label: "0.78891" }, // GBP
        //{ source: 0, target: 4, label: "1.401" }, // CAD
        //{ source: 0, target: 5, label: "973.01" }, // CLP
        //{ source: 0, target: 6, label: "7.2376" }, // CNY

         // ref EUR
         //{ source: 1, target: 0, weight: 1./0.9 }, // USA
        { source: 1, target: 2, weight: 120 }, // JPY
        //{ source: 1, target: 3, label: "0.83574" }, // GBP
        //{ source: 1, target: 4, label: "1.4851" }, // CAD
        //{ source: 1, target: 5, label: "1,030.8" }, // CLP
        //{ source: 1, target: 6, label: "7.6675" }, // CNY

         // ref JPY
         //{ source: 2, target: 0, weight: 0.0095 }, // JPY
         //{ source: 2, target: 1, weight: "0.00083" }, // JPY
         //{ source: 2, target: 3, label: "0.0051002" }, // GBP
         //{ source: 2, target: 4, label: "0.0090643" }, // CAD
         //{ source: 2, target: 5, label: "6.2915" }, // CLP
         //{ source: 2, target: 6, label: "0.046799" }, // CNY

         // ref GBP
         //{ source: 3, target: 4, label: "1.7773" }, // CAD
         //{ source: 3, target: 6, label: "9.1750" }, // CNY
         //{ source: 3, target: 5, label: "1,233.4" }, // CLP

         // ref CAD
         //{ source: 4, target: 5, label: "693.98" }, // CLP
         //{ source: 4, target: 6, label: "5.1623" }, // CNY

         // ref CLP
         //{ source: 5, target: 6, label: "0.0074388" }, // CNY
        
    ];

  const [graph] = useState(new GraphModel(initialNodes, initialEdges));
  const [selectedNodes, setSelectedNodes] = useState<number[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleNodeClick = (nodeId: number) => {
    setSelectedNodes((prev) => {
      const newSelected = [...prev, nodeId];
      if (newSelected.length === 2) {
        const [source, target] = newSelected;
        const label = prompt("Enter exchange rate:") || "";
        graph.addEdge(source, target, label);
        setSelectedNodes([]);
      }
      return newSelected;
    });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    const rect = (event.target as SVGSVGElement).getBoundingClientRect();
    setMousePosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  const runSolve = () => {
    //const adjacencyList = graph.getAdjacencyList();
    const adjacencyMatrix = graph.getAdjacencyMatrix();
    const nodes = graph.getMapNodeid();

    console.log(adjacencyMatrix);
    console.log(nodes)

    const sol = Solve(adjacencyMatrix, 0);

    console.log(sol);

    /*
    const result = bellmanFord(adjacencyList, graph.nodes.length, 0); // Start from USD (Node 0)
    if (result.hasNegativeCycle) {
      console.log("Negative cycles found:");
      result.paths.forEach((path, index) =>
        console.log(`Cycle ${index + 1}: ${path.join(" -> ")}`)
      );
    } else {
      console.log("No negative cycles found.");
    }
*/
  };

  const runBF = () => {
    //const adjacencyList = graph.getAdjacencyList();
    const adjacencyMatrix = graph.getAdjacencyMatrix();
    const nodes = graph.getMapNodeid();

    console.log(adjacencyMatrix);
    console.log(nodes)

    const sol = BellmanFord(adjacencyMatrix, 0);

    console.log(sol);

    /*
    const result = bellmanFord(adjacencyList, graph.nodes.length, 0); // Start from USD (Node 0)
    if (result.hasNegativeCycle) {
      console.log("Negative cycles found:");
      result.paths.forEach((path, index) =>
        console.log(`Cycle ${index + 1}: ${path.join(" -> ")}`)
      );
    } else {
      console.log("No negative cycles found.");
    }
*/
  };

  return (
    <div>
        <button onClick={runSolve}>Run RecursiveSol</button>
        <button onClick={runBF}>Run BellmanFord</button>
        <div onMouseMove={handleMouseMove}>
        <GraphView
            nodes={graph.getNodes()}
            edges={graph.getEdges()}
            onNodeClick={handleNodeClick}
            width={width}
            height={height}
            mousePosition={mousePosition}
        />
        </div>
    </div>
  );
};

export default GraphController;
