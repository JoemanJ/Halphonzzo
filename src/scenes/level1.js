import Phaser from '../lib/phaser.js'

export default class level1 extends Phaser.Scene{
    constructor(){
        super('level1');
    }
    
    debugMode = false;

    preload(){
        //Carrega as imagens
        this.load.image('halphonzzo', './src/sprites/halphonzzo.png');
        this.load.image('chao', './src/sprites/chao.png');
        this.load.image('tomato', './src/sprites/tomato.png');
    }
    
    create(){

        this.physics.world.setBounds(0, 0, 1000, 600);

        //CRIAÇÃO DE OBJETOS
        //cria o objeto player e faz ele colidir com as bordas do mundo
        this.player = this.physics.add.image(16,500,'halphonzzo');
        this.player.body.collideWorldBounds = true

        //cria o grupo das plataformas
        this.platforms = this.physics.add.staticGroup();
        
        //Cria o grupo dos inimigos
        this.enemies = this.add.group();

        //Cria o tomato voador
        const tomato = this.physics.add.image(200, 320, 'tomato');
        tomato.body.setAllowGravity(false);
        this.enemies.add(tomato);

        //cria o chão e o teto como tilesprites e adiciona ao grupo das pĺataformas
        const teto = this.add.tileSprite(400, 16, 800, 32, 'chao');
        this.platforms.add(teto);
        const chao = this.add.tileSprite(400, 584, 800, 32, 'chao');
        this.platforms.add(chao);










        //CRIAÇÃO DE COLISÕES

        //adiciona colisao entre o player e as plataformas
        this.collider_player_platforms = this.physics.add.collider(this.player, this.platforms);
        
        this.collider_player_enemies = this.physics.add.overlap(this.player, this.enemies, this.handleHit, undefined, this);









        //ETC

        //cria o controle de inputs
        this.keys = this.input.keyboard.createCursorKeys()

        //flag de mudança de gravidade
        this.gravFlag = false;

        //Configuração da câmera
        this.cameras.main.startFollow(this.player)
        this.cameras.main.setFollowOffset(0, 200)
        this.cameras.main.setBounds(0, 0, 1000, 600)
        this.cameras.main.setDeadzone(0, this.scale.height);
    }
    
    update(){

        //Movimentação do jogador
        this.handlePlayerMovement();

        //Movimentação dos inimigos
        this.handleEnemyMovement(this.time.now);
    }

    handlePlayerMovement(){
        //MOVIMENTO
        if(!this.debugMode){
            //flag de gravidade e pulo
            if(
                (this.player.body.touching.down && Math.sign(this.physics.world.gravity.y) == 1) || //gravidade pra baixo e player tocando o chao OU...
                (this.player.body.touching.up && Math.sign(this.physics.world.gravity.y) == -1) //gravidade pra cima e player tocando o teto
            ){
                this.gravFlag = true; //Reseta o flag de gravidade
                
                if(this.keys.up.isDown){ //Cima apertado
                    this.player.setVelocityY(Math.sign(this.physics.world.gravity.y) * -500); //Pulo
                }
            }

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
            if (this.keys.space.isDown && this.gravFlag){
                this.physics.world.gravity.y *= -1;
                this.player.flipY = !this.player.flipY;
                this.gravFlag = false;
            }

        }

        else{ //Modo debug provisório
            if(this.keys.up.isDown){
                this.player.setVelocityY(-100);
            }
            else if(this.keys.down.isDown){
                this.player.setVelocityY(100);
            }
            else if(this.keys.left.isDown){
                this.player.setVelocityX(-100);
            }
            else if(this.keys.right.isDown){
                this.player.setVelocityX(100);
            }

            else{
                this.player.setVelocityX(0);
                this.player.setVelocityY(0);
            }
        }

        if(this.keys.shift.isDown){ //Ativação do modo debug **TROCAR PARA KEY COMBO**
            this.debugMode = !this.debugMode;
            this.player.body.setAllowGravity(!this.debugMode);
        }
    }

    //MOVIMENTO DOS INIMIGOS
    handleEnemyMovement(time){
        //Faz os inimigos andarem em zigzag
        this.enemies.getChildren().forEach(function(enemy){
            if(time%4000 < 2000){
                enemy.setVelocityX(75);
                enemy.flipX = true;
            }
            else{
                enemy.setVelocityX(-75);
                enemy.flipX = false;
            }
        })
    }

    handleHit(player, enemy){
        if(
            ( (player.body.y + 54) > enemy.body.y && Math.sign(this.physics.world.gravity.y) == 1) || //inimigo acima e gravidade para baixo
            ( (player.body.y + 10) < (enemy.body.y + enemy.body.height) && Math.sign(this.physics.world.gravity.y) == -1) //Inimigo abaixo e gravidade para cima
            ){
                //ANIMAÇÃO DE MORTE
                this.killPlayer();
            }

            else{
                //Animação de morte do inimigo
            this.enemies.remove(enemy); //Tira colisão do inimigo
            enemy.flipY = true; // Gira o inimigo
            enemy.setVelocityX(0); //Pulinho
            enemy.setVelocityY(-200);
            enemy.setAccelerationY(1000);

            player.setVelocityY(Math.sign(this.physics.world.gravity.y) * -500); //Pulo do player
            this.gravFlag = true //Reset do flag de gravidade
        }
    }

    killPlayer(){
        this.input.keyboard.destroy() //Não pode se mover após a morte

        this.player.flipY = false;
        this.player.setAngle(180);

        this.collider_player_platforms.destroy(); // Não colide com nada após a morte
        this.collider_player_enemies.destroy(); 
        this.player.setCollideWorldBounds(false);

        this.player.setVelocityY(-500); //Cai para baixo independente do sentido da gravidade
    }

}