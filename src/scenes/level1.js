import Phaser from '../lib/phaser.js'

//declaração dos objetos do jogo, variáveis globais.
var player;
var platforms;
var movPlatforms;
var platformList;
var enemies;
var enemyList;
var keys;

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
        player = this.physics.add.image(16,122,'halphonzzo').setScale(1, 2);
            player.body.collideWorldBounds = true;

        //cria o grupo das plataformas(dinâmico)
        platforms = this.physics.add.group();
        movPlatforms = this.physics.add.group();
        
        //Cria o grupo dos inimigos(dinâmico)
        enemies = this.add.group();

        //Cria o tomato voador
        // const tomato = this.physics.add.image(200, 75, 'tomato');
        // tomato.body.setAllowGravity(false);
        // this.enemies.add(tomato);

        //cria o chão e o teto como tilesprites e adiciona ao grupo das pĺataformas
        const teto = this.add.tileSprite(0, 4, 3000, 8, 'chao');
        platforms.add(teto);
        const chao = this.add.tileSprite(0, 296, 3000, 8, 'chao');
        platforms.add(chao);

        this.time.now 

        enemyList=[
            {position:{x:200, y:75}, gravity:false, movement: "horizontal", stateTime: 2000, speed:75}
        ]

        //LISTA DE INIMIGOS (50%) E PLATAFORMAS (100%)
        for(const enemyConfig of enemyList){
            const enemy = this.physics.add.image(enemyConfig.position.x, enemyConfig.position.y, 'tomato');
            enemy.body.setAllowGravity(enemyConfig.gravity);
            enemy.position = enemyConfig.position;
            enemy.movement = enemyConfig.movement;
            enemy.stateTime = enemyConfig.stateTime;
            enemies.add(enemy, true);
        }

        platformList=[
            {position:{x:200, y:200}, movement:"none"},
            {position:{x:350, y:200}, movement:"vertical", positionDelta:80},
            {position:{x:500, y:200}, movement:"horizontal", positionDelta:150},
            {position:{x:200, y:150}, movement:"circle", positionDelta:100},
        ]

        for(const platformConfig of platformList){
            const platform = this.add.tileSprite(platformConfig.position.x, platformConfig.position.y, 100, 4, 'chao');
            platform.position = platformConfig.position;
            platform.movement = platformConfig.movement;
            platform.positionDelta = platformConfig.positionDelta;
            platforms.add(platform, true);
        }

        

        platforms.getChildren().forEach(function(platform){
            platform.body.setAllowGravity(false);
            platform.body.setImmovable(true);
        })




        //CRIAÇÃO DE COLISÕES

        //adiciona colisao entre o player e as plataformas
        this.collider_player_platforms = this.physics.add.collider(player, platforms);
        
        this.collider_player_enemies = this.physics.add.overlap(player, enemies, this.handleHit, undefined, this);

        //ETC

        //cria o controle de inputs
        keys = this.input.keyboard.createCursorKeys()

        //flag de mudança de gravidade
        this.gravFlag = false;

        //Configuração da câmera
        this.cameras.main.startFollow(player)
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
                (player.body.touching.down && !this.gravInvertida) || //gravidade pra baixo e player tocando o chao OU...
                (player.body.touching.up && this.gravInvertida) //gravidade pra cima e player tocando o teto
            ){
                this.gravFlag = true; //Reseta o flag de gravidade
                
                if(keys.up.isDown){ //Cima apertado
                    player.setVelocityY(this.forcaPulo); //Pulo
                }
            }

            //direita
            if (keys.right.isDown){
                player.setVelocityX(100);
                player.flipX = false;
            }

            //esquerda
            else if(keys.left.isDown){
                player.setVelocityX(-100)
                player.flipX = true;
            }

            //parado
            else{
                player.setVelocityX(0);
            }

            //Mudar a gravidade
            if (keys.space.isDown && this.gravFlag){
                this.invertGravity();
            }

        }

        else{ //Modo debug provisório
            if(keys.up.isDown){
                player.setVelocityY(-100);
            }
            else if(keys.down.isDown){
                player.setVelocityY(100);
            }
            else if(keys.left.isDown){
                player.setVelocityX(-100);
            }
            else if(keys.right.isDown){
                player.setVelocityX(100);
            }

            else{
                player.setVelocityX(0);
                player.setVelocityY(0);
            }
        }

        if(keys.shift.isDown){ //Ativação do modo debug **TROCAR PARA KEY COMBO**
            this.debugMode = !this.debugMode;
            player.body.setAllowGravity(!this.debugMode);
        }
    }

    //MOVIMENTO DOS INIMIGOS
    handleEnemyMovement(time){
        //Faz os inimigos andarem em zigzag
        enemies.getChildren().forEach(function(enemy){

            if(time%enemy.stateTime == 0){
                enemy.setVelocityX(enemy.body.setVelocityX *= -1);
                enemy.flipX = !enemy.flipX;
            }
            // else{
            //     enemy.setVelocityX(-75);
            //     enemy.flipX = false;
            // }
        })
    }

    //interaçoes do jogador com inimigos
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
            enemies.remove(enemy); //Tira colisão do inimigo
            enemy.flipY = true; // Gira o inimigo
            enemy.setVelocityX(0); //Pulinho
            enemy.setVelocityY(-200);
            enemy.setAccelerationY(1000);

            player.setVelocityY(this.forcaPulo); //Pulo do player
            this.gravFlag = true //Reset do flag de gravidade
        }
    }

    //morte do jogador
    killPlayer(){
        this.physics.world.gravity.y = 1000;
        this.input.keyboard.destroy() //Não pode se mover após a morte

        player.flipY = true;
        player.flipX = true;

        this.collider_player_platforms.destroy(); // Não colide com nada após a morte
        this.collider_player_enemies.destroy(); 
        player.setCollideWorldBounds(false);

        player.setVelocityY(-500); //Cai para baixo independente do sentido da gravidade
    }

    //inversão gravitacional
    invertGravity(){
        this.physics.world.gravity.y *= -1;
        this.gravInvertida = !this.gravInvertida;
        this.gravFlag = false;
        this.forcaPulo *= -1;
        player.flipY = !player.flipY;
        enemies.getChildren().forEach(function(enemy){
            enemy.flipY=!enemy.flipY;
        })
    }

    //movimento das plataformas
    handlePlatformMovement(time){
        const senTempo = Math.sin(time/1000);
        const cosTempo = Math.cos(time/1000);
        platforms.getChildren().forEach(function (platform){
            switch (platform.movement){
                case "horizontal":
                    platform.setX(platform.position.x + senTempo*platform.positionDelta);
                    break;

                case "vertical":
                    platform.setY(platform.position.y + senTempo*platform.positionDelta);
                    
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

                case "circle":
                    platform.setX(platform.position.x + senTempo*platform.positionDelta);
                    platform.setY(platform.position.y + cosTempo*platform.positionDelta);
                    break;
            }
        })
    }
}