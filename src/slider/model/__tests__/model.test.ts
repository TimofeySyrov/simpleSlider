import IModelOptions from '../../interfaces/IModelOptions';
import { TUpdateToggle } from '../../interfaces/namespace';
import Model from '../Model';
import defaultModelOptions from '../utils/defaultModelOptions';

describe('Model:', () => {

  const options = defaultModelOptions;
  const model = new Model(options);

  describe('updateModelOptions:', () => {

    test('должен обновить опции слайдера на входящие', () => {
      const newOptions: IModelOptions = {
        min: 10,
        max: 50,
        step: 2,
        orientation: 'vertical',
        type: 'from-end',
        currentValue: 10,
        withRange: false,
        withThumb: false,
        withScale: false
      }

      model.updateModelOptions(newOptions);
  
      //@ts-ignore
      expect(model.options).toBe(newOptions);
    });
  });

  describe('updateCurrentValueOption:', () => {

    test('должен обновить currentValue на корректное входящее значение', () => {
      const toggle: TUpdateToggle = { handle: 'from', value: 30 };

      model.updateCurrentValueOption(toggle);
      const UpdatedOptions = model.options;
  
      //@ts-ignore
      expect(UpdatedOptions.currentValue).toBe(30);
    });

    test('должен уведомить наблюдателей события currentValueChanged о обновленном значении toggle', () => {
      const subscriber = jest.fn();
      model.events.currentValueChanged.subscribe(subscriber);

      const toggle: TUpdateToggle = { handle: 'from', value: 70 };
      model.updateCurrentValueOption(toggle);
  
      //@ts-ignore
      expect(subscriber).toHaveBeenCalledWith(toggle);
    });
  });

  describe('getCorrectStep:', () => {

    test('должен преобразовать отрицательное значение на максимальный шаг', () => {
      const { step, min, max } = {
        step: -10,
        min: -999,
        max: -1
      };
      const maxStep = max - min;
  
      //@ts-ignore
      expect(model.getCorrectStep(step, min, max)).toEqual(maxStep);
    });

    test('должен преобразовать нуль-значение на максимальный шаг', () => {
      const { step, min, max } = {
        step: 0,
        min: 0,
        max: 0.1
      };

      const maxStep = max - min;
  
      //@ts-ignore
      expect(model.getCorrectStep(step, min, max)).toEqual(maxStep);
    });

    test('должен преобразовать значение в максимальный шаг, если оно больше максимального значения слайдера и неравно нулю', () => {
      const { step, min, max } = {
        step: 100.1,
        min: -1,
        max: 100
      };

      const maxStep = max - min;
  
      //@ts-ignore
      expect(model.getCorrectStep(step, min, max)).toEqual(maxStep);
    });

    test('должен вернуть входящее значение при отрицательном диапазоне слайдера', () => {
      const { step, min, max } = {
        step: 35,
        min: -356,
        max: 0
      };
  
      //@ts-ignore
      expect(model.getCorrectStep(step, min, max)).toEqual(step);
    });
  });

  describe('getCorrectDiapason:', () => {

    test('должен вернуть минимальное значение, если текущее значение меньше или равно минимальному слайдера', () => {
      const { value, min, max } = {
        value: -0.1,
        min: 0,
        max: 100
      };
  
      //@ts-ignore
      expect(model.getCorrectDiapason(value, min, max)).toEqual(min);
    });

    test('должен вернуть максимальное значение, если текущее значение больше или равно максимальному слайдера', () => {
      const { value, min, max } = {
        value: 100.1,
        min: 0,
        max: 100
      };
  
      //@ts-ignore
      expect(model.getCorrectDiapason(value, min, max)).toEqual(max);
    });

    test('должен вернуть текущее значение, если оно в диапазоне значений слайдера', () => {
      const { value, min, max } = {
        value: 50,
        min: 0,
        max: 100
      };
  
      //@ts-ignore
      expect(model.getCorrectDiapason(value, min, max)).toEqual(value);
    });
  });

  describe('getValueWithStep:', () => {

    test('должен вернуть корректное значение с шагом', () => {
      const { value, min, step } = {
        value: 50,
        min: 25,
        step: 4
      };
  
      //@ts-ignore
      expect(model.getValueWithStep(value, min, step)).toEqual(49);
    });
  });

  describe('getCorrectMinMax:', () => {

    test('должен прировнять минимальное значение к максимальному, если минимальное больше максимального', () => {
      const { min, max } = {
        min: 0,
        max: -1
      };
  
      //@ts-ignore
      expect(model.getCorrectMinMax(min, max)).toEqual({ min: max, max: max });
    });

    test('должен вернуть входящие значения, если минимальное меньше максимального', () => {
      const { min, max } = {
        min: 0,
        max: 100
      };
  
      //@ts-ignore
      expect(model.getCorrectMinMax(min, max)).toEqual({ min: min, max: max });
    });
  });

  describe('getCorrectCurrentValue:', () => {

    test('должен вернуть середину диапазона по умолчанию', () => {
      const { min, max, currentValue, type } = {
        min: 0,
        max: 100,
        currentValue: '10',
        type: 'from-start'
      };

      const middleDiapason = (max - min) / 2;
  
      //@ts-ignore
      expect(model.getCorrectCurrentValue(currentValue, type, min, max)).toEqual(middleDiapason);
    });

    test('должен вернуть входящее значение, если оно в диапазоне слайдера, при from-end или from-start положениях', () => {
      const { min, max, currentValue, type } = {
        min: 0,
        max: 100,
        currentValue: 89,
        type: 'from-start'
      };
  
      //@ts-ignore
      expect(model.getCorrectCurrentValue(currentValue, type, min, max)).toEqual(currentValue);
    });

    test('должен вернуть входящие значения, если они в диапазоне слайдера, при range положении', () => {
      const { min, max, currentValue, type } = {
        min: 0,
        max: 100,
        currentValue: { min: 10, max: 90 },
        type: 'range'
      };
  
      //@ts-ignore
      expect(model.getCorrectCurrentValue(currentValue, type, min, max)).toEqual(currentValue);
    });

    test('должен прировнять входящие значения, если минимальное больше максимального', () => {
      const { min, max, currentValue, type } = {
        min: 0,
        max: 100,
        currentValue: { min: 33, max: 10 },
        type: 'range'
      };
  
      //@ts-ignore
      expect(model.getCorrectCurrentValue(currentValue, type, min, max)).toEqual({ min: currentValue.max, max: currentValue.max });
    });
  });

});