import Observer from './Observer';

describe('Observable:', () => {
  const observable = new Observer();
  const data = { text: 'some data' };

  test('should add subscriber to observers and send them data', () => {
    const subscriber = jest.fn();

    observable.subscribe(subscriber);
    observable.notify(data);

    expect(subscriber).toHaveBeenCalledWith(data);
  });

  test('should delete subscriber from observers', () => {
    const subscriber = jest.fn();

    observable.subscribe(subscriber);
    observable.unsubscribe(subscriber);
    observable.notify(data);

    expect(subscriber).not.toHaveBeenCalledWith();
  });
});
