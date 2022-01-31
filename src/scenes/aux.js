import Phaser from '../lib/phaser.js';
import level1 from './level1.js';

export default class aux extends Phaser.Scene{
    constructor(){
        super('aux')
    }

    create(){
        console.log(this);
        this.scene.start('level1');
    }
}