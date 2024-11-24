interface Result {
    hasNegativeCycle: boolean;
    paths: string[][];
  }

let n = -1;
let globalStartNode = -1;
let dp;
let matrix : number[][];

let sol: {
    [key: number]: { cost: number; mask: number; paths: { from: number; to: number }[] }[];
} = {};

let cache : Set<string>;

function getNoBits(int : number){
    const binary = (int).toString(2);
    return [...binary].filter(el => el === '1').length;
  }

function f(cost : number, mask : number, paths : {from : number, to : number, cost: number}[]){
    let last_conn = paths[paths.length-1];
    let last = last_conn.to;
    const stateKey = `${mask}-${last_conn.from}-${last_conn.to}`;
    
    if(cache.has(stateKey)){
        //console.log(`Skipping already visited state: ${stateKey}`);
        return;
    }

    //cache.add(stateKey);
    //console.log("mask:", mask);
    //console.log("paths:");
    //paths.forEach((p)=>console.log(p));
    //console.log("Total cost:", cost);
    let bits = getNoBits(mask);
    // if mask && (1 << startNode) comeback to startNode, is a cycle
    // bits > 2 : has more than two nodes on the solution
    // cost < 0
    if( ( (mask & (1<<globalStartNode)) !== 0) && bits > 2 && cost < 0){
        if(!sol[bits]){
            sol[bits] = [];
        }
        sol[bits].push({cost, mask, paths : [...paths]});
        //console.log("found a solution!")
    }
    
    // cycle to soon
    if( ( (mask & (1<<globalStartNode)) !== 0) && bits <= 2){
        //console.log("cycle too soon!");
        return;
    }

    // complete cycle
    if(mask === (1 << n)-1){
        //console.log("cycle is complete!")
        return;
    }

    for(let j = 0; j < n; j++){
        if( (mask & (1<<j)) === 0){
            paths.push({from: last, to : j, cost: matrix[last][j]});
            f(cost + matrix[last][j], mask | (1 << j), paths);
            paths.pop();
        }
    }
}

// Recursive solution
// Pros:
// - find all cycles with size k
// Cons:
// - TC its exponential
// - Works for a finite size of nodes, using mask maybe 2^32
export function Solve(
    m : number[][],
    startNode : number,
){
    matrix = m;
    n = matrix[0].length;
    globalStartNode = startNode;
    cache = new Set();
    let i = startNode;

    for(let j = 0; j < n; j++){
        if(i !== j){
            const mask = 0; // Activar bit del nodo inicial
            const paths: { from: number; to: number, cost: number }[] = [{ from: i, to: j, cost: matrix[i][j] }];
            f(matrix[i][j], mask | (1 << j), paths);
        }
    }

    return sol;
}

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

// Bellman ford 
// Pro:
// - TC is polynomial O(E * V)
// Cons:
// - only find one cycle not all cycles.
interface EdgeBf{
    to: number;
    weight: number;
}

export function BellmanFord(
    matrix : number[][],
    s : number,
){
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

    // Run BF
    for(let start = 0; start < n; start++){
        distance.fill(Infinity);
        predecessors.fill(-1);
        distance[start] = 0;
        // Relax edges
        for(let k = 0; k < n-1; k++){
            console.log("k = ",k);
            for(let u = 0; u < n; u++){
                for(const edge of graph[u]){
                    const {to: v, weight} = edge;
                    const newDist = normalizeToZero(distance[u] + weight);
                    console.log(`from u = ${u} -> to = ${v}, weight = ${weight}`);
                    console.log(`distance[u] + weight = ${distance[u]} + ${weight}`); 
                    console.log(`distance[u] + weight = ${newDist} vs distance[v] = ${distance[v]}`);
                    
                    if(check_nearest(newDist, distance[v])){
                        distance[v] = newDist;
                        predecessors[v] = u;
                        console.log("update >> distance =", distance);
                        console.log("update >> predecessors =", predecessors);
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
                    const cycle = [];
                    let current = v;
                    const visited = new Set();

                    // To ensure we find the actual cycle, traverse up to 'n' times
                    for (let i = 0; i < n; i++) {
                        current = predecessors[current];
                    }

                    // Now, reconstruct the cycle
                    const cycleStart = current;
                    do {
                        cycle.push(current);
                        current = predecessors[current];
                    } while (current !== cycleStart);

                    cycle.push(cycleStart);
                    cycle.reverse();
                    return cycle;

                }
            }
        }

    }
    
    return -1;
}

// Others approach
// To do and to Think:
// 0, 1, 2, 3, 4
    /*
    k connection
    0: dp[0][0]
    1: dp[0][1] + dp[1][0]

    2:
    dp[0][1] + dp[1][2] + dp[2][0]
    dp[0][1] + dp[1][3] + dp[3][0]
    dp[0][1] + dp[1][4] + dp[4][0]

    1:
    dp[0][2] + dp[2][0]
    
    2:
    dp[0][2] + dp[2][1] + dp[1][0]
    dp[0][2] + dp[2][3] + dp[3][0]
    dp[0][2] + dp[2][4] + dp[4][0]

    1: 
    dp[0][3] + dp[3][0]
    2:
    dp[0][3] + dp[3][1] + dp[1][0]
    dp[0][3] + dp[3][2] + dp[2][0]
    dp[0][3] + dp[3][4] + dp[4][0]

    1: 
    dp[0][4] + dp[4][0]
    2:
    dp[0][4] + dp[4][1] + dp[1][0]
    dp[0][4] + dp[4][2] + dp[2][0]
    dp[0][4] + dp[4][3] + dp[3][0]
    
    3:
    dp[0][1] + dp[1][2] + dp[2][3] + dp[3][0]
    dp[0][1] + dp[1][2] + dp[2][4] + dp[4][0]

    for(let k = 0; k < n; k++){
        for(let i = 0; i < n; i++){
            for(let j = 0; j < n; j++){
                dp[i][j] = Math.min(dp[i][j], dp[i][k] + dp[k][j]);
            }
        }
    }

*/