function Tile(position, value) {
  this.row = position.row;
  this.column = position.column;
  this.value = value;

  // 新增prePosition属性
  this.prePosition = null;
  // 存储merged两个Tile
  this.mergedTiles = null;
}

Tile.prototype.updatePosition = function(position) {
  // 更新的时候，先将当前位置，保存为prePosition
  this.prePosition = { row: this.row, column: this.column };

  this.row = position.row;
  this.column = position.column;
};

Tile.prototype.serialize = function() {
  return {
    position: {
      row: this.row,
      column: this.column
    },
    value: this.value
  };
};
