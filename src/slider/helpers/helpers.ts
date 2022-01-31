import { Direction } from '../utils/types/namespace';

interface IConvertValueToPercent {
  min: number;
  max: number;
  value: number;
  direction: Direction;
}

function convertValueToPercent ({ min, max, value, direction }: IConvertValueToPercent): number {
  const isRtlDirection = direction === 'rtl';
  const start = 0; // Start percent
  const percent = Number((((value - min) * 100) / (max - min)).toFixed(3));
  const revertedPercent = 100 - percent;
  const percentByType = isRtlDirection ? revertedPercent : percent;
  const percentIsNan = Number.isNaN(percentByType);

  if (percentIsNan) return start;
  return percentByType;
}

export default convertValueToPercent;
