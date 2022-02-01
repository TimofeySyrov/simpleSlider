import defaultOptions from '../utils/defaultOptions';
import Observer from './Observer';
import { ObserverData } from './IObserver';

describe('Observable:', () => {
  const observable = new Observer();
  const data: ObserverData = { option: 'from', value: 10 };

  test('должен добавить подписчика в наблюдатели и уведомить его о обновлении', () => {
    const subscriber = jest.fn();

    observable.subscribe('testEventName', subscriber);
    observable.notify('testEventName', data);

    expect(subscriber).toHaveBeenCalledWith(data);
  });

  test('должен удалить подписчика из наблюдателей', () => {
    const subscriber = jest.fn();

    observable.subscribe('anotherEvent', subscriber);
    observable.unsubscribe('anotherEvent', subscriber);
    observable.notify('anotherEvent', data);

    expect(subscriber).not.toHaveBeenCalledWith();
  });

  test('должен уведомить конкретных подписчиков эвента', () => {
    const subscriber = jest.fn();
    const subscriber2 = jest.fn();
    const firstEvent = 'eventForSub1';
    const secondEvent = 'eventForSub2';
    const firstData: ObserverData = defaultOptions;

    observable.subscribe(firstEvent, subscriber);
    observable.subscribe(secondEvent, subscriber2);
    observable.notify(firstEvent, firstData);
    observable.notify(secondEvent, data);

    expect(subscriber).toHaveBeenCalledWith(firstData);
    expect(subscriber2).toHaveBeenCalledWith(data);
  });
});
