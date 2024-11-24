import { Result } from './Result';

let debug = false;
let n = -1;
let globalStartNode = -1;
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
        if(debug) console.log(`Skipping already visited state: ${stateKey}`);
        return;
    }

    //cache.add(stateKey);
    if(debug) console.log("mask:", mask);
    if(debug) console.log("paths:");
    if(debug) paths.forEach((p)=>console.log(p));
    if(debug) console.log("Total cost:", cost);
    let bits = getNoBits(mask);
    // if mask && (1 << startNode) comeback to startNode, is a cycle
    // bits > 2 : has more than two nodes on the solution
    // cost < 0
    if( ( (mask & (1<<globalStartNode)) !== 0) && bits > 2 && cost < 0){
        if(!sol[bits]){
            sol[bits] = [];
        }
        sol[bits].push({cost, mask, paths : [...paths]});
        if(debug) console.log("found a solution!")
    }
    
    // cycle to soon
    if( ( (mask & (1<<globalStartNode)) !== 0) && bits <= 2){
        if(debug) console.log("cycle too soon!");
        return;
    }

    // complete cycle
    if(mask === (1 << n)-1){
        if(debug) console.log("cycle is complete!")
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
// - find all cycles with size k from a starting node
// Cons:
// - TC its exponential
// - Works for a finite size of nodes, using mask maybe 2^32
export function Solve(
    m : number[][],
    startNode : number,
): Result{
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

    // Aggregate results from `sol`
    let hasNegativeCycle = false;
    const paths: { from: number; to: number }[][] = [];

    for (const bitCount in sol) {
        if (sol[bitCount].length > 0) {
            hasNegativeCycle = true;
            for (const entry of sol[bitCount]) {
                paths.push(
                    entry.paths.map((path) => ({
                        from: path.from,
                        to: path.to,
                    }))
                );
            }
        }
    }

    return {
        hasNegativeCycle,
        paths,
    };
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