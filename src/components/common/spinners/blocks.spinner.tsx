import { Blocks } from 'react-loader-spinner';

interface BlocksSpinnerProps {
  height?: string | number;
  width?: string | number;
  color?: string;
  ariaLabel?: string;
  visible?: boolean;
  wrapperClass?: string;
  wrapperStyle?: React.CSSProperties;
}

const BlocksSpinner: React.FC<BlocksSpinnerProps> = ({
  height = '40',
  width = '40',
  color = '#f97316',
  ariaLabel = 'blocks-loading',
  visible = true,
  wrapperClass = 'blocks-wrapper',
  wrapperStyle = {},
}) => {
  const combinedWrapperStyle: React.CSSProperties = {
    margin: '0 auto',
    color: '#f97316',
    ...wrapperStyle,
  };

  return (
    <Blocks
      height={height}
      width={width}
      color={color}
      ariaLabel={ariaLabel}
      wrapperStyle={combinedWrapperStyle}
      wrapperClass={wrapperClass}
      visible={visible}
    />
  );
};

export default BlocksSpinner;
