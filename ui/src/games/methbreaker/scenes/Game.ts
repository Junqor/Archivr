import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import levels from '../levels.json';

enum GAME_STATE {
    INIT,
    PLAYING,
    BALL_SHOOT,
    LEVEL_END,
    LEVEL_BEGIN,
    DIE,
    GAME_OVER,
}

type TLevel = {
    title: string;
    bg: string;
    body: Array<string>;
}

export class Game extends Scene
{
    
    game_state: GAME_STATE = GAME_STATE.INIT;
    lives: number = 0;
    current_level: TLevel | null = null;
    current_level_index: number = 0;
    level_stats_collected: number = 0;
    level_stats_total_bricks: number = 0;
    level_stats_time: number = 0;
    state_timer: number = 0;
    paddle_speed: number = 400;
    paddle_focus_speed: number = 215;
    ball_speed: number = 175;
    ball_turbo_speed: number = 300;
    ball_angle_coeff: number = 6;
    paddle_angle_influence: number = 0.75;

    level_data: Array<TLevel> | undefined;

    Background: Phaser.GameObjects.Image | undefined;
    Camera: Phaser.Cameras.Scene2D.Camera | undefined;
    Paddle: Phaser.Physics.Arcade.Sprite | undefined;
    PaddleTween: Phaser.Tweens.Tween | undefined;
    PaddleFX: Phaser.FX.Barrel | undefined;
    Balls: Phaser.Physics.Arcade.Group | undefined;
    Bricks: Phaser.Physics.Arcade.StaticGroup | undefined;
    Pickups: Phaser.Physics.Arcade.Group | undefined;
    Keys: any | undefined;
    SceneText: Phaser.GameObjects.Group | undefined;
    LivesCounter: Phaser.GameObjects.Text | undefined;

    addScore: ((v:number) => void) | undefined;

    constructor ()
    {
        super('Game');
    }

    update(_time:number, delta:number): void {
        if (!this.Keys) return;
        if (!this.Paddle) return;
        this.state_timer += delta/1000;
        this.level_stats_time += delta/1000;
        let vel = 0;
        if (this.game_state == GAME_STATE.PLAYING || this.game_state == GAME_STATE.BALL_SHOOT){
            let speed = this.paddle_speed;
            if (this.Keys['focus'].isUp){
                speed = this.paddle_focus_speed;
            }
            if (this.Keys['left'].isDown){
                vel = -speed;
            }
            else if (this.Keys['right'].isDown){
                vel = speed;
            }
            this.Paddle.setVelocity(vel,0);
        }
        else {
            this.Paddle.setVelocity(0,0);
        }
        if (this.game_state == GAME_STATE.PLAYING) {
            if (this.PaddleTween) {
                if (Phaser.Input.Keyboard.JustDown(this.Keys['shoot']) && !this.PaddleTween.isPlaying()) {
                    this.PaddleTween.reset();
                }
            }
        }
        else if (this.game_state == GAME_STATE.LEVEL_BEGIN){
            if (this.state_timer > 1){
                this.changeGameState(GAME_STATE.BALL_SHOOT);
            }
        }
        else if (this.game_state == GAME_STATE.LEVEL_END){
            if (this.state_timer > 5){
                this.current_level_index = this.current_level_index + 1;
                this.buildLevel(this.current_level_index);
                this.changeGameState(GAME_STATE.LEVEL_BEGIN);
            }
        }
        else if (this.game_state == GAME_STATE.DIE){
            if (this.state_timer > 1){
                this.resetPaddleBall();
                this.changeGameState(GAME_STATE.LEVEL_BEGIN);
            }
        }
        else if (this.game_state == GAME_STATE.GAME_OVER){

        }
        else if (this.game_state == GAME_STATE.BALL_SHOOT){
            this.Balls?.children.iterate((ball:Phaser.GameObjects.GameObject)=>{
                let Ball = ball as Phaser.Physics.Arcade.Sprite;
                const Scene = Ball.scene as Game;
                if (!Scene.Paddle || !Scene.Paddle.body) return null;
                Ball.setPosition(Scene.Paddle.body.position.x+37.5,250);
                return null;
            });
            if (Phaser.Input.Keyboard.JustDown(this.Keys['shoot'])) {
                this.changeGameState(GAME_STATE.PLAYING);
            }
        }
    }

