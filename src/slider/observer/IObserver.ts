import ICorrectOptions from '../utils/interfaces/ICorrectOptions';
import { UpdateCurrentValue } from '../utils/types/namespace';

type ObserverData = ICorrectOptions | UpdateCurrentValue;

interface ISubscriber {
  event: string,
  cb: Function,
}

interface IObserver {
  subscribe: (event: string, cb: Function) => void;
  unsubscribe: (event: string, cb: Function) => void;
  notify: (event: string, data: ObserverData) => void;
}

export { IObserver, ISubscriber, ObserverData };
