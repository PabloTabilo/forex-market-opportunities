import { Result } from './Result';

let debug = false;
let n = -1;
let globalStartNode = -1;

// Bellman ford 
// Pro:
// - TC is polynomial O(E * V)
// Cons:
// - only find one cycle not all cycles.

function normalizeToZero(value : number, epsilon : number = 1e-12){
  if(Math.abs(value) < epsilon){
      return 0;
  }
  return value;
}

function check_nearest(new_distance : number, current_distance : number, epsilon : number = 1e-12) : boolean{
  if(Math.abs(new_distance - current_distance) < epsilon){
      return false;
  }
  return (new_distance < current_distance);
}

interface EdgeBf{
  to: number;
  weight: number;
}

export function BellmanFord(
  matrix : number[][],
  s : number,
): Result{
  n = matrix[0].length;
  globalStartNode = s;

  const graph : EdgeBf[][] = [];
  const distance = new Array(n).fill(Infinity);
  const predecessors = new Array(n).fill(-1);

  // Build graph for BF
  for(let i=0;i<n;i++){
      graph[i] = [];
      for(let j=0;j<n;j++){
          if(i !== j){
              graph[i].push({to : j, weight: matrix[i][j]});
          }
      }
  }

  const paths: { from: number; to: number }[][] = [];

  // Run BF for each node as start node
  for(let start = 0; start < n; start++){
      distance.fill(Infinity);
      predecessors.fill(-1);
      distance[start] = 0;
      // Relax edges
      for(let k = 0; k < n-1; k++){
        if(debug) console.log("relax k = ",k);
          for(let u = 0; u < n; u++){
              for(const edge of graph[u]){
                  const {to: v, weight} = edge;
                  const newDist = normalizeToZero(distance[u] + weight);
                  if(debug) console.log(`from u = ${u} -> to = ${v}, weight = ${weight}`);
                  if(debug) console.log(`distance[u] + weight = ${distance[u]} + ${weight}`); 
                  if(debug) console.log(`distance[u] + weight = ${newDist} vs distance[v] = ${distance[v]}`);
                  
                  if(check_nearest(newDist, distance[v])){
                      distance[v] = newDist;
                      predecessors[v] = u;
                      if(debug) console.log("update >> distance =", distance);
                      if(debug) console.log("update >> predecessors =", predecessors);
                  }
              }
          }
      }

      // Check for negative cycles
        for(let u = 0; u < n; u++){
          for(const edge of graph[u]){
              const {to: v, weight} = edge;
              if(distance[u] + weight < distance[v]){
                  // This is a negative cycle
                  const cycle : number[] = [];
                  let current = v;
                  //const visited = new Set<number>();

                  // To ensure we find the actual cycle, traverse up to 'n' times
                  for (let i = 0; i < n; i++) {
                      current = predecessors[current];
                  }

                  // Now, reconstruct the cycle
                  const cycleStart = current;
                  do {
                      cycle.push(current);
                      //visited.add(current);
                      current = predecessors[current];
                  } while (current !== cycleStart);

                  cycle.push(cycleStart);
                  cycle.reverse();
                  // Convert cycle to path format
                const path = [];
                for (let i = 0; i < cycle.length - 1; i++) {
                    path.push({
                    from: cycle[i],
                    to: cycle[i + 1],
                    });
                }

                paths.push(path);

                return {
                    hasNegativeCycle: true,
                    paths : paths,
                  };

              }
          }
      }

  }
  
  return {
    hasNegativeCycle: false,
    paths: [],
  };
}