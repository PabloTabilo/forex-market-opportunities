interface Result {
    hasNegativeCycle: boolean;
    paths: string[][];
  }
  
  export function bellmanFord(
    adjacencyList: { from: number; to: number; weight: number }[],
    numNodes: number,
    startNode: number
  ): Result {
    const distances = Array(numNodes).fill(Infinity);
    const predecessors = Array(numNodes).fill(null);
    distances[startNode] = 0;
  
    // Relax edges |V| - 1 times
    for (let i = 0; i < numNodes - 1; i++) {
      for (const { from, to, weight } of adjacencyList) {
        if (distances[from] + weight < distances[to]) {
          distances[to] = distances[from] + weight;
          predecessors[to] = from;
        }
      }
    }
  
    // Check for negative-weight cycles
    const paths: string[][] = [];
    for (const { from, to, weight } of adjacencyList) {
      if (distances[from] + weight < distances[to]) {
        // Negative cycle detected
        const cycle = [];
        let current = to;
  
        // Trace back the cycle
        for (let j = 0; j < numNodes; j++) {
          current = predecessors[current]!;
        }
  
        const cycleStart = current;
        do {
          cycle.push(current);
          current = predecessors[current]!;
        } while (current !== cycleStart);
        cycle.push(cycleStart);
  
        paths.push(cycle.reverse().map((node) => `Node ${node}`));
        return { hasNegativeCycle: true, paths };
      }
    }
  
    return { hasNegativeCycle: false, paths };
  }
  