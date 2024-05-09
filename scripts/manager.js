function Manager(size = 4, aim = 2048) {
  this.size = size;
  this.aim = aim;
  this.render = new Render();
  this.storage = new Storage();
  let self = this;
  this.listener = new Listener({
    move: function(direction) {
      self.listenerFn(direction);
    },
    start: function() {
      self.start();
    }
  });
  this.defaultStart();
}

Manager.prototype.defaultStart = function() {
  const state = this.storage.getCellState();
  // 如果存在缓存则恢复
  if (state) {
    this.score = state.score;
    this.status = 'DOING';
    this.grid = new Grid(this.size, state.grid);
    this._render();
  } else {
    this.start();
  }
};

Manager.prototype.start = function() {
  this.score = 0;
  this.status = 'DOING';
  this.grid = new Grid(this.size);
  for (let i = 0; i < 2; i++) {
    //初始化
    this.addRandomTile();
  }
  this._render();
};

Manager.prototype._render = function() {
  // 渲染之前调用存储
  this.storage.setCellState({ score: this.score, grid: this.grid });
  this.render.render(this.grid, { score: this.score, status: this.status });
};

// 随机添加一个节点
Manager.prototype.addRandomTile = function() {
  const position = this.grid.randomAvailableCell();
  if (position) {
    // 90%概率为2，10%为4
    const value = Math.random() < 0.9 ? 2 : 4;
    // 随机一个方格的位置
    const position = this.grid.randomAvailableCell();
    // 添加到grid中
    this.grid.add(new Tile(position, value));
  }
};

// 移动核心逻辑
Manager.prototype.listenerFn = function(direction) {
  // 定义一个变量，判断是否引起移动
  let moved = false;

  const { rowPath, columnPath } = this.getPaths(direction);
  for (let i = 0; i < rowPath.length; i++) {
    for (let j = 0; j < columnPath.length; j++) {
      const position = { row: rowPath[i], column: columnPath[j] };
      const tile = this.grid.get(position);
      if (tile) {
        // 当此位置有Tile的时候才进行移动
        const { aim, next } = this.getNearestAvaibleAim(position, direction);

        // 区分合并和移动，当next值和tile值相同的时候才进行合并
        if (next && next.value === tile.value) {
          // 合并位置是next的位置，合并的value是tile.value * 2
          const merged = new Tile(
            {
              row: next.row,
              column: next.column
            },
            tile.value * 2
          );

          this.score += merged.value;
          //将合并以后节点，加入grid
          this.grid.add(merged);
          //在grid中删除原始的节点
          this.grid.remove(tile);
          //判断游戏是否获胜
          if (merged.value === this.aim) {
            this.status = 'WIN';
          }
          merged.mergedTiles = [tile, next];
          tile.updatePosition({ row: next.row, column: next.column });
          moved = true;
        } else {
          this.moveTile(tile, aim);
          moved = true;
        }
      }
    }
  }

  // 移动以后进行重新渲染
  if (moved) {
    this.addRandomTile();
    if (this.checkFailure()) {
      this.status = 'FAILURE';
    }
    this._render();
  }
};

// 移动Tile，先将grid中老位置删除，在添加新位置
Manager.prototype.moveTile = function(tile, aim) {
  this.grid.cells[tile.row][tile.column] = null;
  tile.updatePosition(aim);
  this.grid.cells[aim.row][aim.column] = tile;
};

// 根据方向，确定遍历的顺序
Manager.prototype.getPaths = function(direction) {
  let rowPath = [];
  let columnPath = [];
  for (let i = 0; i < this.size; i++) {
    rowPath.push(i);
    columnPath.push(i);
  }

  // 向右的时候
  if (direction.column === 1) {
    columnPath = columnPath.reverse();
  }

  // 向下的时候
  if (direction.row === 1) {
    rowPath = rowPath.reverse();
  }
  return {
    rowPath,
    columnPath
  };
};

// 寻找移动方向目标位置
Manager.prototype.getNearestAvaibleAim = function(aim, direction) {
  // 位置 + 方向向量的计算公式
  function addVector(position, direction) {
    return {
      row: position.row + direction.row,
      column: position.column + direction.column
    };
  }
  aim = addVector(aim, direction);

  // 获取grid中某个位置的元素
  let next = this.grid.get(aim);

  // 如果next元素存在（也就是此目标位置已经有Tile），或者是超出游戏边界，则跳出循环。目的：就是找到最后一个空白且不超过边界的方格
  while (!this.grid.outOfRange(aim) && !next) {
    aim = addVector(aim, direction);
    next = this.grid.get(aim);
  }

  // 这时候的aim总是多计算了一步，因此我们还原一下
  aim = {
    row: aim.row - direction.row,
    column: aim.column - direction.column
  };

  return {
    aim,
    next
  };
};

// 判断游戏是否失败
Manager.prototype.checkFailure = function() {
  // 获取空白的Cell
  const emptyCells = this.grid.availableCells();
  // 如果存在空白，则游戏肯定没有失败
  if (emptyCells.length > 0) {
    return false;
  }

  for (let row = 0; row < this.grid.size; row++) {
    for (let column = 0; column < this.grid.size; column++) {
      let now = this.grid.get({ row, column });

      // 根据4个方向，判断临近的Tile的Value值是否相同
      let directions = [
        { row: 0, column: 1 },
        { row: 0, column: -1 },
        { row: 1, column: 0 },
        { row: -1, column: 0 }
      ];
      for (let i = 0; i < directions.length; i++) {
        const direction = directions[i];
        const next = this.grid.get({
          row: row + direction.row,
          column: column + direction.column
        });
        // 判断Value是否相同
        if (next && next.value === now.value) {
          return false;
        }
      }
    }
  }
  return true;
};
