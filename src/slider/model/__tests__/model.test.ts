import ICorrectOptions from '../../utils/interfaces/ICorrectOptions';
import { TUpdateCurrentValue } from '../../utils/types/namespace';
import Model from '../Model';
import defaultModelOptions from '../../utils/defaultModelOptions';

describe('Model:', () => {
  const options = defaultModelOptions;
  const model = new Model(options);

  beforeEach(() => {
    model.updateOptions(defaultModelOptions);
  });

  describe('updateModelOptions:', () => {
    test('должен обновить опции слайдера на входящие', () => {
      const newOptions: ICorrectOptions = {
        min: 10,
        max: 50,
        step: 2,
        orientation: 'vertical',
        type: 'from-end',
        currentValue: 10,
        withRange: false,
        withThumb: false,
        withScale: false,
      };

      model.updateOptions(newOptions);

      // @ts-ignore
      expect(model.options).toStrictEqual(newOptions);
    });
  });

  describe('updateCurrentValue', () => {
    test('должен обновить currentValue на корректное входящее значение', () => {
      const toggle: TUpdateCurrentValue = { option: 'from', value: 30 };

      model.updateCurrentValue(toggle);
      const UpdatedOptions = model.options;

      // @ts-ignore
      expect(UpdatedOptions.currentValue).toBe(30);
    });

    test('должен уведомить наблюдателей события currentValueChanged о обновленном значении toggle', () => {
      const subscriber = jest.fn();
      model.events.currentValueChanged.subscribe(subscriber);

      const toggle: TUpdateCurrentValue = { option: 'from', value: 70 };
      model.updateCurrentValue(toggle);

      // @ts-ignore
      expect(subscriber).toHaveBeenCalledWith(toggle);
    });
  });

  describe('getCorrectStep:', () => {
    test('должен преобразовать отрицательное значение на максимальный шаг', () => {
      const { step, min, max } = {
        step: -10,
        min: -999,
        max: -1,
      };
      const maxStep = max - min;

      // @ts-ignore
      expect(Model.getCorrectStep(step, min, max)).toEqual(maxStep);
    });

    test('должен преобразовать нуль-значение на максимальный шаг', () => {
      const { step, min, max } = {
        step: 0,
        min: 0,
        max: 0.1,
      };

      const maxStep = max - min;

      // @ts-ignore
      expect(Model.getCorrectStep(step, min, max)).toEqual(maxStep);
    });

    test('должен преобразовать значение в максимальный шаг, если оно больше максимального значения слайдера и неравно нулю', () => {
      const { step, min, max } = {
        step: 100.1,
        min: 0,
        max: 100,
      };

      const maxStep = max - min;

      // @ts-ignore
      expect(Model.getCorrectStep(step, min, max)).toEqual(maxStep);
    });

    test('должен вернуть входящее значение при отрицательном диапазоне слайдера', () => {
      const { step, min, max } = {
        step: 35,
        min: -356,
        max: 0,
      };

      // @ts-ignore
      expect(Model.getCorrectStep(step, min, max)).toEqual(step);
    });
  });

  describe('getCorrectDiapason:', () => {
    test('должен вернуть минимальное значение, если текущее значение меньше или равно минимальному слайдера', () => {
      const { value, min, max } = {
        value: -0.1,
        min: 0,
        max: 100,
      };

      // @ts-ignore
      expect(Model.getCorrectDiapason(value, min, max)).toEqual(min);
    });

    test('должен вернуть максимальное значение, если текущее значение больше или равно максимальному слайдера', () => {
      const { value, min, max } = {
        value: 100.1,
        min: 0,
        max: 100,
      };

      // @ts-ignore
      expect(Model.getCorrectDiapason(value, min, max)).toEqual(max);
    });

    test('должен вернуть текущее значение, если оно в диапазоне значений слайдера', () => {
      const { value, min, max } = {
        value: 50,
        min: 0,
        max: 100,
      };

      // @ts-ignore
      expect(Model.getCorrectDiapason(value, min, max)).toEqual(value);
    });
  });

  describe('getCorrectMinMax:', () => {
    test('должен прировнять минимальное значение к максимальному, если минимальное больше максимального', () => {
      const { min, max } = {
        min: 0,
        max: -1,
      };

      // @ts-ignore
      expect(Model.getCorrectMinMax(min, max)).toEqual({ min: max, max });
    });

    test('должен вернуть входящие значения, если минимальное меньше максимального', () => {
      const { min, max } = {
        min: 0,
        max: 100,
      };

      // @ts-ignore
      expect(Model.getCorrectMinMax(min, max)).toEqual({ min, max });
    });
  });

  describe('getCorrectCurrentValue:', () => {
    test('должен вернуть min по умолчанию', () => {
      const { min, currentValue } = { min: 0, currentValue: NaN };

      // @ts-ignore
      expect(model.getCorrectCurrentValue(currentValue)).toEqual(min);
    });

    test('должен вернуть входящее значение, если оно в диапазоне слайдера, при from-end или from-start положениях', () => {
      const { currentValue } = { currentValue: 89 };

      // @ts-ignore
      expect(model.getCorrectCurrentValue(currentValue)).toEqual(currentValue);
    });

    test('должен вернуть входящие значения, если они в диапазоне слайдера, при range положении', () => {
      const newOptions: ICorrectOptions = {
        ...defaultModelOptions,
        ...{ currentValue: { from: 10, to: 90 }, type: 'range' },
      };
      const { currentValue } = newOptions;

      model.updateOptions(newOptions);

      // @ts-ignore
      expect(model.getCorrectCurrentValue(currentValue)).toEqual(currentValue);
    });

    test('должен прировнять входящие значения, если минимальное больше максимального', () => {
      const newOptions: ICorrectOptions = {
        ...defaultModelOptions,
        ...{ currentValue: { from: 33, to: 10 }, type: 'range' },
      };

      model.updateOptions(newOptions);

      // @ts-ignore
      const value = model.getCorrectCurrentValue(newOptions.currentValue);

      expect(value).toEqual(newOptions.currentValue);
    });
  });
});
