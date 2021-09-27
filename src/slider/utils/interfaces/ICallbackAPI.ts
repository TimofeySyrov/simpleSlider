import { TUpdateCurrentValue } from '../types/namespace';

interface ICallbackAPI {
  onSlide?: (callback: TUpdateCurrentValue) => void;
}

export default ICallbackAPI;
