/**
 * @jest-environment jsdom
 */
import IUserOptions from '../../utils/interfaces/IUserOptions';
import ICorrectOptions from '../../utils/interfaces/ICorrectOptions';
import { TCurrentValue, TUpdateCurrentValue } from '../../utils/types/namespace';
import defaultModelOptions from '../../utils/defaultModelOptions';
import Controller from '../Controller';

describe('Controller:', () => {
  describe('options:', () => {
    test('должен вернуть опции слайдера', () => {
      const newOptions: ICorrectOptions = {
        min: -10,
        max: 0,
        currentValue: { from: -3, to: -7 },
        step: 0.1,
        type: 'range',
        orientation: 'vertical',
        withThumb: true,
        withRange: true,
        withScale: true,
      };

      const mockParent = document.createElement('div');
      const controller = new Controller(mockParent, newOptions);

      expect(controller.options).toStrictEqual(newOptions);
    });
  });

  describe('events:', () => {
    test('должен вернуть эвенты слайдера', () => {
      const mockParent = document.createElement('div');
      const controller = new Controller(mockParent, defaultModelOptions);

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

      const mockParent = document.createElement('div');
      const controller = new Controller(mockParent, defaultModelOptions);

      controller.updateOptions(newOptions);

      expect(controller.options).toStrictEqual({ ...defaultModelOptions, ...newOptions });
    });
  });

  describe('updateCurrentValue:', () => {
    test('должен обновлять текущее значение слайдера', () => {
      const newOptions: ICorrectOptions = { ...defaultModelOptions, ...{ type: 'range' } };

      const newFrom: TUpdateCurrentValue = {
        option: 'from',
        value: 57,
      };

      const newTo: TUpdateCurrentValue = {
        option: 'to',
        value: 97,
      };

      const mockParent = document.createElement('div');
      const controller = new Controller(mockParent, newOptions);

      // Так как в newOptions не указали to, то сначала обновляем его
      controller.updateCurrentValue(newTo);
      controller.updateCurrentValue(newFrom);

      const result: TCurrentValue = { from: 57, to: 97 };

      expect(controller.options.currentValue).toStrictEqual(result);
    });
  });
});
