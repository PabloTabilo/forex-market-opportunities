import React, { useEffect, useRef, useState } from "react";
import GraphController from "../controllers/GraphController";

const Area: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 640, height: 400 });

  useEffect(() => {
    if (!containerRef.current) return;

    // Resize observer to track dimensions of the container
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      const { width, height } = entry.contentRect;
      setDimensions({ width, height });
    });

    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      <GraphController width={dimensions.width} height={dimensions.height} />
    </div>
  );
};

export default Area;
