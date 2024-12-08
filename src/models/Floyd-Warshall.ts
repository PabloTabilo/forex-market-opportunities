import { Result } from './Result';
import { normalizeToZero } from './Utils';

export function FloydWarshall(matrix: number[][]): Result {
    const n = matrix.length;
    const dp = Array.from({ length: n }, () => Array(n).fill(Infinity));
    const parent = Array.from({ length: n }, () => Array(n).fill(-1));

    // Initialize dp and parent
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (i === j) {
                dp[i][j] = 0;
            } else {
                dp[i][j] = matrix[i][j];
            }
            // If there's a direct edge from i to j and i != j
            if (i !== j && matrix[i][j] !== Infinity && !isNaN(matrix[i][j])) {
                parent[i][j] = i;
            }
        }
    }

    // Floyd-Warshall Algorithm
    for (let k = 0; k < n; k++) {
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                const newDist = normalizeToZero(dp[i][k] + dp[k][j]);
                if (newDist < dp[i][j]) {
                    dp[i][j] = newDist;
                    parent[i][j] = parent[k][j]; 
                    // Update parent to reflect the path now goes through k
                }
            }
        }
    }

    // Detect negative cycles:
    // If dp[i][i] < 0, there's a negative cycle reachable from i.
    for (let i = 0; i < n; i++) {
        if (dp[i][i] < 0) {
            // Reconstruct the cycle
            const cycle = reconstructNegativeCycle(i, parent, i, n);
            if (cycle.length > 0) {
                // Convert the cycle (list of nodes) into {from, to} edges
                const pathEdges = [];
                for (let idx = 0; idx < cycle.length - 1; idx++) {
                    pathEdges.push({ from: cycle[idx], to: cycle[idx + 1] });
                }
                return {
                    hasNegativeCycle: true,
                    paths: [pathEdges],
                };
            }
        }
    }

    return {
        hasNegativeCycle: false,
        paths: [],
    };
}

/**
 * Reconstruct a negative cycle involving node 'start'.
 * We use 'start' as both the beginning and reference. We know dp[start][start] < 0.
 * parent[i][j] is the predecessor of j in the shortest path from i.
 * 
 * Steps:
 * 1. Pick the vertex 'start'.
 * 2. Move backwards n times using parent[start][v] to ensure we get into the cycle.
 * 3. From that point, keep tracking predecessors until we hit the starting vertex again.
 */
function reconstructNegativeCycle(source: number, parent: number[][], start: number, n: number): number[] {
    // v is our candidate node on the cycle
    let v = start;
    // Step 2: move backwards n times to ensure we're inside the cycle
    for (let i = 0; i < n; i++) {
        if (parent[source][v] !== -1) {
            v = parent[source][v];
        } else {
            // If no parent, can't reconstruct from here.
            return [];
        }
    }

    const cycleNodes = [v];
    let current = parent[source][v];
    while (current !== v && current !== -1) {
        cycleNodes.push(current);
        current = parent[source][current];
    }
    cycleNodes.push(v);
    cycleNodes.reverse();
    return cycleNodes;
}
