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
    label: string; // Exchange rate
  }
  
  export class GraphModel {
    nodes: Node[] = [];
    edges: Edge[] = [];
  
    constructor(initialNodes: Node[], initialEdges: Edge[]) {
      this.nodes = initialNodes;
      this.edges = initialEdges;
    }
  
    addNode(x: number, y: number, label: string): void {
      const id = this.nodes.length;
      const color = this.getRandomColor();
      this.nodes.push({ id, x, y, label, color });
    }
  
    addEdge(sourceId: number, targetId: number, label: string): void {
      this.edges.push({ source: sourceId, target: targetId, label });
    }
  
    getNodes(): Node[] {
      return this.nodes;
    }
  
    getEdges(): Edge[] {
      return this.edges;
    }

    getAdjacencyList() : {from : number, to : number, weight : number} [] {
        return this.edges.map((edge) => {
            const w = -Math.log(parseFloat(edge.label));
            return {from : edge.source, to : edge.target, weight : w};
        });
    }

    getAdjacencyMatrix() : number[][] {
        let n = this.nodes.length;
        let m : number[][] = new Array(n).fill(0).map(() => new Array(n).fill(0));
        this.edges.forEach((edge) => {
            m[edge.source][edge.target] = -Math.log(parseFloat(edge.label));
            m[edge.target][edge.source] = -Math.log(parseFloat(edge.label));
        });
        return m;
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
  