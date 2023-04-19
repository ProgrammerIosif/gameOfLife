function stop() {
  state.play = false;
}

function start() {
  if(state.play) return;
  state.play = true;
  step();
}

function next() {
  start();
  setTimeout(() => {
    stop()
  }, 100);
}

function step() {
  if(!state.play) return;
  const neighbours = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  const newMatrix = [];
  
  for(let i = 0; i < state.matrix.length; i++){
    newMatrix.push([]);
    for(let j = 0; j < state.matrix[i].length; j++){
      let aliveNeighbours = 0;
      const cellState = state.matrix[i][j];
      for(n of neighbours)
        if(i + n[0] >= 0 && i+n[0] < state.matrix.length && j+n[1] >= 0 && j+n[1] < state.matrix[i].length /* bounds */
            && state.matrix[i + n[0]][j + n[1]] === 1 /* neighbour is alive */) 
          aliveNeighbours++;
      newMatrix[i].push((cellState === 1 && (aliveNeighbours === 2 || aliveNeighbours === 3) 
          || cellState === 0 && aliveNeighbours === 3) ? 1 : 0);
    }
  }

  //updating the screen
  for(let i = 0; i < state.matrix.length; i++) 
    for(let j = 0; j < state.matrix[0].length; j++)
      if(newMatrix[i][j] !== state.matrix[i][j])
        toggleCellState(i,j);

  state.matrix = newMatrix;
  if(state.play)
    setTimeout(() => {
      step(); 
    }, 500);
}

function toggleCellState(x,y){
  const cell = document.getElementById(`cell-${x}-${y}`);
  state.matrix[x][y] = state.matrix[x][y] == 1 ? 0 : 1
  cell.classList.toggle('checked');
}

function setDimension(width, height) {
  state.matrix = [];
  const container = document.getElementById('container');
  container.innerHTML = '';
  for(let i = 0; i < width; i++){
    const row = document.createElement('div');
    row.classList.add('row');
    container.appendChild(row);
    state.matrix.push([]);
    for(let j = 0; j < height; j++){
      state.matrix[i][j] = 0;
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.id = `cell-${i}-${j}`;
      cell.addEventListener('mousedown', () => toggleCellState(i,j))
      row.appendChild(cell);
    }
  }
}

function getDimension() {
  const width = document.getElementById('width').value;
  const height = document.getElementById('height').value;
  if(width > 0 && width <= 100 && height > 0 && height <= 100)
    setDimension(width, height);
  else
    prompt("width and height must be between 1 and 100");
}

const state = {matrix:[],play: false};
setDimension(16,16);