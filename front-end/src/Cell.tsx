import React from 'react';
import { Cell } from './types';

interface Props {
  cell: Cell;
}

const BoardCell: React.FC<Props> = ({ cell }) => {
  const cellClass = cell.text === 'X' ? 'x-cell' : 
                   cell.text === 'O' ? 'o-cell' : 'empty-cell';
  
  return (
    <div className={`cell ${cellClass}`}>
      {cell.text}
    </div>
  );
};

export default BoardCell;