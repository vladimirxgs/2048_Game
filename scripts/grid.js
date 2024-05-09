function Grid(size = 4, state) {
  this.size = size;
  this.cells = [];
  this.init(size);
  if (state) {
    this.recover(state);
  }
}

Grid.prototype.recover = function ({ size, cells }) {
  this.size = size;
  for (let row = 0; row < this.size; row++) {
    for (let column = 0; column < this.size; column++) {
      const cell = cells[row][column];
      if (cell) {
        this.cells[row][column] = new Tile(cell.position, cell.value);
      }
    }
  }
};

Grid.prototype.init = function (size) {
  for (let row = 0; row < size; row++) {
    this.cells.push([]);
    for (let column = 0; column < size; column++) {
      this.cells[row].push(null);
    }
  }
};

Grid.prototype.add = function (tile) {
  this.cells[tile.row][tile.column] = tile;
};

Grid.prototype.remove = function (tile) {
  this.cells[tile.row][tile.column] = null;
};

Grid.prototype.availableCells = function () {
  const availableCells = [];
  for (let row = 0; row < this.cells.length; row++) {
    for (let column = 0; column < this.cells[row].length; column++) {
      if (!this.cells[row][column]) {
        availableCells.push({ row, column });
      }
    }
  }
  return availableCells;
};

Grid.prototype.randomAvailableCell = function () {
  const cells = this.availableCells();
  if (cells.length > 0) {
    return cells[Math.floor(Math.random() * cells.length)];
  }
};

Grid.prototype.get = function (position) {
  if (this.outOfRange(position)) {
    return null;
  }
  return this.cells[position.row][position.column];
};

Grid.prototype.outOfRange = function (position) {
  return (
    position.row < 0 ||
    position.row >= this.size ||
    position.column < 0 ||
    position.column >= this.size
  );
};

Grid.prototype.serialize = function () {
  const cellState = [];

  for (let row = 0; row < this.size; row++) {
    cellState[row] = [];
    for (let column = 0; column < this.size; column++) {
      cellState[row].push(
        this.cells[row][column] ? this.cells[row][column].serialize() : null
      );
    }
  }

  return {
    size: this.size,
    cells: cellState
  };
};
