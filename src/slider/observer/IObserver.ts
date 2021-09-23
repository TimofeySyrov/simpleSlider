interface IObserver {
  subscribe: Function;
  unsubscribe: Function;
  notify: Function;
}

export default IObserver;
