import IObserver from "../../observer/IObserver";

interface IEvents {
  currentValueChanged?: IObserver,
  modelOptionsChanged?: IObserver
}

export default IEvents;