    create () {
        if (!this.input.keyboard) return;
        this.Keys = this.input.keyboard.addKeys({
            'left': Phaser.Input.Keyboard.KeyCodes.LEFT,
            'right': Phaser.Input.Keyboard.KeyCodes.RIGHT,
            'focus': Phaser.Input.Keyboard.KeyCodes.SHIFT,
            'shoot': Phaser.Input.Keyboard.KeyCodes.UP,
        });

        this.level_data = levels;

        this.physics.world.setBounds(0,0,400,332);

        this.Camera = this.cameras.main;
        this.Camera.setBackgroundColor(0x202020);

        this.Balls = this.physics.add.group();

        this.Bricks = this.physics.add.staticGroup();
        this.physics.world.addCollider(this.Bricks,this.Balls,(brick, _ball)=>{
            let Brick = brick as Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
            //let Ball = ball as Phaser.Physics.Arcade.Sprite;
            if (Brick.anims.getName() == 'brick_0') {
                const fx = Brick.preFX?.addBarrel(1.5);
                this.tweens.add({
                    targets: fx,
                    amount: 1,
                    duration: 100,
                })
                Brick.play('brick_1');
            }
            else{
                this.createPickup(Brick.body.position.x+12.5,Brick.body.position.y+7.5);
                Brick.destroy();
                if (this.game_state == GAME_STATE.PLAYING && this.Bricks?.getLength() == 0) {
                    this.changeGameState(GAME_STATE.LEVEL_END);
                }
            }
        })
        
        this.Paddle = this.physics.add.sprite(200,275,'paddle');
        this.Paddle.scale = 0.5;
        this.Paddle.setCollideWorldBounds();
        this.Paddle.setPushable(false);
        this.PaddleFX = this.Paddle.preFX?.addBarrel(1);
        this.physics.world.addCollider(this.Paddle,this.Balls,(paddle,ball)=>{
            let b = ball as Phaser.Physics.Arcade.Sprite;
            let p = paddle as Phaser.Physics.Arcade.Sprite;
            if (!b.body || !p.body) return;

            const d = (b.body.position.x-37.5 - p.body.position.x)*this.ball_angle_coeff
        
            b.setVelocityX(d*this.paddle_angle_influence+b.body.velocity.x*(1-this.paddle_angle_influence));
            if (this.PaddleTween && this.PaddleTween.isPlaying()) {
                b.setVelocityY(-this.ball_turbo_speed);
            }
            else {
                b.setVelocityY(-this.ball_speed);
            }
    
            if (this.PaddleFX) {
                this.PaddleFX.amount = 1.2;
                this.tweens.add({
                    targets: this.PaddleFX,
                    amount: 1,
                    duration: 200,
                });
            }
        });

        this.PaddleTween = this.tweens.add({
            targets: this.Paddle,
            y: '-=20',
            ease: 'linear',
            duration: 100,
            repeat: 0,
            yoyo: true,
            persist: true,
        });
        this.PaddleTween.stop();
        

        this.Pickups = this.physics.add.group();
        // When matching a group with a sprite, the first callback parameter is always the sprite
        this.physics.world.addCollider(this.Pickups,this.Paddle,(_,pickup)=>{
            let Pickup = pickup as Phaser.Physics.Arcade.Sprite;
            if (this.addScore) this.addScore(1);
            this.level_stats_collected += 1;
            Pickup.destroy();
        });

        this.SceneText = this.add.group();

        this.LivesCounter = this.add.text(10, 10, 'balls', {
            fontFamily: 'Arial Black', fontSize: 14, color: '#ffffff',
            stroke: '#000000', strokeThickness: 2,
            align: 'left',
        }).setOrigin(0).setDepth(500);

        this.setLives(3);

        this.physics.world.on('worldbounds',this.onWorldBounds);

        this.current_level_index = 0;
        this.buildLevel(this.current_level_index);
        this.changeGameState(GAME_STATE.LEVEL_BEGIN)

        EventBus.emit('current-scene-ready', this);
    }

