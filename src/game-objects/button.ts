import * as Phaser from 'phaser';
import { colours } from '../constants';

export class Button extends Phaser.GameObjects.Text {
  callbacks: { [key: string]: () => void; };
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
    this.callbacks = callbacks;
    this.setInteractive({ useHandCursor: true })
    .on('pointerover', () => {
      this.buttonOver();
      if (this.callbacks && typeof this.callbacks.pointerover === 'function') {
        this.callbacks.pointerover();
      }
    })
    .on('pointerout', () => {
      this.buttonOut();
      if (this.callbacks && typeof this.callbacks.pointerout === 'function') {
        this.callbacks.pointerout();
      }
    })
    .on('pointerdown', () => {
      this.buttonDown();
      if (this.callbacks && typeof this.callbacks.pointerdown === 'function') {
        this.callbacks.pointerdown();
      }
    })
    .on('pointerup', () => {
      if (this.callbacks && typeof this.callbacks.pointerup === 'function') {
        this.callbacks.pointerup();
      }
    });
  }

  public buttonOver() {
    this.setStyle({
      fill: colours.yellow.string,
    });
  }

  public buttonOut() {
    this.setStyle(this.defaultStyle);
  }

  public buttonDown() {
    this.setStyle({
      fill: colours.cyan.string,
    });
  }
  
  private setPointerUp(callback: () => void) {
    this.callbacks.pointerup = callback
  }
}

export interface Button {
  defaultStyle: {};
}