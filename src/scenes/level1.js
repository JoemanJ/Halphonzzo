import Phaser from '../lib/phaser.js'
import game from '../main.js'
import Tomate from '../Classes/tomate.js'
import Azeitona from '../Classes/azeitona.js'

//declaração dos objetos do jogo, variáveis globais.
var player, playerDead = false;
var platforms;
var platformList, boundsList;
var enemies;
var enemyList;
var hazards;
var hazardsList;
var keys;
var spikes, spikesList;
var morteSound;


export default class level1 extends Phaser.Scene{
    constructor(){
        super('level1');
    }
    
    debugMode = false;
    gravInvertida = false;
    forcaPulo = -500;

    preload(){
        
        //Carrega as imagens a serem utilizadas
        this.load.image('chao', './src/sprites/pix_chao.png');
        this.load.image('halphonzzo', './src/sprites/pix_player.png');
        this.load.image('tomate', './src/sprites/pix_tomato.png');
        this.load.image('espinho', './src/sprites/dungeon/PNG/Details/stalagmite2.png');
        this.load.image('lump', './src/sprites/lump.png');
        this.load.image('azeitona', './src/sprites/azeitona.png');

        //carrega sons
        this.load.audio('morte', './src/sounds/somDeMort.mp3');
    }
    
    create(){
        this.physics.world.setBounds(0, 0, 3000, 300);

        //adiciona sons ao jogo
        morteSound = this.sound.add('morte');

        //CRIAÇÃO DE OBJETOS
        //cria o objeto player e faz ele colidir com as bordas do mundo
        player = this.physics.add.image(25,130,'halphonzzo').setScale(0.02, 0.02);
            player.body.setSize(700,1500,false);
            player.body.setOffset(700,100);

        //cria o grupo das plataformas(dinâmico)
        platforms = this.physics.add.group();

        //cria o grupo dos hazards(dinâmico)
        hazards = this.physics.add.group();
        
        //Cria o grupo dos inimigos(dinâmico)
        enemies = this.add.group();

        //array usado para plataformas estáticas(tileSprites)
        boundsList =[
            {position:{x:0, y:4}, gravity: false, movement:"none", width: 200, height: 8},
            {position:{x:0, y:296}, gravity: false, movement:"none", width: 200, height: 8},
            {position:{x:300, y:30}, gravity: false, movement:"none", width:80, height: 8}
        ]
        
        //configurações de cada platforma do array boundsList
        for(const boundConfig of boundsList){
            const bound = this.add.tileSprite(boundConfig.position.x,boundConfig.position.y,boundConfig.width,boundConfig.height,'chao');
            bound.position = boundConfig.position;
            bound.movement = boundConfig.movement;
            platforms.add(bound, true);
        }

        hazardsList = [
            {x:200, y:300, gravity: false, movement:"none", width:150 ,height:40, tile:'espinho'},
            {x:220, y:300, gravity: false, movement:"none", width:150 ,height:40, tile:'espinho'},
            {x:240, y:300, gravity: false, movement:"none", width:150 ,height:40, tile:'espinho'},
            {x:260, y:300, gravity: false, movement:"none", width:150 ,height:40, tile:'espinho'},
            {x:280, y:300, gravity: false, movement:"none", width:150 ,height:40, tile:'espinho'},
            {x:300, y:300, gravity: false, movement:"none", width:150 ,height:40, tile:'espinho'},
            {x:320, y:300, gravity: false, movement:"none", width:150 ,height:40, tile:'espinho'},
            {x:340, y:300, gravity: false, movement:"none", width:150 ,height:40, tile:'espinho'},
        ]

        for(const hazardConfig of hazardsList){
            const hazard = this.add.image(hazardConfig.x, hazardConfig.y, hazardConfig.tile);
            hazard.x = hazardConfig.x;
            hazard.y = hazardConfig.y;
            hazard.movement = hazardConfig.movement;
            hazards.add(hazard, true);
        }

        hazards.getChildren().forEach(function(spike){
            spike.body.setAllowGravity(false);
            spike.body.setSize(25,48);
            spike.body.setOffset(20,8);
            spike.body.setImmovable(true);
        })

        enemyList=[
            {type:'tomate', x:200, y:175, gravity:false, movement: "horizontal", stateTime: 2000, speed:75},
            {type:'azeitona', x:80, y:175, gravity:true, movement: "none", stateTime: 2000, speed:75},
        ]

        //LISTA DE INIMIGOS
        for(const enemyConfig of enemyList){
            let enemy;
            let behavior;
            switch (enemyConfig.type){
                case 'azeitona':
                    enemy = new Azeitona(this, enemyConfig.x, enemyConfig.y, 'azeitona', enemyConfig.stateTime);

                    behavior = this.time.addEvent({loop: true, delay: enemy.stateTime, callbackScope: this, callback: function(){
                        if(enemy.active){
                            enemies.add(enemy.shoot());
                        }}, args:[enemy]});
                        enemies.add(enemy);
                    break;
                        
                case 'tomate':
                    enemy = new Tomate(this, enemyConfig.x, enemyConfig.y, 'tomate', enemyConfig.movement, enemyConfig.speed, enemyConfig.stateTime);
                    
                    behavior = this.time.addEvent({loop: true, delay: enemy.stateTime, callbackScope: this, callback: function(){
                        if(enemy.active){
                            enemy.turn();
                        }}, args:[enemy]});
                        enemies.add(enemy);
                    break;

                }
        }

        //LISTA DE PLATAFORMAS
        platformList=[
            //{position:{x:300, y:30}, movement:"none"},
            //{position:{x:350, y:200}, movement:"vertical", positionDelta:80},
            {x:400, y:200, movement:"horizontal", positionDelta:150},
            //{position:{x:200, y:150}, movement:"circle", positionDelta:100}
        ]

        for(const platformConfig of platformList){
            const platform = this.physics.add.sprite(platformConfig.x, platformConfig.y, 'chao');
            platform.x = platformConfig.x;
            platform.y = platformConfig.y;
            platform.movement = platformConfig.movement;
            platform.positionDelta = platformConfig.positionDelta;
            platform.setScale(10,1);
            platforms.add(platform, true);
        }

        platforms.getChildren().forEach(function(platform){
            platform.body.setAllowGravity(false);
            platform.body.setImmovable(true);
            platform.body.setFrictionX(1);
        })

        //CRIAÇÃO DE COLISÕES

        //adiciona colisao entre o player e as plataformas

        this.collider_player_platforms = this.physics.add.collider(player, platforms,this.handleGravityControl,undefined,this);
        
        this.collider_player_enemies = this.physics.add.overlap(player, enemies, this.handleHit, undefined, this);

        this.collider_player_hazards = this.physics.add.collider(player,hazards, this.killPlayer, undefined, this);

        this.collider_enemies_platforms = this.physics.add.collider(enemies, platforms);

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
        //this.handleEnemyMovement(this.time.now);

        this.handlePlatformMovement(this.time.now);
        
        this.checkPlayerOffBounds();
    }

