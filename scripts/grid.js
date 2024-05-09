//grid.js
function Grid(size = 4, state) {
  this.size = size;
  this.cells = [];
  this.init(size);
  // 如果有之前的进度，则恢复
  if (state) {
    this.recover(state);
  }
}

Grid.prototype.recover = function({ size, cells }) {
  this.size = size;
  // 遍历这个二维数组，如果某个cell存在，则新建一个Tile节点。
  for (let row = 0; row < this.size; row++) {
    for (let column = 0; column < this.size; column++) {
      const cell = cells[row][column];
      if (cell) {
        this.cells[row][column] = new Tile(cell.position, cell.value);
      }
    }
  }
};

// prototype 设置方法
Grid.prototype.init = function(size) {
  for (let row = 0; row < size; row++) {
    this.cells.push([]);
    for (let column = 0; column < size; column++) {
      this.cells[row].push(null);
    }
  }
};

Grid.prototype.add = function(tile) {
  this.cells[tile.row][tile.column] = tile;
};

Grid.prototype.remove = function(tile) {
  this.cells[tile.row][tile.column] = null;
};

// 获取所有可用方格的位置
Grid.prototype.availableCells = function() {
  const availableCells = [];
  for (let row = 0; row < this.cells.length; row++) {
    for (let column = 0; column < this.cells[row].length; column++) {
      // 如果当前方格没有内容，则其可用（空闲）
      if (!this.cells[row][column]) {
        availableCells.push({ row, column });
      }
    }
  }
  return availableCells;
};

// 随机获取某个可用方格的位置
Grid.prototype.randomAvailableCell = function() {
  // 获取到所有的空闲方格
  const cells = this.availableCells();
  if (cells.length > 0) {
    // 利用Math.random()随机获取其中的某一个
    return cells[Math.floor(Math.random() * cells.length)];
  }
};

// 获取某个位置的Tile
Grid.prototype.get = function(position) {
  if (this.outOfRange(position)) {
    return null;
  }
  return this.cells[position.row][position.column];
};

// 判断某个位置是否超出边界
Grid.prototype.outOfRange = function(position) {
  return (
    position.row < 0 ||
    position.row >= this.size ||
    position.column < 0 ||
    position.column >= this.size
  );
};

Grid.prototype.serialize = function() {
  const cellState = [];

  // cellState 是一个二维数组，分别存储整个Grid信息。
  // 如果该位置有Tile, 则返回 Tile序列化结果
  // 如果该位置没有Tile，则存储null
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
