/**
 * @jest-environment jsdom
 */
import Options from '../../utils/interfaces/options';
import { UpdateValues } from '../../utils/types/namespace';
import defaultModelOptions from '../../utils/defaultOptions';
import Controller from '../Controller';

describe('Controller:', () => {
  const domParent = document.createElement('div');
  const controller = new Controller(domParent, defaultModelOptions);

  beforeEach(() => {
    controller.updateOptions(defaultModelOptions);
  });

  describe('options:', () => {
    test('должен вернуть опции слайдера', () => {
      expect(controller.options).toEqual(defaultModelOptions);
    });
  });

  describe('updateOptions:', () => {
    test('должен обновлять опции слайдера', () => {
      const newOptions: Partial<Options> = {
        step: 2,
        withScale: false,
      };

      controller.updateOptions(newOptions);

      expect(controller.options).toEqual({ ...defaultModelOptions, ...newOptions });
    });
  });

  describe('updateValues:', () => {
    test('должен обновлять текущее значение слайдера', () => {
      const newFrom: UpdateValues = { option: 'from', value: 57 };
      const newTo: UpdateValues = { option: 'to', value: 97 };

      controller.updateValues(newTo);
      controller.updateValues(newFrom);

      expect(controller.options.from).toEqual(newFrom.value);
      expect(controller.options.to).toEqual(newTo.value);
    });
  });
});
