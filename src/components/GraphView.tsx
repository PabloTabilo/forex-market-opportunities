import * as d3 from "d3";
import React, { useEffect, useRef } from "react";
import { Node, Edge } from "../models/GraphModel";


interface GraphViewProps {
  nodes: Node[];
  edges: Edge[];
  width: number;
  height: number;
}

const GraphView: React.FC<GraphViewProps> = ({ nodes, edges, width, height }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    // Clear existing elements
    svg.selectAll("*").remove();

    // Initialize the simulation
    const simulation = d3.forceSimulation(nodes)
      .force(
        "link",
        d3.forceLink(edges)
          .id((d: any) => d.id)
          .distance(150)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .on("tick", ticked);

    // Draw edges as curved paths
    const link = svg
      .selectAll(".link")
      .data(edges)
      .enter()
      .append("g")
      .attr("class", "link");

    // Add curved paths for edges
    const path = link
      .append("path")
      .attr("stroke", "black")
      .attr("stroke-width", 1.5)
      .attr("fill", "none");

    // Add arrowheads as polygons along the curve
    const arrow = link
      .append("polygon")
      .attr("fill", "black");

    // Add edge labels
    const linkLabels = svg
      .selectAll(".link-label")
      .data(edges)
      .enter()
      .append("text")
      .attr("class", "link-label")
      .attr("font-size", "12px")
      .attr("fill", "black")
      .text((d: any) => d.weight.toFixed(2));

    // Draw nodes
    const node = svg
      .selectAll(".node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .call(
        d3.drag()
          .on("start", dragStarted)
          .on("drag", dragged)
          .on("end", dragEnded)
      );

    node.append("circle").attr("r", 20).attr("fill", (d: any) => d.color);

    node
      .append("text")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .text((d: any) => d.label);

    // Tick function for simulation
    function ticked() {
      path.attr("d", (d: any) => {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const dr = Math.sqrt(dx * dx + dy * dy) * 0.5; // Curvature

        // Create a quadratic Bezier curve
        return `
          M${d.source.x},${d.source.y}
          Q${d.source.x + dx / 2 - dy / 4},${d.source.y + dy / 2 + dx / 4}
          ${d.target.x},${d.target.y}
        `;
      });

      arrow.attr("points", (d: any) => {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
      
        // Calculate control point for the curve
        const cx = d.source.x + dx / 2 - dy / 4;
        const cy = d.source.y + dy / 2 + dx / 4;
      
        // Position arrow closer to the target (85% of the way)
        const arrowT = 0.84; // Adjust percentage to bring arrow closer
        const mx = (1 - arrowT) * (1 - arrowT) * d.source.x + 2 * (1 - arrowT) * arrowT * cx + arrowT * arrowT * d.target.x;
        const my = (1 - arrowT) * (1 - arrowT) * d.source.y + 2 * (1 - arrowT) * arrowT * cy + arrowT * arrowT * d.target.y;
      
        // Normalize the direction vector at the midpoint
        const length = Math.sqrt(dx * dx + dy * dy);
        const nx = dx / length;
        const ny = dy / length;
      
        // Arrowhead size
        const arrowLength = 14;
        const arrowWidth = 7;
      
        // Calculate arrowhead points
        const tipX = mx + nx * arrowLength; // Arrow tip
        const tipY = my + ny * arrowLength;
        const leftX = tipX - nx * arrowLength + ny * arrowWidth / 2;
        const leftY = tipY - ny * arrowLength - nx * arrowWidth / 2;
        const rightX = tipX - nx * arrowLength - ny * arrowWidth / 2;
        const rightY = tipY - ny * arrowLength + nx * arrowWidth / 2;
      
        return `${tipX},${tipY} ${leftX},${leftY} ${rightX},${rightY}`;
      });
      

      linkLabels
        .attr("x", (d: any) => {
          const dx = d.target.x - d.source.x;
          const dy = d.target.y - d.source.y;
          const cx = d.source.x + dx / 2 - dy / 4;
          const cy = d.source.y + dy / 2 + dx / 4;
          return (d.source.x + cx + d.target.x) / 3; // Average of points for label
        })
        .attr("y", (d: any) => {
          const dx = d.target.x - d.source.x;
          const dy = d.target.y - d.source.y;
          const cx = d.source.x + dx / 2 - dy / 4;
          const cy = d.source.y + dy / 2 + dx / 4;
          return (d.source.y + cy + d.target.y) / 3; // Average of points for label
        });

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    }

    // Drag event handlers
    function dragStarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragEnded(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => simulation.stop();
  }, [nodes, edges, width, height]);

  return <svg ref={svgRef} width={width} height={height} style={{ border: "1px solid black" }}></svg>;
};

export default GraphView;
