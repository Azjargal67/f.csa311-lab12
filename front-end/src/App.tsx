import React from 'react';
import './App.css';
import { GameState, Cell } from './game';
import BoardCell from './Cell';

interface Props {}

interface State extends GameState {
  history: Cell[][];
  currentPlayer: string;
  winner: string | null;
}

class App extends React.Component<Props, State> {
  private initialized = false;

  constructor(props: Props) {
    super(props);
    this.state = {
      cells: [],
      history: [],
      currentPlayer: 'X',
      winner: null
    };
  }

  newGame = async () => {
    try {
      const response = await fetch('/newgame');
      const json = await response.json();
      this.setState({
        cells: json.cells,
        history: [],
        currentPlayer: 'X',
        winner: null
      });
    } catch (error) {
      console.error("New game fetch failed:", error);
    }
  };

  play = (x: number, y: number): React.MouseEventHandler => {
    return async (e) => {
      e.preventDefault();
      if (this.state.winner) return;
      
      try {
        const response = await fetch(`/play?x=${x}&y=${y}`);
        const json = await response.json();
        
        // Check for winner after each move
        const winnerResponse = await fetch('/checkwinner');
        const winnerData = await winnerResponse.json();
        
        this.setState((prevState) => ({
          cells: json.cells,
          history: [...prevState.history, prevState.cells],
          currentPlayer: prevState.currentPlayer === 'X' ? 'O' : 'X',
          winner: winnerData.winner || null
        }));
      } catch (error) {
        console.error("Play fetch failed:", error);
      }
    };
  };

  undo = async () => {
    if (this.state.history.length === 0) return;
    
    try {
      const response = await fetch('/undo');
      const json = await response.json();
      
      // Also fetch current player and winner after undo
      const playerResponse = await fetch('/currentplayer');
      const playerData = await playerResponse.json();
      
      const winnerResponse = await fetch('/checkwinner');
      const winnerData = await winnerResponse.json();
      
      this.setState(prevState => ({
        cells: json.cells,
        history: prevState.history.slice(0, -1),
        currentPlayer: playerData.currentPlayer,
        winner: winnerData.winner || null
      }));
    } catch (error) {
      console.error("Undo failed:", error);
    }
  };

  createCell = (cell: Cell, index: number) => {
    return (
      <div key={index} className="cell-container">
        {cell.playable ? (
          <a href="/" onClick={this.play(cell.x, cell.y)}>
            <BoardCell cell={cell} />
          </a>
        ) : (
          <BoardCell cell={cell} />
        )}
      </div>
    );
  };

  componentDidMount(): void {
    if (!this.initialized) {
      this.newGame();
      this.initialized = true;
    }
  }

  render(): React.ReactNode {
    const statusMessage = this.state.winner 
      ? `Winner: ${this.state.winner}`
      : `Current Player: ${this.state.currentPlayer}`;

    return (
      <div className="game-container">
        <h1>Tic Tac Toe</h1>
        <div className="status">{statusMessage}</div>
        <div id="board">
          {this.state.cells.map(this.createCell)}
        </div>
        <div id="bottombar">
          <button onClick={this.newGame}>New Game</button>
          <button 
            onClick={this.undo} 
            disabled={this.state.history.length === 0 || this.state.winner !== null}
          >
            Undo
          </button>
        </div>
      </div>
    );
  }
}

export default App;