import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        this.add.image(200, 150, 'background');

        this.add.rectangle(200, 150, 300, 32).setStrokeStyle(1, 0xffffff);

        const bar = this.add.rectangle(200-230, 150, 4, 28, 0xffffff);

        this.load.on('progress', (progress: number) => {

            bar.width = 4 + (296 * progress);

        });
    }

    preload ()
    {
        this.load.setPath('/games/methbreaker');

        this.load.image('logo', 'logo.png');
        this.load.image('star', 'star.png');
        this.load.image('main_menu', 'main_menu.png');
        this.load.image('paddle', 'paddle.png');
        this.load.image('ball', 'ball.png');
        this.load.spritesheet('brick','meth_block.png', { frameWidth:25, frameHeight:15 });
        this.load.image('meth', 'meth.png');
        this.load.image('level_1', 'level_1.png');
        this.load.image('level_2', 'level_2.png');
        this.load.image('level_3', 'level_3.png');
        this.load.image('level_4', 'level_4.png');
        this.load.image('level_5', 'level_5.png');
    }

    create ()
    {
        this.anims.create({
            key: "brick_0",
            repeat: 0,
            frames: [
                { key: "brick", frame: 0 },
            ],
        });

        this.anims.create({
            key: "brick_1",
            repeat: 0,
            frames: [
                { key: "brick", frame: 1 },
            ],
        });

        this.scene.start('MainMenu');
    }
}
