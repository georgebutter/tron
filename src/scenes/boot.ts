import * as Phaser from 'phaser';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Boot',
};

export class BootScene extends Phaser.Scene {
  constructor() {
    super(sceneConfig);
  }

  public preload() {
    this.scene.start('Title');
  }
}
