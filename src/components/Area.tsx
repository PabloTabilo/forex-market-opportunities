import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

function Area(){
  const [nodes, setNodes] = useState<{ x: number; y: number; id : number }[]>([]);
  const [edges, setEdges] = useState<{ source: number; target: number }[]>([]);
  const [selectedNodes, setSelectedNodes] = useState<number[]>([]); // Track selected nodes for edges
  
  const svgRef = useRef<SVGSVGElement>(null);

  const nodes_radius : number = 20;
  
  useEffect(() => {
    if (!svgRef.current) return;

    // Initialize the simulation with collision detection
    const simulation = d3
      .forceSimulation(nodes)
      .force("charge", d3.forceManyBody().strength(-5))
      .force(
        "collision",
        d3.forceCollide().radius(() => nodes_radius)
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
  
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    // Drag event handlers
    const drag = d3
      .drag<SVGCircleElement, { x: number; y: number }>()
      .on("start", (event, d) => {
        d3.select(event.sourceEvent.target).attr("stroke", "red");
      })
      .on("drag", (event, d) => {
        d.x = event.x;
        d.y = event.y;
        setNodes([...nodes]); // Update state to trigger re-render
      })
      .on("end", (event, d) => {
        d3.select(event.sourceEvent.target).attr("stroke", "currentColor");
      });

    svg
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", nodes_radius)
      .attr("fill", "white")
      .attr("stroke", "currentColor")
      .call(drag); // Attach drag behavior
  }, [nodes]);

  const handleClick = (event: React.MouseEvent) => {
    const [x, y] = d3.pointer(event, svgRef.current);

    // Check if a node already exists at the clicked position
    const clickedNode = nodes.find(
      (node) => Math.hypot(node.x - x, node.y - y) < nodes_radius
    );

    if (clickedNode) {
      // Add node to selectedNodes
      setSelectedNodes((prev) => {
        const newSelectedNodes = [...prev, clickedNode.id];
        if (newSelectedNodes.length === 2) {
          // Create an edge when two nodes are selected
          setEdges([...edges, { source: newSelectedNodes[0], target: newSelectedNodes[1] }]);
          return []; // Reset selectedNodes
        }
        return newSelectedNodes;
      });
    } else {
      // Create a new node if no existing node is clicked
      setNodes([...nodes, { x, y, id: nodes.length }]);
    }
  };
      
  return (
    <div>
      <svg
        ref={svgRef}
        width={640}
        height={400}
        onClick={handleClick} // Node creation is now tied to clicks
        style={{ border: "1px solid black" }}
      >
        {/* Render edges */}
        <g>
          {edges.map((edge, i) => (
            <line
              key={i}
              stroke="black"
              strokeWidth="1.5"
              x1={nodes.find((n) => n.id === edge.source)?.x || 0}
              y1={nodes.find((n) => n.id === edge.source)?.y || 0}
              x2={nodes.find((n) => n.id === edge.target)?.x || 0}
              y2={nodes.find((n) => n.id === edge.target)?.y || 0}
            />
          ))}
        </g>
        {/* Render nodes */}
        <g fill="white" stroke="currentColor" strokeWidth="1.5">
          {nodes.map((node, i) => (
            <circle key={i} cx={node.x} cy={node.y} r={nodes_radius} />
          ))}
        </g>
      </svg>
    </div>
  );
}

export default Area;