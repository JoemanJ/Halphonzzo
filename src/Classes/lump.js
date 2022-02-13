import Phaser from '../lib/phaser.js';

export default class lump extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, sprite, direction){
        super(scene, x, y, 'lump');
        scene.add.existing(this);

        scene.physics.world.enableBody(this);
        this.body.setAllowGravity(false);

        switch (direction){
            case true:
                this.body.setVelocityX(100);
                break;

            default:
                this.body.setVelocityX(-100);
        }
        
        //scene.enemies.add(this);
    }
}