    checkPlayerOffBounds(){
        if(!this.cameras.main.worldView.contains(player.body.x,player.body.y) && !playerDead){
            //this.killPlayer();
            this.restartScene();
        }
    }

    restartScene(){
        this.scene.restart;
    }

    handlePlayerMovement(){
        //MOVIMENTO
        if(!this.debugMode){
            //direita
            if (keys.right.isDown){
                player.setVelocityX(100);
                player.flipX = false;
                player.body.setOffset(700,100);
            }
            //esquerda
            else if(keys.left.isDown){
                player.setVelocityX(-100)
                player.flipX = true;
                player.body.setOffset(200,100);
                
            }
            //parado
            else{
                player.setVelocityX(0);
            }
            //Mudar a gravidade
            if (keys.space.isDown && this.gravFlag > 0){
                this.gravFlag--;
                this.invertGravity();
                keys.space.reset();
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
            enemy.body.setVelocityX(0); //Pulinho
            enemy.body.setVelocityY(-200);
            enemy.body.setAccelerationY(1000);
            enemy.setActive(false);
            this.gravFlag++;
            player.setVelocityY(this.forcaPulo); //Pulo do player
            
        }
    }

    //morte do jogador
    killPlayer(){

        morteSound.play();
        this.physics.world.gravity.y = 1000;
        this.input.keyboard.enabled=false //Não pode se mover após a morte

        player.flipY = true;
        player.flipX = true;

        this.collider_player_platforms.destroy(); // Não colide com nada após a morte
        this.collider_player_enemies.destroy();
        this.collider_player_hazards.destroy(); 

        this.cameras.main.setFollowOffset(3000);
        
        player.setVelocityY(-500); //Cai para baixo independente do sentido da gravidade
        playerDead = true;

        this.time.addEvent({delay: 2000, callbackScope: this, callback: function() {
            this.scene.restart();
            this.input.keyboard.enabled=true;
        }, args: [this]});


    }

    //inversão gravitacional
    invertGravity(){
        this.physics.world.gravity.y *= -1;
        this.gravInvertida = !this.gravInvertida;
        //this.gravFlag = false;
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
                    platform.setVelocityX(senTempo*platform.positionDelta);
                    break;

                case "vertical":
                    platform.setVelocityY(senTempo*platform.positionDelta);
                    
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
                    platform.setVelocityX(senTempo*platform.positionDelta);
                    platform.setVelocityY(cosTempo*platform.positionDelta);
                    break;
            }
        })
    }

    handleGravityControl(){
        if(
            (player.body.touching.down && !this.gravInvertida) || //gravidade pra baixo e player tocando o chao OU...
            (player.body.touching.up && this.gravInvertida) //gravidade pra cima e player tocando o teto
        ){
            this.gravFlag = 2; //Reseta o flag de gravidade
        }

    }

}