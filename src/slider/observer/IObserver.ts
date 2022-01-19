import ICorrectOptions from '../utils/interfaces/ICorrectOptions';
import { UpdateCurrentValue } from '../utils/types/namespace';

type ObserverData = ICorrectOptions | UpdateCurrentValue;

interface IObserver {
  subscribe: (cb: Function) => void;
  unsubscribe: (cb: Function) => void;
  notify: (data: ObserverData) => void;
}

export { IObserver, ObserverData };
