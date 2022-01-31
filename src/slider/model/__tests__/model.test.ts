import Options from '../../utils/interfaces/options';
import defaultOptions from '../../utils/defaultOptions';
import Model from '../Model';

describe('Model:', () => {
  const model = new Model(defaultOptions);

  beforeEach(() => {
    model.updateOptions(defaultOptions);
  });

  describe('updateOptions:', () => {
    test('должен обновить опции слайдера на входящие', () => {
      const newOptions: Options = {
        min: 10,
        max: 50,
        step: 2,
        from: 10,
        orientation: 'vertical',
        direction: 'rtl',
        withRange: false,
        withThumb: false,
        withScale: false,
      };

      model.updateOptions(newOptions);

      expect(model.options).toStrictEqual(newOptions);
    });

    test('должен оставить текущие опции при пустом переданном объекте', () => {
      model.updateOptions({});

      expect(model.options).toStrictEqual(defaultOptions);
    });

    test('должен вернуть min по умолчанию', () => {
      const newOptions: Options = {
        ...defaultOptions,
        ...{ min: 0, from: NaN },
      };
      const { min } = newOptions;

      model.updateOptions(newOptions);

      expect(model.options.from).toEqual(min);
    });

    test('должен вернуть входящее значение, если оно в диапазоне слайдера', () => {
      const newOptions: Options = {
        ...defaultOptions,
        ...{ from: 30, to: 70 },
      };
      const { from, to } = newOptions;

      model.updateOptions(newOptions);

      expect(model.options.from).toEqual(from);
      expect(model.options.to).toEqual(to);
    });

    test('должен прировнять входящие значения, если минимальное больше максимального', () => {
      const newOptions: Options = {
        ...defaultOptions,
        ...{ from: 33, to: 10 },
      };
      const { from, to } = newOptions;

      model.updateOptions(newOptions);

      expect(model.options.from).toEqual(to);
      expect(model.options.to).toEqual(from);
    });
  });

  describe('updateValues:', () => {
    test('должен оставить прежнее значение, если передано Nan', () => {
      const newOptions: Options = {
        min: 10,
        max: 50,
        step: 2,
        from: 10,
        to: 25,
        orientation: 'vertical',
        direction: 'rtl',
        withRange: false,
        withThumb: false,
        withScale: false,
      };

      model.updateOptions(newOptions);
      model.updateValues({ option: 'from', value: NaN });
      model.updateValues({ option: 'to', value: NaN });

      expect(model.options.from).toStrictEqual(newOptions.from);
      expect(model.options.to).toStrictEqual(newOptions.to);
    });

    test('должен корректно обновлять значения', () => {
      model.updateValues({ option: 'from', value: 25 });
      model.updateValues({ option: 'to', value: 1 });

      expect(model.options.from).toStrictEqual(25);
      expect(model.options.to).toStrictEqual(25);
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

  describe('getCorrectValueFromDiapason:', () => {
    test('должен вернуть минимальное значение, если текущее значение меньше или равно минимальному слайдера', () => {
      const { value, min, max } = {
        value: -0.1,
        min: 0,
        max: 100,
      };

      expect(Model.getCorrectValueFromDiapason(value, min, max)).toEqual(min);
    });

    test('должен вернуть максимальное значение, если текущее значение больше или равно максимальному слайдера', () => {
      const { value, min, max } = {
        value: 100.1,
        min: 0,
        max: 100,
      };

      expect(Model.getCorrectValueFromDiapason(value, min, max)).toEqual(max);
    });

    test('должен вернуть текущее значение, если оно в диапазоне значений слайдера', () => {
      const { value, min, max } = {
        value: 50,
        min: 0,
        max: 100,
      };

      expect(Model.getCorrectValueFromDiapason(value, min, max)).toEqual(value);
    });
  });

  describe('getCorrectDiapason:', () => {
    test('должен прировнять минимальное значение к максимальному, если минимальное больше максимального', () => {
      const newOptions: Options = {
        ...defaultOptions,
        ...{ min: 0, max: -1 },
      };
      const { max } = newOptions;

      model.updateOptions(newOptions);

      expect(model.options.min).toEqual(max);
      expect(model.options.max).toEqual(max);
    });

    test('должен вернуть входящие значения, если минимальное меньше максимального', () => {
      const newOptions: Options = {
        ...defaultOptions,
        ...{ min: -50, max: 50 },
      };
      const { min, max } = newOptions;

      model.updateOptions(newOptions);

      expect(model.options.min).toEqual(min);
      expect(model.options.max).toEqual(max);
    });
  });
});
