/**
 * @jest-environment jsdom
 */
import IUserOptions from '../../utils/interfaces/IUserOptions';
import { TCurrentValue, TUpdateCurrentValue } from '../../utils/types/namespace';
import defaultModelOptions from '../../utils/defaultModelOptions';
import Controller from '../Controller';

describe('Controller:', () => {
  const domParent = document.createElement('div');
  const controller = new Controller(domParent, defaultModelOptions);

  beforeEach(() => {
    controller.updateOptions(defaultModelOptions);
  });

  describe('options:', () => {
    test('должен вернуть опции слайдера', () => {
      expect(controller.options).toStrictEqual(defaultModelOptions);
    });
  });

  describe('events:', () => {
    test('должен вернуть эвенты слайдера', () => {
      expect(controller.events.currentValueChanged).toBeTruthy();
      expect(controller.events.modelOptionsChanged).toBeTruthy();
      expect(controller.events.onSlide).toBeTruthy();
    });
  });

  describe('updateOptions:', () => {
    test('должен обновлять опции слайдера', () => {
      const newOptions: IUserOptions = {
        step: 2,
        withScale: false,
      };

      controller.updateOptions(newOptions);

      expect(controller.options).toStrictEqual({ ...defaultModelOptions, ...newOptions });
    });
  });

  describe('updateCurrentValue:', () => {
    test('должен обновлять текущее значение слайдера', () => {
      const newOptions: IUserOptions = { type: 'range' };
      const newFrom: TUpdateCurrentValue = { option: 'from', value: 57 };
      const newTo: TUpdateCurrentValue = { option: 'to', value: 97 };

      controller.updateOptions(newOptions);
      controller.updateCurrentValue(newTo);
      controller.updateCurrentValue(newFrom);
      const result: TCurrentValue = { from: newFrom.value, to: newTo.value };

      expect(controller.options.currentValue).toStrictEqual(result);
    });
  });
});
