function Tile(position, value) {
  this.row = position.row;
  this.column = position.column;
  this.value = value;

  this.prePosition = null;
  this.mergedTiles = null;
}

Tile.prototype.updatePosition = function (position) {
  this.prePosition = { row: this.row, column: this.column };

  this.row = position.row;
  this.column = position.column;
};

Tile.prototype.serialize = function () {
  return {
    position: {
      row: this.row,
      column: this.column
    },
    value: this.value
  };
};
