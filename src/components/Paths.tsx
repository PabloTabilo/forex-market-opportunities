import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface Node {
  id: number;
  x: number;
  y: number;
  label: string;
  color: string;
}

interface PathsProps {
  bellmanFordSolution: any; // Bellman-Ford solution
  recursiveSolution: any; // Recursive solution
  floydWarshallSolution: any;
  nodes: Node[]; // Nodes with colors and labels
  matrixCost: number[][]; // Cost matrix
}

const Paths: React.FC<PathsProps> = ({
  bellmanFordSolution,
  recursiveSolution,
  floydWarshallSolution,
  nodes,
  matrixCost,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const calculateGain = (path: any[]) => {
    return path.reduce(
      (acc, edge) => acc * matrixCost[edge.from][edge.to],
      1
    );
  };

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous content

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const nodeMap = new Map(nodes.map((node) => [node.id, node]));

    const drawPath = (
      path: any[],
      offsetX: number,
      offsetY: number,
      pathWidth: number
    ) => {
      const nodeRadius = 20; // Radius of the nodes
      const gap = pathWidth / path.length; // Adjust node spacing
      const gain = calculateGain(path);
    
      const group = svg
        .append("g")
        .attr("transform", `translate(${offsetX}, ${offsetY})`);
    
      path.forEach((edge, index) => {
        const x1 = index * gap;
        const y1 = 0;
        const x2 = (index + 1) * gap;
        const y2 = 0;
    
        // Adjust line endpoint to stop at the edge of the node
        const lineEndOffset = nodeRadius; // Stop the line at the edge of the node
        const dx = x2 - x1;
        const dy = y2 - y1;
        const length = Math.sqrt(dx * dx + dy * dy);
        const unitDx = (dx / length) * lineEndOffset;
        const unitDy = (dy / length) * lineEndOffset;
    
        // Draw line with arrow
        group
          .append("line")
          .attr("x1", x1 + unitDx) // Start slightly inside the node
          .attr("y1", y1 + unitDy)
          .attr("x2", x2 - unitDx) // End slightly before the next node
          .attr("y2", y2 - unitDy)
          .attr("stroke", "green")
          .attr("stroke-width", 2)
          .attr("marker-end", "url(#arrow)");
    
        // Add edge cost label with improved positioning
        const cost = matrixCost[edge.from][edge.to].toFixed(6);
        group
          .append("text")
          .attr("x", (x1 + x2) / 2) // Position at the midpoint of the line
          .attr("y", y1 - 12) // Slightly above the line
          .attr("text-anchor", "middle")
          .attr("font-size", cost.length > 8 ? "10px" : "12px") // Adjust font size for longer numbers
          .attr("fill", "black")
          .text(cost);
    
        // Draw source node
        const sourceNode = nodeMap.get(edge.from);
        if (sourceNode) {
          group
            .append("circle")
            .attr("cx", x1)
            .attr("cy", y1)
            .attr("r", nodeRadius)
            .attr("fill", sourceNode.color)
            .attr("stroke", "green")
            .attr("stroke-width", 2);
    
          group
            .append("text")
            .attr("x", x1)
            .attr("y", y1 + 5)
            .attr("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("fill", "black")
            .text(sourceNode.label);
        }
      });
    
      // Handle the final node and edge
      const lastEdge = path[path.length - 1];
      const x1 = (path.length - 1) * gap;
      const y1 = 0;
      const x2 = path.length * gap;
      const y2 = 0;
    
      const dxFinal = x2 - x1;
      const dyFinal = y2 - y1;
      const lengthFinal = Math.sqrt(dxFinal * dxFinal + dyFinal * dyFinal);
      const unitDxFinal = (dxFinal / lengthFinal) * nodeRadius;
      const unitDyFinal = (dyFinal / lengthFinal) * nodeRadius;
    
      group
        .append("line")
        .attr("x1", x1 + unitDxFinal) // Start slightly inside the node
        .attr("y1", y1 + unitDyFinal)
        .attr("x2", x2 - unitDxFinal) // End slightly before the last node
        .attr("y2", y2 - unitDyFinal)
        .attr("stroke", "green")
        .attr("stroke-width", 2)
        .attr("marker-end", "url(#arrow)");
    
      const finalCost = matrixCost[lastEdge.from][lastEdge.to].toFixed(6);
      group
        .append("text")
        .attr("x", (x1 + x2) / 2) // Position at the midpoint of the line
        .attr("y", y1 - 12) // Slightly above the line
        .attr("text-anchor", "middle")
        .attr("font-size", finalCost.length > 8 ? "10px" : "12px") // Adjust font size for longer numbers
        .attr("fill", "black")
        .text(finalCost);
    
      const finalNode = nodeMap.get(lastEdge.to);
      if (finalNode) {
        group
          .append("circle")
          .attr("cx", x2)
          .attr("cy", y2)
          .attr("r", nodeRadius)
          .attr("fill", finalNode.color)
          .attr("stroke", "green")
          .attr("stroke-width", 2);
    
        group
          .append("text")
          .attr("x", x2)
          .attr("y", y2 + 5)
          .attr("text-anchor", "middle")
          .attr("font-size", "12px")
          .attr("fill", "black")
          .text(finalNode.label);
      }
    
      // Add gain label after the final node
      group
        .append("text")
        .attr("x", x2 + 30) // Position to the right of the last node
        .attr("y", y2)
        .attr("font-size", "14px")
        .attr("fill", "green")
        .text(`Gain: ${gain.toFixed(6)}`);
    };
    
    
    

    // Add arrowhead marker definition
    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrow")
      .attr("markerWidth", 10)
      .attr("markerHeight", 10)
      .attr("refX", 6)
      .attr("refY", 3)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,0 L0,6 L9,3 Z")
      .attr("fill", "black");

    const totalPaths =
      (bellmanFordSolution?.paths || []).length +
      (recursiveSolution?.paths || []).length;
    const maxWidth = width * 0.8; // Occupy 80% of the width
    const pathHeight = height / totalPaths; // Divide height evenly

    let currentY = pathHeight / 2;

    // Draw Bellman-Ford paths
    if (bellmanFordSolution?.paths) {
      bellmanFordSolution.paths.forEach((path: any) => {
        drawPath(path, (width - maxWidth) / 2, currentY, maxWidth);
        currentY += pathHeight;
      });
    }

    // Draw floydWarshallSolution paths
    if (floydWarshallSolution?.paths) {
      floydWarshallSolution.paths.forEach((path: any) => {
        drawPath(path, (width - maxWidth) / 2, currentY, maxWidth);
        currentY += pathHeight;
      });
    }

    // Draw Recursive paths
    if (recursiveSolution?.paths) {
      recursiveSolution.paths.forEach((path: any) => {
        drawPath(path, (width - maxWidth) / 2, currentY, maxWidth);
        currentY += pathHeight;
      });
    }
  }, [bellmanFordSolution, recursiveSolution, floydWarshallSolution, nodes, matrixCost]);

  return <svg ref={svgRef} style={{ width: "100%", height: "100%" }}></svg>;
};

export default Paths;
