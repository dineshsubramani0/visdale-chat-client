import { RotatingLines } from 'react-loader-spinner';

interface RotatingLinesSpinnerProps {
  height?: string;
  width?: string;
  radius?: number;
  strokeColor?: string;
  ariaLabel?: string;
  visible?: boolean;
  wrapperClass?: string;
  wrapperStyle?: React.CSSProperties;
  animationDuration: string;
}

const RotatingLinesSpinner: React.FC<RotatingLinesSpinnerProps> = ({
  width = '30',
  strokeColor = '#fff',
  ariaLabel = 'rotatinglines-loading',
  visible = true,
  animationDuration = '0.75',
}) => {
  return (
    <RotatingLines
      strokeWidth={width}
      width={width}
      strokeColor={strokeColor}
      animationDuration={animationDuration}
      ariaLabel={ariaLabel}
      visible={visible}
    />
  );
};

export default RotatingLinesSpinner;
