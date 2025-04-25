export interface Cell {
    x: number;
    y: number;
    text: string;
    playable: boolean;
  }
  
  export interface GameState {
    cells: Cell[];
    currentPlayer: string;
    winner: string | null;
  }