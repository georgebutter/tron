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
      purple: 0xBE52F2,
      blue: 0x6979F8,
      yellow: 0xFFCF5C,
      orange: 0xFFA26B,
      cyan: 0x0084F4,
      green: 0x00C48C,
      pink: 0xFF647C,
      black: 0x1A051D,
      grey: 0x3F3356,
      white: 0xffffff,
    };
  }

  public preload() {
    this.lines = [
      {
        coords: [300, 550],
        colour: this.colours.pink,
        direction: 'n',
        alive: true,
        tail: [],
        player: 1,
      },
      {
        coords: [300, 50],
        colour: this.colours.purple,
        direction: 's',
        alive: true,
        tail: [],
        player: 2,
      },
      {
        coords: [50, 300],
        colour: this.colours.orange,
        direction: 'e',
        alive: true,
        tail: [],
        player: 3,
      },
      {
        coords: [550, 300],
        colour: this.colours.green,
        direction: 'w',
        alive: true,
        tail: [],
        player: 4,
      },
    ];

    this.keys = {
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      c: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C),
      v: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V),
      one: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE),
      two: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO),
      plus: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.PLUS),
      minus: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.MINUS),
    };
  }

  public create(data: any) {
    this.lines.slice(0, data.players);
    for (const l of this.lines) {
      const { coords, colour } = l;
      l.head = new Phaser.Geom.Rectangle(coords[0], coords[1], 1, 1);
      l.graphics = this.add.graphics({
        fillStyle: {
          alpha: 1,
          color: colour,
        },
      });
      l.graphics.fillRectShape(l.head);
    }
    const topBound = new Phaser.Geom.Rectangle(10, 10, 600, 2);
    const rightBound = new Phaser.Geom.Rectangle(610, 10, 2, 600);
    const bottomBound = new Phaser.Geom.Rectangle(10, 610, 600, 2);
    const leftBound = new Phaser.Geom.Rectangle(10, 10, 2, 600);
    this.bounds = [topBound, rightBound, bottomBound, leftBound];
    for (const b of this.bounds) {
      const borders = this.add.graphics({
        fillStyle: {
          alpha: 1,
          color: this.colours.black,
        },
      });
      borders.fillRectShape(b);
    }
  }

  public update() {
    if (this.pause) {
      return;
    }
    if (Phaser.Input.Keyboard.JustDown(this.keys.left)) {
      this.turnLeft(this.lines[0]);
    } else if (Phaser.Input.Keyboard.JustDown(this.keys.right)) {
      this.turnRight(this.lines[0]);
    }
    if (Phaser.Input.Keyboard.JustDown(this.keys.c)) {
      this.turnLeft(this.lines[1]);
    } else if (Phaser.Input.Keyboard.JustDown(this.keys.v)) {
      this.turnRight(this.lines[1]);
    }
    if (Phaser.Input.Keyboard.JustDown(this.keys.one)) {
      this.turnLeft(this.lines[2]);
    } else if (Phaser.Input.Keyboard.JustDown(this.keys.two)) {
      this.turnRight(this.lines[2]);
    }
    if (Phaser.Input.Keyboard.JustDown(this.keys.plus)) {
      this.turnLeft(this.lines[3]);
    } else if (Phaser.Input.Keyboard.JustDown(this.keys.minus)) {
      this.turnRight(this.lines[3]);
    }
    for (const l of this.lines) {
      if (l.alive) {
        this.growRect(l);
        l.graphics.fillRectShape(l.head);
      }
    }
    this.checkCollisions();
  }

  public checkCollisions() {
    for (const l of this.lines) {
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
    const graphic = this.add.graphics({
      fillStyle: {
        alpha: 1,
        color: this.colours.yellow,
      },
    });
    for (const i of intersections) {
      const circle = new Phaser.Geom.Circle(i.x, i.y, 10);
      graphic.fillCircleShape(circle);
    }

    // line.tail.push(line.head);
    for (const tail of line.tail) {
      graphic.fillRectShape(tail);
    }

    line.alive = false;
    this.pause = true;
    // this.scene.restart();
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
  colours: {
    [key: string]: number;
  };
  keys: {
    [key: string]: Phaser.Input.Keyboard.Key;
  };
  bounds: Phaser.Geom.Rectangle[];
}

export interface PlayerLine {
  player: number;
  coords: number[];
  head?: Phaser.Geom.Rectangle;
  graphics?: Phaser.GameObjects.Graphics;
  colour: number;
  direction: 'n' | 'e' | 's' | 'w';
  alive: boolean;
  tail: Phaser.Geom.Rectangle[];
}
