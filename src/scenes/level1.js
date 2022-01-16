import Phaser from '../lib/phaser.js'

export default class level1 extends Phaser.Scene{
    constructor(){
        super('level1');
    }
    
    debugMode = false;
    gravInvertida = false;
    forcaPulo = -500;

    preload(){
        //Carrega as imagens
        this.load.image('chao', './src/sprites/pix_chao.png');
        this.load.image('halphonzzo', './src/sprites/pix_player.png');
        this.load.image('tomato', './src/sprites/pix_tomato.png');
    }
    
    create(){

        this.physics.world.setBounds(0, 0, 3000, 300);

        //CRIAÇÃO DE OBJETOS
        //cria o objeto player e faz ele colidir com as bordas do mundo
        this.player = this.physics.add.image(16,122,'halphonzzo').setScale(1, 2);
        this.player.body.collideWorldBounds = true

        //cria o grupo das plataformas
        this.platforms = this.physics.add.group();
        this.movPlatforms = this.physics.add.group();
        
        //Cria o grupo dos inimigos
        this.enemies = this.add.group();

        //Cria o tomato voador
        const tomato = this.physics.add.image(200, 75, 'tomato');
        tomato.body.setAllowGravity(false);
        this.enemies.add(tomato);

        //cria o chão e o teto como tilesprites e adiciona ao grupo das pĺataformas
        const teto = this.add.tileSprite(0, 4, 3000, 8, 'chao');
        this.platforms.add(teto);
        const chao = this.add.tileSprite(0, 296, 3000, 8, 'chao');
        this.platforms.add(chao);

        this.time.now

        this.platformList=[
            {position:{x:200, y:200}, movement:"none"},
            {position:{x:350, y:200}, movement:"vertical", loopTime:2000},
            {position:{x:500, y:200}, movement:"horizontal", loopTime:2000},
        ]

        for(const platformConfig of this.platformList){
            const platform = this.add.tileSprite(platformConfig.position.x, platformConfig.position.y, 100, 4, 'chao');
            platform.movement = platformConfig.movement;
            platform.loopTime = platformConfig.loopTime;
            this.platforms.add(platform, true);
        }

        

        this.platforms.getChildren().forEach(function(platform){
            platform.body.setAllowGravity(false);
            platform.body.setImmovable(true);
        })










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
        this.cameras.main.setFollowOffset(0, 0)
        this.cameras.main.setBounds(0, 0, 1000, 150)
        this.cameras.main.setDeadzone(0, 0);
        this.cameras.main.setZoom(2);
    }
    
    update(){

        //Movimentação do jogador
        this.handlePlayerMovement();

        //Movimentação dos inimigos
        this.handleEnemyMovement(this.time.now);

        this.handlePlatformMovement(this.time.now);
    }

    handlePlayerMovement(){
        //MOVIMENTO
        if(!this.debugMode){
            //flag de gravidade e pulo
            if(
                (this.player.body.touching.down && !this.gravInvertida) || //gravidade pra baixo e player tocando o chao OU...
                (this.player.body.touching.up && this.gravInvertida) //gravidade pra cima e player tocando o teto
            ){
                this.gravFlag = true; //Reseta o flag de gravidade
                
                if(this.keys.up.isDown){ //Cima apertado
                    this.player.setVelocityY(this.forcaPulo); //Pulo
                }
            }

            //direita
            if (this.keys.right.isDown){
                this.player.setVelocityX(100);
                this.player.flipX = false;
            }

            //esquerda
            else if(this.keys.left.isDown){
                this.player.setVelocityX(-100)
                this.player.flipX = true;
            }

            //parado
            else{
                this.player.setVelocityX(0);
            }

            //Mudar a gravidade
            if (this.keys.space.isDown && this.gravFlag){
                this.invertGravity();
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
            ( (player.body.y + player.body.height - 10) > enemy.body.y && !this.gravInvertida) || //inimigo acima e gravidade para baixo
            ( (player.body.y + 10) < (enemy.body.y + enemy.body.height) && this.gravInvertida) //Inimigo abaixo e gravidade para cima
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

            player.setVelocityY(this.forcaPulo); //Pulo do player
            this.gravFlag = true //Reset do flag de gravidade
        }
    }

    killPlayer(){
        this.physics.world.gravity.y = 1000;
        this.input.keyboard.destroy() //Não pode se mover após a morte

        this.player.flipY = true;
        this.player.flipX = true;

        this.collider_player_platforms.destroy(); // Não colide com nada após a morte
        this.collider_player_enemies.destroy(); 
        this.player.setCollideWorldBounds(false);

        this.player.setVelocityY(-500); //Cai para baixo independente do sentido da gravidade
    }

    invertGravity(){
        this.physics.world.gravity.y *= -1;
        this.gravInvertida = !this.gravInvertida;
        this.gravFlag = false;
        this.forcaPulo *= -1;
        this.player.flipY = !this.player.flipY;
        this.enemies.getChildren().forEach(function(enemy){
            enemy.flipY=!enemy.flipY;
        })
    }

    handlePlatformMovement(time){
        this.platforms.getChildren().forEach(function (platform){
            switch (platform.movement){
                case "horizontal":
                    if (time % platform.loopTime < platform.loopTime/2){
                        platform.body.setAccelerationX(100);
                    }
                    else{
                        platform.body.setAccelerationX(-100);
                    }
                    break;

                case "vertical":
                    platform.body.setVelocityY(Math.sin(time/500)*150);
                    
                    // if (!time%platform.loopTime){
                    //     platform.setAccelerationY(platform.setAccelerationY * -1); //PARADO
                    // }

                    // platform.body.setVelocityY(((time % platform.loopTime) - platform.loopTime/2 ) /10) //PULA-PULA

                    // if (time % platform.loopTime < platform.loopTime/2){  //TEMPLATE
                    //     platform.body.setAccelerationY(-100);
                    // }
                    // else{
                    //     platform.body.setAccelerationY(100);
                    // }
                    break;
            }
        })
    }
}