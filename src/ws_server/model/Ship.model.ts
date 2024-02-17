export interface ShipInfo {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
}

export class Ship {
  public position: { x: number; y: number };
  public direction: boolean;
  public length: number;
  public type: 'small' | 'medium' | 'large' | 'huge';
  public shipPositionMap: Map<string, boolean>;

  constructor({ position, direction, length, type }: ShipInfo) {
    this.position = position;
    this.direction = direction;
    this.length = length;
    this.type = type;
    this.shipPositionMap = this.generateShip();
  }

  private generateShip() {
    const map = new Map<string, boolean>();

    for (let i = 0; i < this.length; i += 1) {
      if (this.direction) {
        map.set(`${this.position.x}-${this.position.y + i}`, false);
      } else {
        map.set(`${this.position.x + i}-${this.position.y}`, false);
      }
    }

    return map;
  }

  getStatus() {
    const values: boolean[] = Array.from(this.shipPositionMap.values());
    const result = values.every((value) => value === true);
    return result ? 'killed' : 'shot';
  }
}