    onWorldBounds (body:Phaser.Physics.Arcade.Body,_up:boolean,down:boolean,_left:boolean,_right:boolean) {
        const Scene = body.gameObject.scene as Game;
        if (!Scene.Balls) return;
        if (!Scene.Pickups) return;
        if (Scene.Balls.contains(body.gameObject)){
            if (down) {
                Scene.setLives(Scene.lives-1);
                body.gameObject.destroy();
                if (Scene.game_state == GAME_STATE.PLAYING && Scene.Balls.getLength() == 0) {
                    Scene.changeGameState(GAME_STATE.DIE);
                }
            }
        }
        else if (Scene.Pickups.contains(body.gameObject)){
            if (down) {
                body.gameObject.destroy();
            }
        }
    }

    changeGameState(new_state:GAME_STATE){
        if (!this.Balls) return;
        if (!this.Pickups) return;
        if (!this.Paddle) return;
        if (!this.SceneText) return;
        if (!this.level_data) return;
        this.state_timer = 0;
        this.SceneText.clear(true);
        //const old_state = this.game_state;
        this.game_state = new_state;
        switch (new_state) {
            case GAME_STATE.LEVEL_BEGIN:
                this.Balls.setVelocity(0,0);
                this.SceneText.add(this.add.text(200, 125, 'LEVEL '+(this.current_level_index+1).toString(), {
                    fontFamily: 'Arial Black', fontSize: 28, color: '#ffffff',
                    stroke: '#000000', strokeThickness: 4,
                    align: 'center',
                }).setOrigin(0.5).setDepth(500));
                this.SceneText.add(this.add.text(200, 175, this.current_level ? this.current_level.title : "", {
                    fontFamily: 'Arial Black', fontSize: 20, color: '#ffffff',
                    stroke: '#000000', strokeThickness: 3,
                    align: 'center',
                }).setOrigin(0.5).setDepth(500));
                break;
            case GAME_STATE.PLAYING:
                this.Balls.setVelocity(Phaser.Math.FloatBetween(-30,30),-this.ball_speed);
                break;
            case GAME_STATE.LEVEL_END:
                this.Balls.setVelocity(0,0);
                this.Pickups.children.iterate((pickup:Phaser.GameObjects.GameObject)=>{
                    const Pickup = pickup as Phaser.Physics.Arcade.Sprite;
                    const Scene = pickup.scene as Game;
                    if (!Scene) return null;
                    if (!Scene.Paddle) return null;
                    if (!Scene.Paddle.body) return null;
                    if (!Pickup.body) return null;
                    this.level_stats_collected += 1;
                    if (Pickup) {
                        Pickup.setAcceleration(0,0);
                        Pickup.setMaxVelocity(1000,1000);
                        Pickup.setVelocity(Scene.Paddle.body.position.x+37.5-Pickup.body.position.x,Scene.Paddle.body.position.y-Pickup.body.position.y);
                    }
                    return null;
                })
                this.SceneText.add(this.add.text(200, 115, 'LEVEL CLEAR', {
                    fontFamily: 'Arial Black', fontSize: 30, color: '#ffffff',
                    stroke: '#000000', strokeThickness: 4,
                    align: 'center',
                }).setOrigin(0.5).setDepth(500));
                const t = Math.floor(this.level_stats_time);
                this.SceneText.add(this.add.text(200, 150, 'TIME: '+Math.floor(t/60).toString()+(t<10?":0":":")+(t%60).toString(), {
                    fontFamily: 'Arial Black', fontSize: 20, color: '#ffffff',
                    stroke: '#000000', strokeThickness: 3,
                    align: 'center',
                }).setOrigin(0.5).setDepth(500));
                const purity = Math.ceil((this.level_stats_collected/this.level_stats_total_bricks)*1000)/10;
                this.SceneText.add(this.add.text(200, 175, `COOK: ${purity}% Pure (${this.level_stats_collected}/${this.level_stats_total_bricks})`, {
                    fontFamily: 'Arial Black', fontSize: 20, color: '#ffffff',
                    stroke: '#000000', strokeThickness: 3,
                    align: 'center',
                }).setOrigin(0.5).setDepth(500));
                let grade = "F";
                let grade_color = '#FF8800';
                if (purity >= 90){
                    grade = "A";
                    grade_color = "#FF0000"

                    // 1up
                    this.setLives(this.lives+1);
                    this.SceneText.add(this.add.text(250, 215, "+1UP", {
                        fontFamily: 'Arial Black', fontSize: 20, color: '#00FF00',
                        stroke: '#000000', strokeThickness: 2,
                        align: 'center',
                    }).setOrigin(0.5).setDepth(500));
                }
                else if (purity >= 80){
                    grade = "B";
                    grade_color = "#00FF00"
                }
                else if (purity >= 70){
                    grade = "C";
                    grade_color = "#0088FF"
                }
                else if (purity >= 60){
                    grade = "D";
                    grade_color = "#880088"
                }
                this.SceneText.add(this.add.text(200, 215, grade, {
                    fontFamily: 'Arial Black', fontSize: 40, color: grade_color,
                    stroke: '#000000', strokeThickness: 5,
                    align: 'center',
                }).setOrigin(0.5).setDepth(500));
                break;
            case GAME_STATE.DIE:
                this.Balls.setVelocity(0,0);
                break;
            case GAME_STATE.GAME_OVER:
                this.Balls.setVelocity(0,0);
                this.Pickups.clear(true);
                this.SceneText.add(this.add.text(200, 150, 'YOU DIED', {
                    fontFamily: 'Arial Black', fontSize: 28, color: '#ffffff',
                    stroke: '#000000', strokeThickness: 4,
                    align: 'center',
                }).setOrigin(0.5).setDepth(500));
                break;
        }
    }

