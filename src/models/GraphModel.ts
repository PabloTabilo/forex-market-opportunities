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
  
    private getRandomColor(): string {
      return `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Random hex color
    }
  }
  