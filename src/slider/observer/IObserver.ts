interface IObserver {
  subscribe: Function;
  unsubscribe: Function;
  publish: Function;
}

export default IObserver;