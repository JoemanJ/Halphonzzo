import Phaser from '../lib/phaser.js'

var platforms;
var cursors;
var player;
var enemies;
let flipFlag = false;
let gravityFlag = false;
export default class level1 extends Phaser.Scene{
    constructor(){
        super('level1')
    }

    preload(){
        this.load.image('chao','./src/sprites/chao.png')
        this.load.image('halphonzzo','./src/sprites/halphonzzo.png')
        this.load.image('tomate', './src/sprites/tomato.png')


    }
    
    create(){

        platforms = this.physics.add.staticGroup();
        //faz o chao
        platforms.create(160,584,'chao');
        platforms.create(480,584,'chao');
        platforms.create(480+320,584,'chao');

        //faz o teto
        platforms.create(160,16,'chao');
        platforms.create(480,16,'chao');
        platforms.create(480+320,16,'chao');

        player = this.physics.add.image(100,500,'halphonzzo');
            //player.setBounce(0.2);
            player.body.setCollideWorldBounds(true);
        
        

        this.physics.add.collider(platforms,player);

        cursors = this.input.keyboard.createCursorKeys();

        enemies = this.physics.add.group();
            //enemies.body.setAllowGravity(false);
            //enemies.body.setCollideWorldBounds(true);

        this.physics.add.collider(enemies,platforms);
        this.physics.add.collider(enemies,player);
        
        const tomato = this.physics.add.image(200,500,'tomate');
        enemies.add(tomato);
            tomato.body.setAllowGravity(false);
            tomato.body.setCollideWorldBounds(true);

        

        
        
        
        
        
        
        
    }

    update(){
        if(cursors.left.isDown){
            player.setVelocityX(-160);
            if(flipFlag == false){
                player.flipX = true;
                flipFlag = true;
            }

        }
        else if(cursors.right.isDown){
            player.setVelocityX(160)
            if(flipFlag){
                player.flipX = false;
                flipFlag = false;
            }
        }
        else{
            player.setVelocityX(0);
        }
        if(cursors.up.isDown && player.body.touching.down){
            player.setVelocityY(-500);
        }

        
        if(cursors.space.isDown){

            //gravidade está para baixo
            if(gravityFlag == false && player.body.touching.down){
                this.physics.world.gravity.y *=-1;
                player.setVelocityY(-1000);
                player.flipY = true;
                gravityFlag = true;
            }
            else if(player.body.touching.up){
                player.setVelocityY(1000);
                this.physics.world.gravity.y *=-1;
                player.flipY = false;
                gravityFlag = false;
                }
        }



    }
}
