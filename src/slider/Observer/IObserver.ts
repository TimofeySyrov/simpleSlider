import Options from '../utils/interfaces/options';
import { UpdateValues } from '../utils/types/namespace';

type ObserverData = Options | UpdateValues;

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
