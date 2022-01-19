import { CurrentValue, Orientation, SliderType } from '../types/namespace';

interface ICorrectOptions {
  min: number,
  max: number,
  orientation: Orientation,
  type: SliderType,
  withRange: boolean,
  withThumb: boolean,
  withScale: boolean,
  currentValue: CurrentValue,
  step: number
}

export default ICorrectOptions;
