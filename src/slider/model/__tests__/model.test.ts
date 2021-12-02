import ICorrectOptions from '../../utils/interfaces/ICorrectOptions';
import { TUpdateCurrentValue } from '../../utils/types/namespace';
import defaultModelOptions from '../../utils/defaultModelOptions';
import Model from '../Model';

describe('Model:', () => {
  const model = new Model(defaultModelOptions);

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

      expect(model.options).toStrictEqual(newOptions);
    });
  });

  describe('updateCurrentValue', () => {
    test('должен корректно преобразовать входящее значение и обновить currentValue при range', () => {
      const newOptions: ICorrectOptions = {
        ...defaultModelOptions,
        ...{ type: 'range' },
      };
      const from: TUpdateCurrentValue = { option: 'from', value: 30 };
      const to: TUpdateCurrentValue = { option: 'to', value: 12 };

      model.updateOptions(newOptions);
      model.updateCurrentValue(from);
      model.updateCurrentValue(to);
      
      expect(model.options.currentValue).toEqual({ from: 30, to: 30 });
    });

    test('должен уведомить наблюдателей события currentValueChanged о обновленном значении toggle', () => {
      const sb = jest.fn();
      const newFromToggle: TUpdateCurrentValue = { option: 'from', value: 70 };

      model.events.currentValueChanged.subscribe(sb);
      model.updateCurrentValue(newFromToggle);

      expect(sb).toHaveBeenCalledWith(newFromToggle);
    });

    test('не должен уведомлять и менять значение модели, если входящее TUpdateCurrentValue равно NaN', () => {
      const sb = jest.fn();
      const newToToggle: TUpdateCurrentValue = { option: 'to', value: NaN };
      const newOptions: ICorrectOptions = {
        ...defaultModelOptions,
        ...{
          type: 'range',
          currentValue: { from: 33, to: 10 },
        },
      };

      model.updateOptions(newOptions);
      model.events.currentValueChanged.subscribe(sb);
      model.updateCurrentValue(newToToggle);

      expect(model.options.currentValue).toEqual(newOptions.currentValue);
      expect(sb).not.toHaveBeenCalled();
    });
  });

  describe('getCorrectStep:', () => {
    test('должен преобразовать отрицательное значение на максимальный шаг', () => {
      const { step, min, max } = {
        step: -10,
        min: -999,
        max: -1,
      };

      expect(Model.getCorrectStep(step, min, max)).toEqual(998);
    });

    test('должен преобразовать нуль-значение на максимальный шаг', () => {
      const { step, min, max } = {
        step: 0,
        min: 0,
        max: 0.1,
      };

      expect(Model.getCorrectStep(step, min, max)).toEqual(0.1);
    });

    test('должен преобразовать значение в максимальный шаг, если оно больше максимального значения слайдера и неравно нулю', () => {
      const { step, min, max } = {
        step: 100.1,
        min: 0,
        max: 100,
      };

      expect(Model.getCorrectStep(step, min, max)).toEqual(100);
    });

    test('должен вернуть входящее значение при отрицательном диапазоне слайдера', () => {
      const { step, min, max } = {
        step: 35,
        min: -356,
        max: 0,
      };

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

      expect(Model.getCorrectDiapason(value, min, max)).toEqual(min);
    });

    test('должен вернуть максимальное значение, если текущее значение больше или равно максимальному слайдера', () => {
      const { value, min, max } = {
        value: 100.1,
        min: 0,
        max: 100,
      };

      expect(Model.getCorrectDiapason(value, min, max)).toEqual(max);
    });

    test('должен вернуть текущее значение, если оно в диапазоне значений слайдера', () => {
      const { value, min, max } = {
        value: 50,
        min: 0,
        max: 100,
      };

      expect(Model.getCorrectDiapason(value, min, max)).toEqual(value);
    });
  });

  describe('getCorrectMinMax:', () => {
    test('должен прировнять минимальное значение к максимальному, если минимальное больше максимального', () => {
      const newOptions: ICorrectOptions = {
        ...defaultModelOptions,
        ...{ min: 0, max: -1 },
      };
      const { max } = newOptions;

      model.updateOptions(newOptions);

      expect(model.options.min).toEqual(max);
      expect(model.options.max).toEqual(max);
    });

    test('должен вернуть входящие значения, если минимальное меньше максимального', () => {
      const newOptions: ICorrectOptions = {
        ...defaultModelOptions,
        ...{ min: -50, max: 50 },
      };
      const { min, max } = newOptions;

      model.updateOptions(newOptions);

      expect(model.options.min).toEqual(min);
      expect(model.options.max).toEqual(max);
    });
  });

  describe('getCorrectCurrentValue:', () => {
    test('должен вернуть min по умолчанию', () => {
      const newOptions: ICorrectOptions = {
        ...defaultModelOptions,
        ...{ min: 0, currentValue: NaN },
      };
      const { min } = newOptions;

      model.updateOptions(newOptions);

      expect(model.options.currentValue).toEqual(min);
    });

    test('должен вернуть входящее значение, если оно в диапазоне слайдера, при from-end или from-start положениях', () => {
      const newOptions: ICorrectOptions = {
        ...defaultModelOptions,
        ...{ currentValue: 89 },
      };
      const { currentValue } = newOptions;

      model.updateOptions(newOptions);

      expect(model.options.currentValue).toEqual(currentValue);
    });

    test('должен вернуть входящие значения, если они в диапазоне слайдера, при range положении', () => {
      const newOptions: ICorrectOptions = {
        ...defaultModelOptions,
        ...{
          type: 'range',
          currentValue: { from: 10, to: 90 },
        },
      };
      const { currentValue } = newOptions;

      model.updateOptions(newOptions);

      expect(model.options.currentValue).toEqual(currentValue);
    });

    test('должен прировнять входящие значения, если минимальное больше максимального', () => {
      const newCurrentValue = { from: 33, to: 10 };
      const newOptions: ICorrectOptions = {
        ...defaultModelOptions,
        ...{
          type: 'range',
          currentValue: newCurrentValue,
        },
      };
      const { to } = newCurrentValue;

      model.updateOptions(newOptions);

      expect(model.options.currentValue).toEqual({ from: to, to });
    });

    test('должен прировнять диапазон, если входящее значение number при range типе', () => {
      const newCurrentValue = 87;
      const newOptions: ICorrectOptions = {
        ...defaultModelOptions,
        ...{
          type: 'range',
          currentValue: newCurrentValue,
        },
      };

      model.updateOptions(newOptions);

      expect(model.options.currentValue).toEqual({ from: newCurrentValue, to: newCurrentValue });
    });
  });
});