    setLives(v:number) {
        this.lives = v;
        if (this.LivesCounter) {   
            if (this.lives < 0) {
                this.LivesCounter.text = "Balls: ";
                this.changeGameState(GAME_STATE.GAME_OVER);
            }
            else{
                let s:string = "";
                for (let i=0;i<this.lives;i++){
                    s = s + "O"
                }
                this.LivesCounter.text = "Balls: "+s;
            }
        }   
    }

    resetPaddleBall() {
        this.createBall(200,250);
        if (this.PaddleTween) {
            this.PaddleTween.stop();
        }
        this.Paddle?.setPosition(200,275);
    }

    clearLevel() {
        if (!this.Balls) return;
        if (!this.Bricks) return;
        if (!this.Pickups) return;
        if (!this.Paddle) return;
        this.Balls.clear(true);
        this.Bricks.clear(true);
        this.Pickups.clear(true);
        if (this.Background) {
            this.Background.destroy();
        }
    }

    buildLevel(index:number) {
        if (!this.level_data) return;
        this.clearLevel();

        this.resetPaddleBall();

        this.level_stats_collected = 0;
        this.level_stats_time = 0;
        this.level_stats_total_bricks = 0;

        this.current_level = this.level_data[index%this.level_data.length];
        this.current_level

        this.Background = this.add.image(200, 150, this.current_level.bg);
        this.Background.depth = -100;

        for (let y=0;y<this.current_level.body.length;y++){
            for (let x=0;x<this.current_level.body[y].length;x++){
                const c = this.current_level.body[y][x];
                switch (c){
                    case '0':
                        break;
                    case '1':
                        this.createBrick(x,y);
                        this.level_stats_total_bricks += 1;
                        break;
                }
            }
        }
    }

    createBall (x:number,y:number) {
        if (!this.Balls) return;
        let Ball = this.physics.add.sprite(x,y,'ball');
        this.Balls.add(Ball);
        Ball.setDepth(100);
        Ball.setCollideWorldBounds(true);
        Ball.body.onWorldBounds = true;
        Ball.setVelocity(0,0);
        Ball.setBounce(1,1);
    }

    createBrick (x:number,y:number) {
        if (!this.Bricks) return;
        let Brick = this.physics.add.staticSprite(12.5+x*25,7.5+y*15,'brick');
        this.Bricks.add(Brick);
        Brick.play('brick_0');
    }

    createPickup(x:number,y:number) {
        if (!this.Pickups) return;
        let Pickup = this.physics.add.sprite(x,y,'meth');
        this.Pickups.add(Pickup);
        Pickup.preFX?.addGlow(0x00ffff,1);
        const fx = Pickup.preFX?.addBarrel(2);
        this.tweens.add({
            targets: fx,
            amount: 1,
            duration: 100,
        })
        Pickup.setCollideWorldBounds(true);
        Pickup.body.onWorldBounds = true;
        Pickup.setAcceleration(0,150);
        Pickup.setMaxVelocity(0,75);
        Pickup.setVelocity(0,-75);
    }

    changeScene () {
        this.scene.start('GameOver');
    }
}
