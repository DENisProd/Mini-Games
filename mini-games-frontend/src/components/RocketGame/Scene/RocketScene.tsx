import Konva from "konva";
import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { Image as KonvaImage, Layer, Stage, Text } from "react-konva";
import useImage from "use-image";
import RocketImage from "../../../assets/rocket.png";
import BackgroundImage from "../../../assets/background.png";
import { SceneState } from "./scene";

const ROCKET_RATIO = 684 / 773;
const BACKGROUND_RATIO = 2809 / 1575;
// Во сколько раз фон выше сцены: есть куда «подниматься» камере
const BACKGROUND_SCALE = 2.2;
// Насколько высоко поднимается камера (0 — земля, 1 — верх фона)
const MAX_CAMERA = 0.8;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

interface Props {
    scene: MutableRefObject<SceneState>;
    className?: string;
}

const RocketScene: React.FC<Props> = ({ scene, className }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const backgroundLayerRef = useRef<Konva.Layer>(null);
    const layerRef = useRef<Konva.Layer>(null);
    const background1Ref = useRef<Konva.Image>(null);
    const background2Ref = useRef<Konva.Image>(null);
    const rocketRef = useRef<Konva.Image>(null);
    const multiplierRef = useRef<Konva.Text>(null);
    const statusRef = useRef<Konva.Text>(null);

    const [size, setSize] = useState({ width: 0, height: 0 });
    const [rocketImage] = useImage(RocketImage);
    const [backgroundImage] = useImage(BackgroundImage);

    useEffect(() => {
        const element = containerRef.current;
        if (!element) return;

        const update = () => setSize({ width: element.clientWidth, height: element.clientHeight });
        update();

        const observer = new ResizeObserver(update);
        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    const { width, height } = size;
    const rocketHeight = height * 0.28;
    const rocketWidth = rocketHeight * ROCKET_RATIO;
    const backgroundHeight = height * BACKGROUND_SCALE;
    const backgroundWidth = Math.max(backgroundHeight * BACKGROUND_RATIO, width);

    useEffect(() => {
        if (!width || !height || !layerRef.current || !backgroundLayerRef.current) return;

        const groundX = width * 0.12;
        const groundY = height - rocketHeight * 0.55;

        // Текущие (сглаженные) значения. Всё движение — это плавное
        // стремление к целевым значениям, поэтому смена фазы не даёт рывков.
        const view = {
            x: groundX,
            y: groundY,
            rotation: 0,
            opacity: 1,
            wobble: 0,
            camera: 0,
            speed: 0,
            scroll: 0,
            multiplier: 1,
            phase: scene.current.phase,
        };

        const animation = new Konva.Animation((frame) => {
            if (!frame) return;

            // Ограничиваем шаг, чтобы после неактивной вкладки ничего не «прыгало»
            const dt = Math.min(frame.timeDiff, 100) / 1000;
            const smooth = (rate: number) => 1 - Math.exp(-dt * rate);
            const state = scene.current;
            const t = (performance.now() - state.phaseStartedAt) / 1000;

            if (view.phase !== state.phase) {
                if (state.phase === "waiting") {
                    // Новый раунд: ставим ракету на старт и плавно проявляем
                    view.x = groundX;
                    view.y = groundY;
                    view.rotation = 0;
                    view.opacity = 0;
                    view.multiplier = 1;
                }
                view.phase = state.phase;
            }

            let targetX = groundX;
            let targetY = groundY;
            let targetRotation = 0;
            let targetCamera = 0;
            let targetSpeed = 0;
            let targetWobble = 0;
            let rate = 3;

            if (state.phase === "flying") {
                const progress = 1 - Math.exp(-t / 3);
                targetX = lerp(groundX, width * 0.5, progress);
                targetY = lerp(groundY, height * 0.4, progress);
                targetRotation = 45 * progress;
                targetCamera = MAX_CAMERA * (1 - Math.exp(-t / 8));
                targetSpeed = width * 0.35 * progress;
                targetWobble = 1;
                view.multiplier += (state.multiplier - view.multiplier) * smooth(12);
            } else if (state.phase === "crashed") {
                // Ракета улетает за край экрана
                targetX = width + rocketWidth * 2;
                targetY = -rocketHeight * 2;
                targetRotation = 50;
                targetCamera = view.camera;
                rate = 2;
                view.multiplier = state.multiplier;
            }

            view.x += (targetX - view.x) * smooth(rate);
            view.y += (targetY - view.y) * smooth(rate);
            view.rotation += (targetRotation - view.rotation) * smooth(rate);
            view.camera += (targetCamera - view.camera) * smooth(state.phase === "waiting" ? 1.5 : 3);
            view.speed += (targetSpeed - view.speed) * smooth(1.5);
            view.wobble += (targetWobble - view.wobble) * smooth(2);
            view.opacity += (1 - view.opacity) * smooth(4);
            view.scroll = (view.scroll + view.speed * dt) % backgroundWidth;

            // Плавная «вибрация» из нескольких синусоид вместо случайного шума
            const time = frame.time / 1000;
            const wobbleX = (Math.sin(time * 2.3) * 3 + Math.sin(time * 5.1) * 1.2) * view.wobble;
            const wobbleY = (Math.cos(time * 1.9) * 4 + Math.sin(time * 4.7) * 1.5) * view.wobble;
            const wobbleRotation = Math.sin(time * 1.6) * 2 * view.wobble;

            const backgroundY = lerp(height - backgroundHeight, 0, view.camera);
            background1Ref.current?.setAttrs({ x: -view.scroll, y: backgroundY });
            background2Ref.current?.setAttrs({ x: backgroundWidth - view.scroll, y: backgroundY });

            rocketRef.current?.setAttrs({
                x: view.x + wobbleX,
                y: view.y + wobbleY,
                rotation: view.rotation + wobbleRotation,
                opacity: view.opacity,
            });

            const multiplierText = state.phase === "waiting" ? `${state.waitTime}` : `${view.multiplier.toFixed(2)}x`;
            const statusText =
                state.phase === "waiting" ? "Раунд начнётся через" : state.phase === "crashed" ? "Ракета улетела!" : "";
            const fill = state.phase === "crashed" ? "#ff5c5c" : "white";

            const multiplierNode = multiplierRef.current;
            if (multiplierNode) {
                if (multiplierNode.text() !== multiplierText) multiplierNode.text(multiplierText);
                if (multiplierNode.fill() !== fill) multiplierNode.fill(fill);
            }
            const statusNode = statusRef.current;
            if (statusNode && statusNode.text() !== statusText) statusNode.text(statusText);
        }, [backgroundLayerRef.current, layerRef.current]);

        animation.start();
        return () => {
            animation.stop();
        };
    }, [scene, width, height, rocketWidth, rocketHeight, backgroundWidth, backgroundHeight, rocketImage, backgroundImage]);

    const fontSize = Math.max(24, Math.min(64, height * 0.12));

    return (
        <div ref={containerRef} className={className}>
            {width > 0 && height > 0 && (
                <Stage width={width} height={height} listening={false}>
                    <Layer ref={backgroundLayerRef} listening={false}>
                        {backgroundImage && (
                            <>
                                <KonvaImage ref={background1Ref} image={backgroundImage} width={backgroundWidth} height={backgroundHeight} />
                                <KonvaImage ref={background2Ref} image={backgroundImage} width={backgroundWidth} height={backgroundHeight} />
                            </>
                        )}
                    </Layer>
                    <Layer ref={layerRef} listening={false}>
                        {rocketImage && (
                            <KonvaImage
                                ref={rocketRef}
                                image={rocketImage}
                                width={rocketWidth}
                                height={rocketHeight}
                                offsetX={rocketWidth / 2}
                                offsetY={rocketHeight / 2}
                            />
                        )}
                        <Text
                            ref={statusRef}
                            width={width}
                            y={height * 0.3 - fontSize * 0.9}
                            align="center"
                            fontSize={fontSize * 0.4}
                            fontStyle="bold"
                            fill="white"
                            shadowColor="black"
                            shadowBlur={6}
                            shadowOpacity={0.6}
                        />
                        <Text
                            ref={multiplierRef}
                            width={width}
                            y={height * 0.3}
                            align="center"
                            fontSize={fontSize}
                            fontStyle="bold"
                            fill="white"
                            stroke="black"
                            strokeWidth={1}
                            shadowColor="black"
                            shadowBlur={8}
                            shadowOpacity={0.5}
                        />
                    </Layer>
                </Stage>
            )}
        </div>
    );
};

export default React.memo(RocketScene);
