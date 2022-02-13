import Phaser from '../lib/phaser.js';
import Lump from './lump.js';

export default class azeitona extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, sprite, stateTime){
        super(scene, x, y, sprite);
        this.stateTime = stateTime;
        scene.add.existing(this);

        scene.physics.world.enableBody(this);
    }

    shoot(){
        const lump = new Lump(this.scene, this.x, this.y, 'lump', this.flipX);
        return lump;
    }

}