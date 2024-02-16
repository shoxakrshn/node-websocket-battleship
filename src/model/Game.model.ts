import { Ship } from './Ship.model';

export class Game {
  private static lastId = 0;
  public gameId: number;
  public players: number[];
  public ships: Map<number, Ship[]>;
  public turn: number;

  constructor() {
    this.gameId = Game.generateNextId();
    this.players = [];
    this.ships = new Map();
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
}
