import Observer from './Observer';
import { ObserverData } from './IObserver';

describe('Observable:', () => {
  const observable = new Observer();
  const data: ObserverData = { option: 'from', value: 10 };

  test('должен добавить подписчика в наблюдатели и уведомить его о обновлении', () => {
    const subscriber = jest.fn();

    observable.subscribe(subscriber);
    observable.notify(data);

    expect(subscriber).toHaveBeenCalledWith(data);
  });

  test('должен удалить подписчика из наблюдателей', () => {
    const subscriber = jest.fn();

    observable.subscribe(subscriber);
    observable.unsubscribe(subscriber);
    observable.notify(data);

    expect(subscriber).not.toHaveBeenCalledWith();
  });
});
