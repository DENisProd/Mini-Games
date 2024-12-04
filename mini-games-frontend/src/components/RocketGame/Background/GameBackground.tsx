import { Layer, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import BackgroundImage from "../../../assets/background.png";

export interface Position {
    x: number;
    y: number;
}
export interface Size {
    width: number;
    height: number;
}

interface Props {
    backgroundPosition: Position;
    stageSize: Size;
}

const GameBackground: React.FC<Props> = ({ backgroundPosition, stageSize }) => {
    const [backgroundImage] = useImage(BackgroundImage);

    return (
        <Layer>
            {backgroundImage && (
                <>
                    <KonvaImage
                        image={backgroundImage}
                        x={(backgroundPosition.x % stageSize.width) - stageSize.width} // Горизонтальное смещение фона
                        y={(backgroundPosition.y % stageSize.height) - stageSize.height * 1.5} // Вертикальное смещение фона
                        width={stageSize.width * 3} // Увеличиваем ширину фона для плавного повторения
                        height={stageSize.height * 2.5} // Увеличиваем высоту фона для плавного повторения
                    />
                </>
            )}
        </Layer>
    );
};

export default GameBackground;
