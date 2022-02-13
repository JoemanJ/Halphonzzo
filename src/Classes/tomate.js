import Phaser from '../lib/phaser.js'

export default class tomate extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, sprite, movement, speed, stateTime){
        super(scene, x, y, sprite);
        this.stateTime = stateTime;
        this.movement = movement;
        scene.add.existing(this);

        scene.physics.world.enableBody(this);
        this.body.setAllowGravity(false);

        switch (movement){
            case 'vertical':
                this.body.setVelocityY(speed);
                break;

            case 'horizontal':
                this.body.setVelocityX(speed);
        }
    }

    turn(){
        this.body.setVelocity(this.body.velocity.x * -1, this.body.velocity.y * -1);
        if (this.movement == 'horizontal'){
            this.flipX = !this.flipX;
        }
    }
}