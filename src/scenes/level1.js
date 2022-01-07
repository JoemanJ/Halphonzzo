import Phaser from '../lib/phaser.js'

export default class level1 extends Phaser.Scene{
    constructor(){
        super('level1');
    }
    
    
    preload(){
        this.load.image('halphonzzo', './src/sprites/halphonzzo.png');
        this.load.image('chao', './src/sprites/chao.png');
    }
    
    create(){
        this.player = this.physics.add.image(16,500,'halphonzzo');
        
        const platforms = this.physics.add.staticGroup();
        
        const ground = platforms.create(160, 584, 'chao');
        const body = ground.body
        body.updateFromGameObject();
        
        this.physics.add.collider(this.player, platforms);
        
        this.keys = this.input.keyboard.createCursorKeys()
    }
    
    update(){
        if (this.keys.up.isDown && this.player.body.touching.down){
            this.player.setVelocityY(-500);
        }

        if (this.keys.right.isDown){
            this.player.setVelocityX(125);
        }

        else if(this.keys.left.isDown){
            this.player.setVelocityX(-125)
        }

        else{
            this.player.setVelocityX(0);
        }
    }
}