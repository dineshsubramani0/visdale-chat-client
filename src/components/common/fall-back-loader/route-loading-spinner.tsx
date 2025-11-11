import { RotatingLines } from 'react-loader-spinner';

interface RouteLoadingSpinnerProps {
  width?: string | number;
  top?: string | number;
}

const RouteLoadingSpinner: React.FC<RouteLoadingSpinnerProps> = ({
  width = 24,
  top = 16,
}) => {
  const widthStr = typeof width === 'number' ? `${width}px` : width;

  return (
    <div
      className={`absolute inset-0 z-50 flex items-center justify-center top-${top}`}>
      <RotatingLines width={widthStr} />
    </div>
  );
};

export default RouteLoadingSpinner;
