import * as d3 from "d3";
import React, {useEffect, useRef} from "react";
import { Node, Edge } from "../models/GraphModel";



interface GraphViewProps {
  nodes: Node[];
  edges: Edge[];
  onNodeClick: (nodeId: number) => void;
  width: number;
  height: number;
  mousePosition: { x: number; y: number };
}

const GraphView: React.FC<GraphViewProps> = ({ nodes, edges, onNodeClick, width, height, mousePosition }) => {
  const nodeRadius = 20;
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Initialize the simulation with collision detection
    const simulation = d3
      .forceSimulation(nodes)
      .force("charge", d3.forceManyBody().strength(-100))
      .force(
        "collision",
        d3.forceCollide().radius(() => nodeRadius)
      )
      .on("tick", () => {
        d3.select(svgRef.current)
          .selectAll("circle")
          .data(nodes)
          .attr("cx", (d) => d.x)
          .attr("cy", (d) => d.y);

        d3.select(svgRef.current)
          .selectAll("line")
          .data(edges)
          .attr("x1", (d) => nodes.find((n) => n.id === d.source)?.x || 0)
          .attr("y1", (d) => nodes.find((n) => n.id === d.source)?.y || 0)
          .attr("x2", (d) => nodes.find((n) => n.id === d.target)?.x || 0)
          .attr("y2", (d) => nodes.find((n) => n.id === d.target)?.y || 0);
      });

    return () => simulation.stop();
  }, [nodes, edges]);

  return (
    <svg
    ref={svgRef} 
    width={width} 
    height={height} 
    style={{ border: "1px solid black" }}>
      {/* Render edges */}
      <g>
        {edges.map((edge, i) => {
          const source = nodes.find((node) => node.id === edge.source);
          const target = nodes.find((node) => node.id === edge.target);
          const formattedLabel = edge.weight;
          return (
            source &&
            target && (
              <g key={i}>
                <line
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke="black"
                  strokeWidth="1.5"
                />
                {/* Edge label */}
                <text
                  x={(source.x + target.x) / 2}
                  y={(source.y + target.y) / 2 - 10}
                  textAnchor="middle"
                  fontSize="15px"
                  fill="black"
                >
                  {formattedLabel}
                </text>
              </g>
            )
          );
        })}
      </g>
      {/* Render nodes */}
      <g>
        {nodes.map((node) => (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y} 
              r={nodeRadius}
              fill={node.color}
              stroke="currentColor"
              onClick={() => onNodeClick(node.id)}
            />
            {/* Node label */}
            <text
              x={node.x}
              y={node.y - nodeRadius - 5}
              textAnchor="middle"
              fontSize="18px"
              fill="black"
            >
              {node.label}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
};

export default GraphView;
