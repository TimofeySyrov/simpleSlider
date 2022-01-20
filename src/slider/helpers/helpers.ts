import { SliderType } from '../utils/types/namespace';

interface IConvertValueToPercent {
  min: number;
  max: number;
  value: number;
  type: SliderType;
}

function convertValueToPercent ({ min, max, value, type }: IConvertValueToPercent): number {
  const isFromEnd = type === 'from-end';
  const start = 0; // Start percent
  const percent = Number((((value - min) * 100) / (max - min)).toFixed(3));
  const revertedPercent = 100 - percent;
  const percentByType = isFromEnd ? revertedPercent : percent;
  const percentIsNan = Number.isNaN(percentByType);

  if (percentIsNan) return start;
  return percentByType;
}

export default convertValueToPercent;
