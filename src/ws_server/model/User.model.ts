export class User {
  public wins: number;
  public rooms: number[];

  constructor(
    public index: number,
    public name: string,
    public password: string,
  ) {
    this.wins = 0;
    this.rooms = [];
  }

  public addRoom = (roomId: number) => {
    this.rooms.push(roomId);
  };

  public clearRoom = () => {
    this.rooms = [];
  };
}
