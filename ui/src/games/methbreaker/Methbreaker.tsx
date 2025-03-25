import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import StartGame from './main';
import { EventBus } from './EventBus';
import { Game } from './scenes/Game';

export interface IRefPhaserGame
{
    game: Phaser.Game | null;
    scene: Phaser.Scene | null;
}

interface IProps
{
    currentActiveScene?: (scene_instance: Phaser.Scene) => void
}

export const Methbreaker = () => {
    const score = useRef<number>(0);
    const counter = useRef<HTMLParagraphElement>(null);
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    const addScore = (v:number)=>{
        setScore(score.current + v);
    }

    const setScore = (v:number)=>{
        score.current = v;
        if (counter.current)
            counter.current.textContent = "Pounds of meth: "+score.current;
    }

    return (
        <>
            <PhaserGame ref={phaserRef} currentActiveScene={(scene: Phaser.Scene)=>{
                const Scene = scene as Game;
                if (Scene){
                    setScore(0);
                    Scene.addScore = addScore;
                }
            }}/>
            <p ref={counter} className='font-semibold'>Pounds of meth: {score.current}</p>
            <p>
            ← →: Move<br/>
            Space: Shoot<br/>
            Shift: Fast Move
            </p>
        </>
    )
}

const PhaserGame = forwardRef<IRefPhaserGame, IProps>(function PhaserGame({ currentActiveScene }, ref)
{
    const game = useRef<Phaser.Game | null>(null!);

    useLayoutEffect(() =>
    {
        if (game.current === null)
        {

            game.current = StartGame("game-container");

            if (typeof ref === 'function')
            {
                ref({ game: game.current, scene: null });
            } else if (ref)
            {
                ref.current = { game: game.current, scene: null };
            }

        }

        return () =>
        {
            if (game.current)
            {
                game.current.destroy(true);
                if (game.current !== null)
                {
                    game.current = null;
                }
            }
        }
    }, [ref]);

    useEffect(() =>
    {
        EventBus.on('current-scene-ready', (scene_instance: Phaser.Scene) =>
        {
            if (currentActiveScene && typeof currentActiveScene === 'function')
            {

                currentActiveScene(scene_instance);

            }

            if (typeof ref === 'function')
            {
                ref({ game: game.current, scene: scene_instance });
            } else if (ref)
            {
                ref.current = { game: game.current, scene: scene_instance };
            }
            
        });
        return () =>
        {
            EventBus.removeListener('current-scene-ready');
        }
    }, [currentActiveScene, ref]);

    return (
        <div id="game-container"></div>
    );

});
