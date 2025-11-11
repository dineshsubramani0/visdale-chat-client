import { BallTriangle } from 'react-loader-spinner';

interface BallTriangleSpinnerProps {
  height?: string | number;
  width?: string | number;
  radius?: number;
  color?: string;
  ariaLabel?: string;
  visible?: boolean;
  wrapperClass?: string;
  wrapperStyle?: React.CSSProperties;
}

const BallTriangleSpinner: React.FC<BallTriangleSpinnerProps> = ({
  radius = 5,
  height = '40',
  width = '40',
  color = '#006E50',
  ariaLabel = 'balltriangle-loading',
  visible = true,
  wrapperClass = 'balltriangle-wrapper',
  wrapperStyle = {},
}) => {
  const combinedWrapperStyle: React.CSSProperties = {
    margin: '0 auto',
    color: '#006E50',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...wrapperStyle,
  };

  return (
    <BallTriangle
      height={height}
      width={width}
      color={color}
      radius={radius}
      ariaLabel={ariaLabel}
      wrapperStyle={combinedWrapperStyle}
      wrapperClass={wrapperClass}
      visible={visible}
    />
  );
};

export default BallTriangleSpinner;
