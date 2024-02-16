export class Player {
  private static lastId = 0;
  public gameId: number;

  constructor(public userId: number) {
    this.gameId = Player.generateNextId();
  }

  private static generateNextId = () => {
    this.lastId += 1;
    return this.lastId;
  };
}
