type RoomUsersType = {
  name: string;
  index: number;
};

export class Room {
  private static lastId = 0;
  public roomId: number;

  constructor(public roomUsers: RoomUsersType[] = []) {
    this.roomId = Room.generateNextId();
  }

  addUser(user: RoomUsersType) {
    this.roomUsers.push(user);
  }

  private static generateNextId = () => {
    this.lastId += 1;
    return this.lastId;
  };
}
