export interface Node {
    id: number;
    x: number;
    y: number;
    label: string;
    color: string;
  }
  
  export interface Edge {
    source: number;
    target: number;
    weight: number;
  }
  
  export class GraphModel {
    nodes: Node[] = [];
    edges: Edge[] = [];
    m : number[][] = [];
    n : number = 0;
    
  
    constructor(initialNodes: Node[], initialEdges: Edge[]) {
      this.nodes = initialNodes;
      this.edges = initialEdges;
      this.n = this.nodes.length;
      this.m = new Array(this.n).fill(0).map(() => new Array(this.n).fill(0));
      this.edges.forEach((edge) => {
        this.m[edge.source][edge.target] = edge.weight;
      });
    }
  
    addNode(x: number, y: number, label: string): void {
      const id = this.nodes.length;
      const color = this.getRandomColor();
      this.nodes.push({ id, x, y, label, color });
    }
  
    addEdge(sourceId: number, targetId: number, weight: number): void {
      this.edges.push({ source: sourceId, target: targetId, weight });
    }
  
    getNodes(): Node[] {
      return this.nodes;
    }
  
    getEdges(): Edge[] {
      return this.edges;
    }
    
    getBidirectionEdges(): Edge[] {
      let bidirectionalEdges : Edge[] = [];
      this.edges.forEach((edge) => {
        bidirectionalEdges.push({source : edge.source, target : edge.target, weight : edge.weight});
        bidirectionalEdges.push({source : edge.target, target : edge.source, weight : 1.0 / edge.weight});
      });
    return bidirectionalEdges;
    }

    getAdjacencyList() : {from : number, to : number, weight : number} [] {
        return this.edges.map((edge) => {
            return {from : edge.source, to : edge.target, weight : -Math.log(edge.weight)};
        });
    }

    getAdjacencyMatrix() : number[][] {
      let mlog : number[][] = new Array(this.n).fill(0).map(() => new Array(this.n).fill(0));
      for(let i = 0; i < this.n; i++){
        for(let j = 0; j < this.n; j++){
          mlog[i][j] = -Math.log(this.m[i][j]);
        }
      }
      return mlog;
    }

    getAdjacencyMatrixNotLog() : number[][] {
      return this.m;
  }
    getMapNodeid(){
        let map_nodeid : {[key : number] : string} = {};
        this.nodes.forEach((node) => {
            map_nodeid[node.id] = node.label;
        })
        return map_nodeid;
    }
  
    private getRandomColor(): string {
      return `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Random hex color
    }
  }
  