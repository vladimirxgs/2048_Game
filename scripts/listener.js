function Listener({ move: moveFn, start: startFn }) {
  window.addEventListener('keyup', function(e) {
    switch (e.code) {
      case 'ArrowUp':
        moveFn({ row: -1, column: 0 });
        break;
      case 'ArrowLeft':
        moveFn({ row: 0, column: -1 });
        break;
      case 'ArrowRight':
        moveFn({ row: 0, column: 1 });
        break;
      case 'ArrowDown':
        moveFn({ row: 1, column: 0 });
        break;
    }
  });

  const buttons = document.querySelectorAll('button');
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function() {
      startFn();
    });
  }
}
