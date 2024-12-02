import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface PathsProps {
  bellmanFordSolution: any; // Bellman-Ford solution
  recursiveSolution: any; // Recursive solution
}

const Paths: React.FC<PathsProps> = ({ bellmanFordSolution, recursiveSolution }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous content

    const drawPaths = (paths: any[], label: string, color: string, yOffset: number) => {
      paths.forEach((path, index) => {
        const accumulatedExchange = path.reduce(
          (acc: number, edge: any) => acc * edge.weight,
          1
        );

        svg
          .append("text")
          .attr("x", 10)
          .attr("y", yOffset + index * 20)
          .text(
            `${label} ${index + 1}: ${path
              .map((edge: any) => `${edge.from} -> ${edge.to}`)
              .join(" -> ")}, Gain: ${
              isNaN(accumulatedExchange) ? "N/A" : accumulatedExchange.toFixed(2)
            }`
          )
          .attr("fill", color)
          .attr("font-size", "12px");
      });
    };

    // Draw Bellman-Ford solutions in blue
    if (bellmanFordSolution?.paths) {
      drawPaths(bellmanFordSolution.paths, "BF Path", "blue", 20);
    }

    // Draw Recursive solutions in green
    if (recursiveSolution?.paths) {
      drawPaths(recursiveSolution.paths, "Recursive Path", "green", 100);
    }
  }, [bellmanFordSolution, recursiveSolution]);

  return (
    <div style={{ width: "100%", height: "100%", overflow: "auto", padding: "10px" }}>
      <svg ref={svgRef} style={{ width: "100%", height: "100%" }}></svg>
    </div>
  );
};

export default Paths;
