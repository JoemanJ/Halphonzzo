import Phaser from '../lib/phaser.js'

export default class level1 extends Phaser.Scene{
    constructor(){
        super('level1');
    }
    
    
    preload(){
        //Carrega as imagens
        this.load.image('halphonzzo', './src/sprites/halphonzzo.png');
        this.load.image('chao', './src/sprites/chao.png');
    }
    
    create(){
        //cria o objeto player
        this.player = this.physics.add.image(16,500,'halphonzzo');
        
        //cria o grupo das plataformas
        const platforms = this.physics.add.staticGroup();
        
        //Adiciona o chao no grupo das plataformas
        const ground = platforms.create(160, 584, 'chao');
        const body = ground.body
        body.updateFromGameObject();
        
        //adiciona colisao entre o player e as plataformas
        this.physics.add.collider(this.player, platforms);
        
        //cria o controle de inputs
        this.keys = this.input.keyboard.createCursorKeys()
    }
    
    update(){

        //MOVIMENTO
        //pulo
        if (this.keys.up.isDown && this.player.body.touching.down){
            this.player.setVelocityY(-500);
        }

        //esquerda
        if (this.keys.right.isDown){
            this.player.setVelocityX(125);
        }

        //direita
        else if(this.keys.left.isDown){
            this.player.setVelocityX(-125)
        }

        //parado
        else{
            this.player.setVelocityX(0);
        }
    }
}