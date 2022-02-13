import Phaser from './lib/phaser.js'

import level1 from './scenes/level1.js'
import aux from './scenes/aux.js';

const game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#129acc',
    scene: [level1, aux],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 1000
            },
            //debug: true
        }
    }
})

export default game;