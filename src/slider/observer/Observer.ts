import IObserver from './IObserver';

class Observer implements IObserver {
  private subscribers: any[];

  constructor () {
    this.subscribers = [];
  }

  public subscribe (cb: any) {
    this.subscribers.push(cb);
  }

  public unsubscribe (cb: any) {
    this.subscribers = this.subscribers.filter((sub) => sub !== cb);
  }

  public notify (data: any) {
    this.subscribers.forEach((subscriber) => subscriber(data));
  }
}

export default Observer;
