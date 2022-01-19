import { IObserver, ObserverData } from './IObserver';

class Observer implements IObserver {
  private subscribers: Function[];

  constructor () {
    this.subscribers = [];
  }

  public subscribe (cb: Function): void {
    this.subscribers.push(cb);
  }

  public unsubscribe (cb: Function): void {
    this.subscribers = this.subscribers.filter((sub) => sub !== cb);
  }

  public notify (data: ObserverData): void {
    this.subscribers.forEach((subscriber) => subscriber(data));
  }
}

export default Observer;
