//render.js
function Render() {
  this.tileContainer = document.querySelector('.tile-container');
  this.scoreContainer = document.querySelector('.now .value');
  this.statusContainer = document.querySelector('.status');
}

// 渲染整个grid
Render.prototype.render = function(grid, { score, status }) {
  this.empty();
  this.renderScore(score);
  this.renderStatus(status);
  for (let row = 0; row < grid.size; row++) {
    for (let column = 0; column < grid.size; column++) {
      // 如果grid中某个cell不为空，则渲染这个cell
      if (grid.cells[row][column]) {
        this.renderTile(grid.cells[row][column]);
      }
    }
  }
};

Render.prototype.renderScore = function(score) {
  this.scoreContainer.innerHTML = score;
};

Render.prototype.renderStatus = function(status) {
  if (status === 'DOING') {
    this.statusContainer.style.display = 'none';
    return;
  }
  this.statusContainer.style.display = 'flex';
  this.statusContainer.querySelector('.content').innerHTML =
    status === 'WIN' ? 'You Win!' : 'Game Over!';
};

// 清空tileContainer
Render.prototype.empty = function() {
  this.tileContainer.innerHTML = '';
};

// 渲染单个tile
Render.prototype.renderTile = function(tile) {
  // 创建一个tile-inner
  const tileInner = document.createElement('div');
  tileInner.setAttribute('class', 'tile-inner');
  tileInner.innerHTML = tile.value;

  // 创建一个tile
  const tileDom = document.createElement('div');
  let classList = [
    'tile',
    `tile-${tile.value}`,
    `tile-position-${tile.row + 1}-${tile.column + 1}`
  ];

  if (tile.prePosition) {
    // 先设置之前的位置
    classList[2] = `tile-position-${tile.prePosition.row + 1}-${tile.prePosition
      .column + 1}`;
    // 延迟设置当前的位置
    setTimeout(function() {
      classList[2] = `tile-position-${tile.row + 1}-${tile.column + 1}`;
      tileDom.setAttribute('class', classList.join(' '));
    }, 16);
  } else if (tile.mergedTiles) {
    classList.push('tile-merged');
    //如果有mergedTiles，则渲染mergedTile的两个Tile
    tileDom.setAttribute('class', classList.join(' '));
    for (let i = 0; i < tile.mergedTiles.length; i++) {
      this.renderTile(tile.mergedTiles[i]);
    }
  } else {
    classList.push('tile-new');
  }

  tileDom.setAttribute('class', classList.join(' '));
  tileDom.appendChild(tileInner);
  this.tileContainer.appendChild(tileDom);
};
