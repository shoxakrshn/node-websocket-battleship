export class User {
  public wins: number;

  constructor(
    public index: number,
    public name: string,
    public password: string,
  ) {
    this.wins = 0;
  }
}
