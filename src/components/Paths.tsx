import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface PathsProps {
  bellmanFordSolution: any; // Bellman-Ford solution
  recursiveSolution: any; // Recursive solution
  nodesMap: any; // Mapping of node IDs to labels
  matrixCost: number[][]; // Cost matrix
}

const Paths: React.FC<PathsProps> = ({
  bellmanFordSolution,
  recursiveSolution,
  nodesMap,
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

    const drawPath = (
      path: any[],
      offsetX: number,
      offsetY: number,
      pathWidth: number
    ) => {
      const nodeRadius = 20;
      const gap = pathWidth / (path.length - 1); // Adjust node spacing
      const gain = calculateGain(path);

      const group = svg
        .append("g")
        .attr("transform", `translate(${offsetX}, ${offsetY})`);

      path.forEach((edge, index) => {
        const x1 = index * gap;
        const y1 = 0;
        const x2 = (index + 1) * gap;
        const y2 = 0;

        // Draw line
        if (index < path.length - 1) {
          group
            .append("line")
            .attr("x1", x1)
            .attr("y1", y1)
            .attr("x2", x2)
            .attr("y2", y2)
            .attr("stroke", "green")
            .attr("stroke-width", 2)
            .attr("marker-end", "url(#arrow)");
        }

        // Draw source node
        group
          .append("circle")
          .attr("cx", x1)
          .attr("cy", y1)
          .attr("r", nodeRadius)
          .attr("fill", "white")
          .attr("stroke", "green")
          .attr("stroke-width", 2);

        group
          .append("text")
          .attr("x", x1)
          .attr("y", y1 + 5)
          .attr("text-anchor", "middle")
          .attr("font-size", "12px")
          .attr("fill", "black")
          .text(nodesMap[edge.from]);

        // Draw target node
        if (index === path.length - 1) {
          group
            .append("circle")
            .attr("cx", x2)
            .attr("cy", y2)
            .attr("r", nodeRadius)
            .attr("fill", "white")
            .attr("stroke", "green")
            .attr("stroke-width", 2);

          group
            .append("text")
            .attr("x", x2)
            .attr("y", y2 + 5)
            .attr("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("fill", "black")
            .text(nodesMap[edge.to]);
        }
      });

      // Add gain label
      group
        .append("text")
        .attr("x", path.length * gap + 20)
        .attr("y", 0)
        .attr("font-size", "14px")
        .attr("fill", "green")
        .text(`Gain: ${gain.toFixed(2)}`);
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

    const totalPaths = (bellmanFordSolution?.paths || []).length + (recursiveSolution?.paths || []).length;
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

    // Draw Recursive paths
    if (recursiveSolution?.paths) {
      recursiveSolution.paths.forEach((path: any) => {
        drawPath(path, (width - maxWidth) / 2, currentY, maxWidth);
        currentY += pathHeight;
      });
    }
  }, [bellmanFordSolution, recursiveSolution, nodesMap, matrixCost]);

  return (
    <svg ref={svgRef} style={{ width: "100%", height: "100%", border: "1px solid black" }}></svg>
  );
};

export default Paths;
