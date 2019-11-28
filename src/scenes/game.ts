import * as Phaser from 'phaser';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game',
};

export class GameScene extends Phaser.Scene {
  constructor() {
    super(sceneConfig);
    this.pause = false;
    this.bounds = [];
    this.colours = {
      purple: {
        number: 0xBE52F2,
        string: '#BE52F2',
      },
      blue: {
        number: 0x6979F8,
        string: '#6979F8',
      },
      yellow: {
        number: 0xFFCF5C,
        string: '#FFCF5C',
      },
      orange: {
        number: 0xFFA26B,
        string: '#FFA26B',
      },
      cyan: {
        number: 0x0084F4,
        string: '#0084F4',
      },
      green: {
        number: 0x00C48C,
        string: '#00C48C',
      },
      pink: {
        number: 0xFF647C,
        string: '#FF647C',
      },
      black: {
        number: 0x1A051D,
        string: '#1A051D',
      },
      grey: {
        number: 0x3F3356,
        string: '#3F3356',
      },
      white: {
        number: 0xffffff,
        string: '#ffffff',
      },
    };
  }

  public preload() {
    this.allLines = [
      {
        coords: [300, 550],
        colour: this.colours.pink,
        direction: 'n',
        alive: true,
        tail: [],
        player: 1,
        keys: {
          left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
          right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
        },
      },
      {
        coords: [300, 50],
        colour: this.colours.purple,
        direction: 's',
        alive: true,
        tail: [],
        player: 2,
        keys: {
          left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C),
          right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V),
        },
      },
      {
        coords: [50, 300],
        colour: this.colours.orange,
        direction: 'e',
        alive: true,
        tail: [],
        player: 3,
        keys: {
          left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE),
          right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO),
        },
      },
      {
        coords: [550, 300],
        colour: this.colours.cyan,
        direction: 'w',
        alive: true,
        tail: [],
        player: 4,
        keys: {
          left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.PLUS),
          right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.MINUS),
        },
      },
    ];

  }

  public create(data: {
    players: number;
  }) {
    this.buildPlayers(data.players);
    this.buildBounds();
  }

  public update() {
    if (this.pause) {
      return;
    }
    for (const l of this.lines) {
      if (l.alive) {
        if (Phaser.Input.Keyboard.JustDown(l.keys.left)) {
          this.turnLeft(l);
        } else if (Phaser.Input.Keyboard.JustDown(l.keys.right)) {
          this.turnRight(l);
        }
        this.growRect(l);
        l.graphics.fillRectShape(l.head);
      }
    }
    this.checkCollisions();
  }

  public buildPlayers(players: number) {
    this.lines = this.allLines.slice(0, players);

    for (const l of this.lines) {
      const { coords, colour } = l;
      l.head = new Phaser.Geom.Rectangle(coords[0], coords[1], 1, 1);
      this.add.text(650, (50 * l.player), `Player ${l.player}`, {
        fill: colour.string,
      });
      l.graphics = this.add.graphics({
        fillStyle: {
          alpha: 1,
          color: colour.number,
        },
      });
      l.graphics.fillRectShape(l.head);
    }
  }

  public buildBounds() {
    const topBound = new Phaser.Geom.Rectangle(10, 10, 600, 2);
    const rightBound = new Phaser.Geom.Rectangle(610, 10, 2, 600);
    const bottomBound = new Phaser.Geom.Rectangle(10, 610, 600, 2);
    const leftBound = new Phaser.Geom.Rectangle(10, 10, 2, 600);
    this.bounds = [topBound, rightBound, bottomBound, leftBound];
    for (const b of this.bounds) {
      const borders = this.add.graphics({
        fillStyle: {
          alpha: 1,
          color: this.colours.black.number,
        },
      });
      borders.fillRectShape(b);
    }
  }

  public checkCollisions() {
    for (const l of this.lines) {
      if (l.alive) {
        /*
        Check whether the line has colided with one of the walls
        */
        for (const b of this.bounds) {
          const intersection = Phaser.Geom.Intersects.GetRectangleToRectangle(l.head, b);
          if (intersection.length) {
            this.handleDeath(l, intersection);
          }
        }
        /*
        Check whether it has hit it's self or another player
        */
        for (const j of this.lines) {
          /*
          Check whether it has hit the head of another player
          */
          if (l.player !== j.player) {
            const intersection = Phaser.Geom.Intersects.GetRectangleToRectangle(l.head, j.head);
            if (intersection.length) {
              this.handleDeath(l, intersection);
            }
          }
          /*
          Check whether it has hit it's own tail or another players tail
          */
          for (const t of j.tail) {
            const intersection = Phaser.Geom.Intersects.GetRectangleToRectangle(l.head, t);
            if (intersection.length) {
              this.handleDeath(l, intersection);
            }
          }
        }
      }
    }
  }

  public turnLeft(line: PlayerLine) {
    const { graphics, direction, head } = line;
    line.tail.push(head);
    line.head = this.getLeftCoords(line);
    line.direction = this.getLeftDirection(direction);
    graphics.strokeRectShape(line.head);
  }

  public turnRight(line: PlayerLine) {
    const { graphics, direction, head } = line;
    line.tail.push(head);
    line.head = this.getRightCoords(line);
    line.direction = this.getRightDirection(direction);
    graphics.strokeRectShape(line.head);
  }

  public getRightCoords(line: PlayerLine) {
    const map = {
      n: (head: Phaser.Geom.Rectangle) => {
        return new Phaser.Geom.Rectangle(head.x + 2, head.y, 1, 1);
      },
      e: (head: Phaser.Geom.Rectangle) => {
        return new Phaser.Geom.Rectangle(head.right, head.y + 2, 1, 1);
      },
      s: (head: Phaser.Geom.Rectangle) => {
        return new Phaser.Geom.Rectangle(head.x - 2, head.bottom, 1, 1);
      },
      w: (head: Phaser.Geom.Rectangle) => {
        return new Phaser.Geom.Rectangle(head.x, head.y - 2, 1, 1);
      },
    };
    return map[line.direction](line.head);
  }

  public getLeftCoords(line: PlayerLine) {
    const map = {
      n: (head: Phaser.Geom.Rectangle) => {
        return new Phaser.Geom.Rectangle(head.x - 2, head.y, 1, 1);
      },
      e: (head: Phaser.Geom.Rectangle) => {
        return new Phaser.Geom.Rectangle(head.right, head.y - 2, 1, 1);
      },
      s: (head: Phaser.Geom.Rectangle) => {
        return new Phaser.Geom.Rectangle(head.x + 2, head.bottom, 1, 1);
      },
      w: (head: Phaser.Geom.Rectangle) => {
        return new Phaser.Geom.Rectangle(head.x, head.y + 2, 1, 1);
      },
    };
    return map[line.direction](line.head);
  }

  public handleDeath(line: PlayerLine, intersections: Phaser.Geom.Point[]) {
    for (const i of intersections) {
      if (
        (i.x === line.head.left && i.y === line.head.top) ||
        (i.x === line.head.right && i.y === line.head.bottom)
      ) {
        this.killPlayer(line, i);
      }
    }
  }

  public killPlayer(line: PlayerLine, i: Phaser.Geom.Point) {
    const graphic = this.add.graphics({
      fillStyle: {
        alpha: 1,
        color: this.colours.yellow.number,
      },
    });
    const circle = new Phaser.Geom.Circle(i.x, i.y, 10);
    graphic.fillCircleShape(circle);
    // line.tail.push(line.head);
    // for (const tail of line.tail) {
    //   graphic.fillRectShape(tail);
    // }
    line.alive = false;
  }

  public growRect(line: PlayerLine) {
    const map = {
      n: (head: Phaser.Geom.Rectangle) => {
        head.setTo(head.x, head.y - 1, head.width, head.height + 1);
      },
      e: (head: Phaser.Geom.Rectangle) => {
        head.setTo(head.x, head.y, head.width + 1, head.height);
      },
      s: (head: Phaser.Geom.Rectangle) => {
        head.setTo(head.x, head.y, head.width, head.height + 1);
      },
      w: (head: Phaser.Geom.Rectangle) => {
        head.setTo(head.x - 1, head.y, head.width + 1, head.height);
      },
    };
    return map[line.direction](line.head);
  }

  public getLeftDirection(dir: 'n' | 'e' | 's' | 'w'): 'n' | 'e' | 's' | 'w' {
    const map: {
      [key: string]: 'n' | 'e' | 's' | 'w';
    } = {
      n: 'w',
      e: 'n',
      s: 'e',
      w: 's',
    };
    return map[dir];
  }

  public getRightDirection(dir: 'n' | 'e' | 's' | 'w'): 'n' | 'e' | 's' | 'w' {
    const map: {
      [key: string]: 'n' | 'e' | 's' | 'w';
    } = {
      n: 'e',
      e: 's',
      s: 'w',
      w: 'n',
    };
    return map[dir];
  }

}

export interface GameScene {
  pause: boolean;
  lines: PlayerLine[];
  allLines: PlayerLine[];
  colours: {
    [key: string]: {
      number: number;
      string: string;
    };
  };
  bounds: Phaser.Geom.Rectangle[];
}

export interface PlayerLine {
  player: number;
  coords: number[];
  head?: Phaser.Geom.Rectangle;
  graphics?: Phaser.GameObjects.Graphics;
  colour: {
    number: number;
    string: string;
  };
  direction: 'n' | 'e' | 's' | 'w';
  alive: boolean;
  tail: Phaser.Geom.Rectangle[];
  keys: {
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };
}
