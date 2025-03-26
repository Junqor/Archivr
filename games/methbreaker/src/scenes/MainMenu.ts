import { GameObjects, Scene } from 'phaser';

import { EventBus } from '../EventBus';

export class MainMenu extends Scene
{
    background: GameObjects.Image | undefined;

    constructor () {
        super('MainMenu');
    }

    create () {
        this.background = this.add.image(200, 150, 'main_menu').setScale(0.5);

        this.add.text(200, 50, 'AMC presents:', {
            fontFamily: 'Arial Black', fontSize: 19, color: '#ffffff',
            stroke: '#000000', strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        this.add.text(200, 100, 'Methbreaker', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        this.add.text(200, 200, 'Click to Play!', {
            fontFamily: 'Arial Black', fontSize: 30, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        this.input.on('pointerdown', ()=>{
            this.changeScene();
        });

        EventBus.emit('current-scene-ready', this);
    }
    
    changeScene () {
        this.scene.start('Game');
    }
}
