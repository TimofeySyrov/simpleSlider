import IObserver from '../../../observer/IObserver';

interface IModelEvents {
  currentValueChanged: IObserver,
  modelOptionsChanged: IObserver
}

export default IModelEvents;
