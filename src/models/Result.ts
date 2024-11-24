export interface Result {
    hasNegativeCycle: boolean;
    paths: { from: number; to: number }[][];
}