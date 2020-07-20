import * as Phaser from 'phaser';
import * as firebase from 'firebase'
import * as GameObjects from 'game-objects';
import { colours } from '../constants'
import { auth, db } from '../services/firebase';
import { Colours } from 'src/types';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'OnlineLobby',
};

/**
 * Load any assets that are required for the game to run here then start the title scene.
 */ 
export class OnlineLobbyScene extends Phaser.Scene {
  games: Array<any>;
  gameList: Array<any>;
  user: {
    uid: string;
  };
  createNewButton: GameObjects.Button;
  activeGame: any;
  constructor() {
    super(sceneConfig);
  }
  
  public preload() {
    this.gameList = []
    let j = 0
    for (let i = 0; i < 10; i += 1) {
      const colourList: Array<Colours> = ['purple', 'blue', 'orange', 'cyan', 'pink']
      const colour: Colours = colourList[i % 5]
      const button = new GameObjects.Button(this, 400, 100 + (50 * i), '', {
        fill: colours[colour].string,
        fontSize: '18px'
      }, {
        pointerup: () => console.log('action'),
      });
      this.gameList.push(button);
    }
    /**    
     * Redirect to the login screen if the user is not authenticated    
     */     
    auth().onAuthStateChanged((user) => {
      if (!user) {
        this.scene.start('OnlineMenu');
      } else {
        this.user = user
        try {
          db.collection('games')
            .where('players', 'array-contains', user.uid)
            .onSnapshot((snap) => {
              if (!snap.empty) {
                this.activeGame = snap.docs[0].data();
                this.createNewButton
                  .setText(`Finding game... (${this.activeGame.playerCount}/2)`)
                  .removeInteractive()
                if (this.activeGame.playerCount === 2) {
                  this.scene.start('OnlineGame', {
                    players: 2,
                  });
                }
              }
            })
        } catch (error) {
          console.error(error)
        }
      }
    })
  }
  
  public create() {
    this.createNewButton = new GameObjects.Button(this, 100, 100, 'Find a game', {
      fill: colours.green.string,
      fontSize: '25px',
    }, {
      pointerup: () => this.findGame(),
    });
    this.add.existing(this.createNewButton)
    for (const gameButton of this.gameList) {
      this.add.existing(gameButton)
    }
    
    
  }
  
  public update() {

  }
  
  public async findGame() {
    if (this.activeGame) return
    try {
      const ref = db.collection('games')
      const snap = await ref.where('playerCount', '<', 4).get()
      if (snap.empty) {
        const res = await db.collection('games').add({
          players: [this.user.uid],
          playerCount: 1,
        })
      } else {
        snap.docs[0].ref.set({
          playerCount: firebase.firestore.FieldValue.increment(1),
          players: firebase.firestore.FieldValue.arrayUnion(this.user.uid)
        }, {
          merge: true
        })
      }
    } catch (err) {
      console.error(err)
    }
    
  }
}