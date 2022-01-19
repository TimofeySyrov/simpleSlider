import { UpdateCurrentValue } from '../types/namespace';

interface ICallbackAPI {
  onSlide?: (callback: UpdateCurrentValue) => void;
}

export default ICallbackAPI;
