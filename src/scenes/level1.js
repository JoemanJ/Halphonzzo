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
        this.platforms = this.physics.add.staticGroup();
        
        //Adiciona o chao no grupo das plataformas
        this.platforms.create(160, 584, 'chao');
        this.platforms.create(160, 16, 'chao');
        this.platforms.create(320, 380, 'chao');
        
        //adiciona colisao entre o player e as plataformas
        this.physics.add.collider(this.player, this.platforms);
        
        //cria o controle de inputs
        this.keys = this.input.keyboard.createCursorKeys()

        //flag de mudança de gravidade
        this.gravFlag = 0;
    }
    
    update(){

        //MOVIMENTO
        //flag de gravidade e pulo
        if(
            (this.player.body.touching.down && Math.sign(this.physics.world.gravity.y) == 1) || //gravidade pra baixo e player tocando o chao OU...
            (this.player.body.touching.up && Math.sign(this.physics.world.gravity.y) == -1) //gravidade pra cima e player tocando o teto
        ){
            this.gravFlag = 1; //Reseta o flag de gravidade
            
            if(this.keys.up.isDown){ //Cima apertado
                this.player.setVelocityY(Math.sign(this.physics.world.gravity.y) * -500); //Pulo
                console.log("teste");
            }
        }

        // if (this.keys.up.isDown && //cima apertado E...
        //     (
        //         (this.player.body.touching.down && Math.sign(this.physics.world.gravity.y) == 1) || //gravidade pra baixo e player tocando o chao OU...
        //         (this.player.body.touching.up && Math.sign(this.physics.world.gravity.y) == -1) //gravidade pra cima e player tocando o teto
        //     )
        //     ){
        //     this.player.setVelocityY(Math.sign(this.physics.world.gravity.y) * -500); //muda a velocidade do player no sentido contrário à gravidade
        // }

        //direita
        if (this.keys.right.isDown){
            this.player.setVelocityX(125);
            this.player.flipX = false;
        }

        //esquerda
        else if(this.keys.left.isDown){
            this.player.setVelocityX(-125)
            this.player.flipX = true;
        }

        //parado
        else{
            this.player.setVelocityX(0);
        }

        //Mudar a gravidade
        if (this.keys.space.isDown && this.gravFlag == 1){
            this.physics.world.gravity.y *= -1;
            this.player.flipY = !this.player.flipY;
            this.gravFlag = 0;
        }
    }

    setGravFlag(){
        this.gravFlag = 1;
        console.log("teste");
    }
}