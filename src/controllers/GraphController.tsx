import React, { useState } from "react";
import GraphView from "../components/GraphView";
import { GraphModel, Node, Edge } from "../models/GraphModel";

interface GraphControllerProps {
  width: number;
  height: number;
}

// we can start with USD
const initialNodes: Node[] = [
  { id: 0, x: 100, y: 200, label: "USD", color: "#FF5733" },
  { id: 1, x: 300, y: 100, label: "EUR", color: "#33FF57" },
  { id: 2, x: 500, y: 300, label: "JPY", color: "#3357FF" },
  { id: 3, x: 150, y: 150, label: "GBP", color : `#${Math.floor(Math.random() * 16777215).toString(16)}`},
  { id: 4, x: 150, y: 350, label: "CAD", color : `#${Math.floor(Math.random() * 16777215).toString(16)}`},
];

const initialEdges: Edge[] = [
  { source: 0, target: 1, label: "0.943" },
  { source: 0, target: 3, label: "0.78891" },
  { source: 0, target: 4, label: "1.401" },
  { source: 1, target: 2, label: "120" },
  { source: 2, target: 0, label: "0.0092" },
];

const GraphController: React.FC<GraphControllerProps> = ({ width, height }) => {
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

  return (
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
  );
};

export default GraphController;
