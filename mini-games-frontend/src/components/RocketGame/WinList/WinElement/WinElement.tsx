import Multiplier from "../../../../shared/Multiplier/Multiplier";

interface Props {
    text: string;
}

const WinElement: React.FC<Props> = ({ text }) => {
    const mul = parseFloat(text.replace(',', '.'));
    return <Multiplier mul={mul}/>;
};

export default WinElement;
