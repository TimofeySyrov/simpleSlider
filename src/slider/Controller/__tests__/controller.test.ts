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

      controller.updateOptions({ type: 'double' });
      controller.updateValues(newTo);
      controller.updateValues(newFrom);

      expect(controller.options.from).toEqual(newFrom.value);
      expect(controller.options.to).toEqual(newTo.value);
    });
  });

  describe('getOptionsFromAttributes:', () => {
    test('должен инициализировать слайдер с опциями из атрибутов', () => {
      const newOptions: Options = {
        min: 10,
        max: 50,
        step: 2,
        from: 10,
        to: 22,
        type: 'double',
        orientation: 'vertical',
        direction: 'rtl',
        withRange: false,
        withThumb: false,
        withScale: false,
      };
      const newDomParent = document.createElement('div');

      newDomParent.setAttribute('data-min', `${newOptions.min}`);
      newDomParent.setAttribute('data-max', `${newOptions.max}`);
      newDomParent.setAttribute('data-step', `${newOptions.step}`);
      newDomParent.setAttribute('data-from', `${newOptions.from}`);
      newDomParent.setAttribute('data-to', `${newOptions.to}`);
      newDomParent.setAttribute('data-type', `${newOptions.type}`);
      newDomParent.setAttribute('data-orientation', `${newOptions.orientation}`);
      newDomParent.setAttribute('data-direction', `${newOptions.direction}`);
      newDomParent.setAttribute('data-with-range', `${newOptions.withRange}`);
      newDomParent.setAttribute('data-with-scale', `${newOptions.withScale}`);
      newDomParent.setAttribute('data-with-thumb', `${newOptions.withThumb}`);

      const newController = new Controller(newDomParent, defaultModelOptions);

      expect(newController.options).toEqual(newOptions);
    });
  });
});
