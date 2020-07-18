import * as Phaser from 'phaser';

export class Button extends Phaser.GameObjects.Text {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string,
    style: {},
    callbacks: {
      [key: string]: () => void;
    },
  ) {
    super(scene, x, y, text, style);
    this.defaultStyle = style;
    this.setInteractive({ useHandCursor: true })
    .on('pointerover', () => {
      this.buttonOver();
      if (callbacks && typeof callbacks.pointerover === 'function') {
        callbacks.pointerover();
      }
    })
    .on('pointerout', () => {
      this.buttonOut();
      if (callbacks && typeof callbacks.pointerout === 'function') {
        callbacks.pointerout();
      }
    })
    .on('pointerdown', () => {
      this.buttonDown();
      if (callbacks && typeof callbacks.pointerdown === 'function') {
        callbacks.pointerdown();
      }
    })
    .on('pointerup', () => {
      if (callbacks && typeof callbacks.pointerup === 'function') {
        callbacks.pointerup();
      }
    });
  }

  public buttonOver() {
    this.setStyle({
      fill: '#FFCF5C',
    });
  }

  public buttonOut() {
    this.setStyle(this.defaultStyle);
  }

  public buttonDown() {
    this.setStyle({
      fill: '#0084F4',
    });
  }
}

export interface Button {
  defaultStyle: {};
}