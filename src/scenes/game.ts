import * as Phaser from 'phaser';
import { colours } from '../constants';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game',
};

export class GameScene extends Phaser.Scene {
  constructor() {
    super(sceneConfig);
    this.pause = true;
    this.allReady = false;
    this.bounds = [];
  }

  public preload() {
    this.allLines = [
      {
        coords: [300, 550],
        colour: colours.pink,
        direction: 'n',
        defaultDirection: 'n',
        alive: true,
        score: 0,
        tail: [],
        player: 1,
        ready: false,
        keys: {
          left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
          right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
        },
      },
      {
        coords: [300, 50],
        colour: colours.purple,
        direction: 's',
        defaultDirection: 's',
        alive: true,
        score: 0,
        tail: [],
        player: 2,
        ready: false,
        keys: {
          left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C),
          right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V),
        },
      },
      {
        coords: [50, 300],
        colour: colours.orange,
        direction: 'e',
        defaultDirection: 'e',
        alive: true,
        score: 0,
        tail: [],
        player: 3,
        ready: false,
        keys: {
          left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE),
          right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO),
        },
      },
      {
        coords: [550, 300],
        colour: colours.green,
        direction: 'w',
        defaultDirection: 'w',
        alive: true,
        score: 0,
        tail: [],
        player: 4,
        ready: false,
        keys: {
          left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.PLUS),
          right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.MINUS),
        },
      },
    ];

  }

  public create(data: { players: number; }) {
    this.statusText = this.add.text(300, 270, '', {})
    .setOrigin(0.5, 0.5)
    .setDepth(10);
    this.buildPlayers(data.players);
    this.buildBounds();
  }

  public update() {
    const { JustDown } = Phaser.Input.Keyboard;
    if (this.pause) {
      const readyLines = [];
      for (const l of this.lines) {
        if (JustDown(l.keys.left) || JustDown(l.keys.right)) {
          l.ready = true;
          l.alive = true;
          l.tail = [];
          l.direction = l.defaultDirection;
        }
        if (l.ready) {
          l.readyText.setText('Ready');
          readyLines.push(l);
        } else {
          l.readyText.setText('Not ready');
        }
      }
      if (readyLines.length === this.lines.length) {
        this.allReady = true;
        this.pause = false;
      }
      return;
    }

    
    /**    
     * Once all players set themselves to ready, reset the previous game.
     * Clear the status text
     * Change each player status to not readyText
     * Remove previous graphics
     */     
    if (this.allReady) {
      this.statusText.setText('');
      this.allReady = false;
      for (const l of this.lines) {
        l.ready = false;
        l.readyText.setText('');
        this.resetGraphics(l.graphics);
        this.resetGraphics(l.deathGraphics);
        this.createHead(l);
      }
    }

    const aliveLines = [];

    for (const l of this.lines) {
      if (l.alive) {
        if (JustDown(l.keys.left)) {
          this.turnLeft(l);
        } else if (JustDown(l.keys.right)) {
          this.turnRight(l);
        }
        this.growRect(l);
        l.graphics.fillRectShape(l.head);
        aliveLines.push(l);
      }
    }
    if (this.lines.length > 1) {
      if (aliveLines.length === 1) {
        const winner = aliveLines[0];
        winner.score += 1;
        winner.text.setText(`Player ${winner.player} - ${winner.score}`);
        this.statusText.setText(`Player ${winner.player} wins`).setStyle({
          fill: winner.colour.string,
          fontSize: '25px',
          shadow: {
            color: colours.grey.string,
            blur: '5px',
          },
        });
        this.pause = true;
      } else if (aliveLines.length === 0) {
        this.statusText.setText(`Draw!`).setStyle({
          fill: colours.yellow.string,
          fontSize: '25px',
          shadow: {
            color: colours.grey.string,
            blur: '5px',
          },
        });
        this.pause = true;
      }
    }
    this.checkCollisions();
  }

  public buildPlayers(players: number) {
    this.lines = this.allLines.slice(0, players);

    for (const l of this.lines) {
      const { colour } = l;
      l.text = this.add.text(650, (50 * l.player), `Player ${l.player} - ${l.score}`, {
        fill: colour.string,
        fontSize: '25px',
      });
      l.readyText = this.add.text(300, (270 + (30 * l.player)), '', {
        fill: colour.string,
        fontSize: '25px',
      })
      .setOrigin(0.5, 0.5)
      .setDepth(10);
      l.graphics = this.add.graphics({
        fillStyle: {
          alpha: 1,
          color: colour.number,
        },
      });
      l.deathGraphics = this.add.graphics({
        fillStyle: {
          alpha: 1,
          color: colours.yellow.number,
        },
      });
    }
  }

  public createHead(line: PlayerLine) {
    const { coords, colour } = line;
    line.head = new Phaser.Geom.Rectangle(coords[0], coords[1], 1, 1);
    line.graphics.fillRectShape(line.head);
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
          color: colours.black.number,
        },
      });
      borders.fillRectShape(b);
    }
  }

  public checkCollisions() {
    for (const l of this.lines) {
      if (l.alive) {
        /**
         * Check whether the line has colided with one of the walls
         */
        for (const b of this.bounds) {
          const intersection = Phaser.Geom.Intersects.GetRectangleToRectangle(l.head, b);
          if (intersection.length) {
            this.handleDeath(l, intersection);
          }
        }
        /**
         * Check whether it has hit it's self or another player
         */
        for (const j of this.lines) {
          /**
           * Check whether it has hit the head of another player
           **/
          if (l.player !== j.player) {
            const intersection = Phaser.Geom.Intersects.GetRectangleToRectangle(l.head, j.head);
            if (intersection.length) {
              this.handleDeath(l, intersection);
            }
          }
          /**
           * Check whether it has hit it's own tail or another players tail
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
    const { direction, head } = line;
    line.tail.push(head);
    line.head = this.getLeftCoords(line);
    line.direction = this.getLeftDirection(direction);
    line.graphics.strokeRectShape(line.head);
  }

  public turnRight(line: PlayerLine) {
    const { direction, head } = line;
    line.tail.push(head);
    line.head = this.getRightCoords(line);
    line.direction = this.getRightDirection(direction);
    line.graphics.strokeRectShape(line.head);
  }

  public getRightCoords(line: PlayerLine) {
    const map = {
      n: (head: Phaser.Geom.Rectangle) => new Phaser.Geom.Rectangle(head.x + 2, head.y, 1, 1),
      e: (head: Phaser.Geom.Rectangle) => new Phaser.Geom.Rectangle(head.right, head.y + 2, 1, 1),
      s: (head: Phaser.Geom.Rectangle) => new Phaser.Geom.Rectangle(head.x - 2, head.bottom, 1, 1),
      w: (head: Phaser.Geom.Rectangle) => new Phaser.Geom.Rectangle(head.x, head.y - 2, 1, 1),
    };
    return map[line.direction](line.head);
  }

  public getLeftCoords(line: PlayerLine) {
    const map = {
      n: (head: Phaser.Geom.Rectangle) => new Phaser.Geom.Rectangle(head.x - 2, head.y, 1, 1),
      e: (head: Phaser.Geom.Rectangle) => new Phaser.Geom.Rectangle(head.right, head.y - 2, 1, 1),
      s: (head: Phaser.Geom.Rectangle) => new Phaser.Geom.Rectangle(head.x + 2, head.bottom, 1, 1),
      w: (head: Phaser.Geom.Rectangle) => new Phaser.Geom.Rectangle(head.x, head.y + 2, 1, 1),
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
    const circle = new Phaser.Geom.Circle(i.x, i.y, 3);
    line.deathGraphics.fillCircleShape(circle);

    for (const tail of line.tail) {
      line.deathGraphics.fillRectShape(tail);
    }
    line.deathGraphics.fillRectShape(line.head);
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

  public getLeftDirection(dir: Compass): Compass {
    const map: {
      [key: string]: Compass;
    } = {
      n: 'w',
      e: 'n',
      s: 'e',
      w: 's',
    };
    return map[dir];
  }

  public getRightDirection(dir: Compass): Compass {
    const map: {
      [key: string]: Compass;
    } = {
      n: 'e',
      e: 's',
      s: 'w',
      w: 'n',
    };
    return map[dir];
  }
  
  /**        
   * Remove the coloured lines from the previous games.
   */   
  public resetGraphics(graphics: Phaser.GameObjects.Graphics) {
    if (graphics) {
      graphics.clear();
    }
  }
}

type Compass = 'n' | 'e' | 's' | 'w'

export interface GameScene {
  pause: boolean;
  allReady: boolean;
  lines: PlayerLine[];
  allLines: PlayerLine[];
  colours: {
    [key: string]: {
      number: number;
      string: string;
    };
  };
  bounds: Phaser.Geom.Rectangle[];
  statusText: Phaser.GameObjects.Text;
}

export interface PlayerLine {
  player: number;
  coords: number[];
  head?: Phaser.Geom.Rectangle;
  graphics?: Phaser.GameObjects.Graphics;
  deathGraphics?: Phaser.GameObjects.Graphics;
  text?: Phaser.GameObjects.Text;
  readyText?: Phaser.GameObjects.Text;
  colour: {
    number: number;
    string: string;
  };
  direction: Compass;
  defaultDirection: Compass;
  ready: boolean;
  alive: boolean;
  score: number;
  tail: Phaser.Geom.Rectangle[];
  keys: {
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };
}