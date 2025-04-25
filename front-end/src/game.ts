interface GameState {
  cells: Cell[];
}

interface Cell {
  getText(): unknown;
  text: string;
  playable: boolean;
  x: number;
  y: number;
}

export type { GameState, Cell };
