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
        //CRIAÇÃO DE OBJETOS
        //cria o objeto player e faz ele colidir com as bordas do mundo
        this.player = this.physics.add.image(16,500,'halphonzzo');
        this.player.body.collideWorldBounds = true
        
        //cria o grupo das plataformas
        this.platforms = this.physics.add.staticGroup();
        
        //cria o chão e o teto como tilesprites e adiciona ao grupo das pĺataformas
        const teto = this.add.tileSprite(400, 16, 800, 32, 'chao');
        this.platforms.add(teto);
        const chao = this.add.tileSprite(400, 584, 800, 32, 'chao');
        this.platforms.add(chao);






        //CRIAÇÃO DE COLISÕES

        //adiciona colisao entre o player e as plataformas
        this.physics.add.collider(this.player, this.platforms);
        









        //ETC

        //cria o controle de inputs
        this.keys = this.input.keyboard.createCursorKeys()

        //flag de mudança de gravidade
        this.gravFlag = 0;

        this.cameras.main.startFollow(this.player)
        this.cameras.main.setFollowOffset(0, 200)
        this.cameras.main.setBounds(0, 0, 1000, 600)
        this.cameras.main.setDeadzone(0, this.scale.height);
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

        // CODIGO DE PULO ANTERIOR (não resetava o flag de gravidade)
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

}