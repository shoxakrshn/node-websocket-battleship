import { Ship } from './Ship.model';

export class Game {
  private static lastId = 0;
  public gameId: number;
  public players: number[];
  public ships: Map<number, Ship[]>;
  public turn: number;
  public board: Map<number, Map<string, boolean>>;

  constructor() {
    this.gameId = Game.generateNextId();
    this.players = [];
    this.ships = new Map();
    this.board = new Map();
  }

  private static generateNextId = () => {
    this.lastId += 1;
    return this.lastId;
  };

  addPlayer = (playerId: number) => {
    this.players.push(playerId);
  };

  addShips = (playerId: number, ships: Ship[]) => {
    this.ships.set(playerId, ships);
  };

  public createBoard(playerId: number) {
    // const array = new Array(10);
    // for (let i = 0; i < 10; i++) {
    //   array[i] = new Array(10).fill(false);
    // }
    // return array;
    const matrixSize = 10; // Размер матрицы
    const matrixMap = new Map();

    for (let x = 0; x < matrixSize; x++) {
      for (let y = 0; y < matrixSize; y++) {
        matrixMap.set(`${x}-${y}`, false); // Добавляем координаты и значение в Map
      }
    }

    this.board.set(playerId, matrixMap);
  }
}
