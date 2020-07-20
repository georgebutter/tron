import * as Phaser from 'phaser';
import { auth } from "../services/firebase";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'OnlineMenu',
};

export class OnlineMenuScene extends Phaser.Scene {
  constructor() {
    super(sceneConfig);
  }
  
  public preload() {
    
    /**    
     * Redirect to the lobby if the user is already authenticated    
     */     
    auth().onAuthStateChanged((user) => {
      if (user) {
        this.scene.start('OnlineLobby');
      }
    })
  }
  
  public create() {
    this.createSignupForm()
    this.createSigninForm()
  }
  
  public createSignupForm() {
    const x = 100
    this.add.text(x, 100, 'Sign up')
    this.add.dom(x, 150).setOrigin(0, 0).createFromHTML(`
      <input type="email" placeholder="Email"/>
      <input type="password" placeholder="Password" />
      <button type="submit">
        Sign up
      </button>
    `, 'form')
    .addListener('submit')
    .on('submit', this.handleSignUp)
  }
  
  public createSigninForm() {
    const x = 100
    this.add.text(x, 200, 'Sign in')
    this.add.dom(x, 250).setOrigin(0, 0).createFromHTML(`
      <input type="email" placeholder="Email"/>
      <input type="password" placeholder="Password" />
      <button type="submit">
        Sign in
      </button>
    `, 'form')
    .addListener('submit')
    .on('submit', this.handleSignIn)
  }
  
  public handleSignUp = async (e: Event) => {
    e.preventDefault()
    console.log(e)
    const email = e.target[0].value
    const password = e.target[1].value
    try {
      await auth().createUserWithEmailAndPassword(email, password);
    } catch (error) {
      
    }
  }
  
  public handleSignIn = async (e: Event) => {
    e.preventDefault()
    console.log(e)
    const email = e.target[0].value
    const password = e.target[1].value
    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      
    }
  }
}