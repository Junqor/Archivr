import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Game extends Scene
{
    paddle_speed: number = 400;
    paddle_focus_speed: number = 215;
    ball_speed: number = 175;
    ball_angle_coeff: number = 6;
    paddle_angle_influence: number = 0.75

    Camera: Phaser.Cameras.Scene2D.Camera | undefined;
    Paddle: Phaser.Physics.Arcade.Sprite | undefined;
    Balls: Phaser.Physics.Arcade.Group | undefined;
    Bricks: Phaser.Physics.Arcade.StaticGroup | undefined;
    Pickups: Phaser.Physics.Arcade.Group | undefined;
    Keys: any | undefined;

    addScore: ((v:number) => void) | undefined;

    constructor ()
    {
        super('Game');
    }

    update (): void {
        if (!this.Keys) return;
        if (!this.Paddle) return;
        let speed = this.paddle_speed;
        if (this.Keys['focus'].isUp){
            speed = this.paddle_focus_speed;
        }
        if (this.Keys['left'].isDown){
            this.Paddle.setVelocity(-speed,0);
        }
        else if (this.Keys['right'].isDown){
            this.Paddle.setVelocity(speed,0);
        }
        else {
            this.Paddle.setVelocity(0,0);
        }
    }

    create () {
        if (!this.input.keyboard) return;
        this.Keys = this.input.keyboard.addKeys({
            'left': Phaser.Input.Keyboard.KeyCodes.LEFT,
            'right': Phaser.Input.Keyboard.KeyCodes.RIGHT,
            'focus': Phaser.Input.Keyboard.KeyCodes.SHIFT,
        });

        this.physics.world.setBounds(0,0,400,300);

        this.Camera = this.cameras.main;
        this.Camera.setBackgroundColor(0x202020);

        this.Balls = this.physics.add.group();

        this.Bricks = this.physics.add.staticGroup();
        this.physics.world.addCollider(this.Bricks,this.Balls,(brick)=>{
            let Brick = brick as Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
            if (!Brick.body) return;
            if (Brick.anims.getName() == 'brick_0') {
                Brick.play('brick_1');
            }
            else{
                this.createPickup(Brick.body.position.x+12.5,Brick.body.position.y+7.5);
                Brick.destroy();
            }
        })

        this.Paddle = this.physics.add.sprite(200,275,'paddle');
        this.Paddle.setCollideWorldBounds();
        this.Paddle.setPushable(false);
        this.physics.world.addCollider(this.Paddle,this.Balls,(paddle,ball)=>{
            let b = ball as Phaser.Physics.Arcade.Sprite;
            let p = paddle as Phaser.Physics.Arcade.Sprite;
            if (!b.body || !p.body) return;
            const d = (b.body.position.x-37.5 - p.body.position.x)*this.ball_angle_coeff
            b.setVelocity(d*this.paddle_angle_influence+b.body.velocity.x*(1-this.paddle_angle_influence),-this.ball_speed);
        });

        this.Pickups = this.physics.add.group();
        this.physics.world.addCollider(this.Pickups,this.Paddle,(pickup,paddle)=>{
            let Pickup = pickup as Phaser.Physics.Arcade.Sprite;
            let Paddle = paddle as Phaser.Physics.Arcade.Sprite;
            if (!Paddle.body) return;
            // todo: figure out wtf is going on
            if (this.addScore) this.addScore(1);
            Paddle.destroy();
        });

        this.createBall(200,250);

        for (let l=0;l<3;l++){
            for (let i=0;i<14;i++){
                this.createBrick(i+1,2+l*3);
            }
        }

        EventBus.emit('current-scene-ready', this);
    }

    createBall (x:number,y:number) {
        if (!this.Balls) return;
        let Ball = this.physics.add.sprite(x,y,'ball');
        this.Balls.add(Ball);
        Ball.setDepth(100);
        Ball.setCollideWorldBounds();
        Ball.setVelocity(Phaser.Math.FloatBetween(-30,30),-this.ball_speed);
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
        Pickup.setAcceleration(0,100);
        Pickup.setMaxVelocity(0,50);
        Pickup.setVelocity(0,-75);
    }

    changeScene () {
        this.scene.start('GameOver');
    }
}
