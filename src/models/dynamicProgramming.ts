

let n = -1;
let globalStartNode = -1;

let sol: {
    [key: number]: { cost: number; mask: number; paths: { from: number; to: number }[] }[];
} = {};

let cache : Set<string>;

function getNoBits(int : number){
    const binary = (int).toString(2);
    return [...binary].filter(el => el === '1').length;
  }

function f(cost : number, mask : number, last : number, matrix : number[][], paths : {from : number, to : number}[]){
    const stateKey = `${mask}-${last}`;

    if(cache.has(stateKey)){
        console.log(`Skipping already visited state: ${stateKey}`);
        return;
    }

    cache.add(stateKey);

    console.log("cost:", cost);
    console.log("mask:", mask);
    console.log("last:", last);
    console.log("paths:",paths);

    let bits = getNoBits(mask);

    console.log("bits:",bits);

    // if mask && (1 << startNode) comeback to startNode, is a cycle
    // bits > 2 : has more than two nodes on the solution
    // cost < 0
    if( ( (mask & (1<<globalStartNode)) !== 0) && bits > 2 && cost < 0){
        if(!sol[bits]){
            sol[bits] = [];
        }
        sol[bits].push({cost, mask, paths : [...paths]});
        console.log("found a solution!")
    }
    
    // cycle to soon
    if( ( (mask & (1<<globalStartNode)) !== 0) && bits <= 2){
        console.log("cycle too soon!");
        return;
    }

    // complete cycle
    if(mask === (1 << n)-1){
        console.log("cycle is complete!")
        return;
    }

    for(let j = 0; j < n; j++){
        if( (mask & (1<<j)) === 0){
            paths.push({from: last, to : j});
            f(cost + matrix[last][j], mask | (1 << j), j, matrix, paths);
            paths.pop();
        }
    }
}

export function dynamicProgramming(
    matrix : number[][],
    startNode : number,
){
    n = matrix[0].length;
    globalStartNode = startNode;
    cache = new Set();
    let i = startNode;

    for(let j = 0; j < n; j++){
        if(i !== j){
            const mask = 0; // Activar bit del nodo inicial
            const paths: { from: number; to: number }[] = [{ from: i, to: j }];
            f(matrix[i][j], mask | (1 << j), j, matrix, paths);
        }
    }

    return sol;
}