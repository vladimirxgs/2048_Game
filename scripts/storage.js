const BestScoreKey = '2048BestScore';
const CellStateKey = '2048CellState';

function Storage() { }

Storage.prototype.setCellState = function ({ score, grid }) {
  window.localStorage.setItem(
    CellStateKey,
    JSON.stringify({
      score,
      grid: grid.serialize()
    })
  );
};

Storage.prototype.getCellState = function () {
  const cellState = window.localStorage.getItem(CellStateKey);
  return cellState ? JSON.parse(cellState) : null;
};
