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
        platforms.create(160, 584, 'chao');
        platforms.create(160, 16, 'chao');
        
        //adiciona colisao entre o player e as plataformas
        this.physics.add.collider(this.player, platforms);
        
        //cria o controle de inputs
        this.keys = this.input.keyboard.createCursorKeys()

        //flag de mudança de gravidade
        this.gravFlag = 1;
        this.physics.add.collider(this.player, platforms, function (){this.gravflag = 1});
    }
    
    update(){

        //MOVIMENTO
        //pulo
        if (this.keys.up.isDown && //cima apertado E...
            (
                (this.player.body.touching.down && Math.sign(this.physics.world.gravity.y)) || //gravidade pra baixo e player tocando o chao OU...
                (this.player.body.touching.up && -1 * Math.sign(this.physics.world.gravity.y)) //gravidade pra cima e player tocando o teto
            )){
            this.player.setVelocityY(Math.sign(this.physics.world.gravity.y) * -500); //muda a velocidade do player no sentido contrário à gravidade
        }

        //direita
        if (this.keys.right.isDown){
            this.player.setVelocityX(125);
        }

        //esquerda
        else if(this.keys.left.isDown){
            this.player.setVelocityX(-125)
        }

        //parado
        else{
            this.player.setVelocityX(0);
        }

        //Mudar a gravidade
        if (this.keys.space.isDown && this.gravFlag == 1){
            this.physics.world.gravity.y *= -1;
            this.gravFlag = 0;
        }
    }
}