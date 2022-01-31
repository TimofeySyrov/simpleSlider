import { IObserver, ISubscriber, ObserverData } from './IObserver';

class Observer implements IObserver {
  private subscribers: ISubscriber[];

  constructor () {
    this.subscribers = [];
  }

  public subscribe (event: string, cb: Function): void {
    this.subscribers.push({ event, cb });
  }

  public unsubscribe (event: string, cb: Function): void {
    this.subscribers = this.subscribers.filter((item) => {
      const current = item.cb === cb && item.event === event;

      if (!current) return true;
      return false;
    });
  }

  public notify (event: string, data: ObserverData): void {
    this.subscribers.forEach((subscriber) => {
      if (subscriber.event === event) {
        subscriber.cb(data);
      }
    });
  }
}

export default Observer;
