import { SliderType, CurrentValue, Orientation } from '../types/namespace';
import ICallbackAPI from './ICallbackAPI';

interface IUserOptions extends ICallbackAPI {
  min?: number,
  max?: number,
  orientation?: Orientation,
  type?: SliderType,
  withRange?: boolean,
  withThumb?: boolean,
  withScale?: boolean,
  currentValue?: CurrentValue,
  step?: number
}

export default IUserOptions;
