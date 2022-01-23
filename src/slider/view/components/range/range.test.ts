/**
 * @jest-environment jsdom
 */
import defaultModelOptions from '../../../utils/defaultModelOptions';
import ICorrectOptions from '../../../utils/interfaces/ICorrectOptions';
import sliderClassNames from '../../../utils/sliderClassNames';
import Range from './Range';
 
describe('Range:', () => {
  const range = new Range(defaultModelOptions);
 
  /* Фикс получения размеров DOM элемента */
  Object.defineProperties(window.HTMLElement.prototype, {
    offsetLeft: {
      get () { return parseFloat(window.getComputedStyle(this).marginLeft) || 0; },
    },
    offsetTop: {
      get () { return parseFloat(window.getComputedStyle(this).marginTop) || 0; },
    },
    offsetHeight: {
      get () { return parseFloat(window.getComputedStyle(this).height) || 0; },
    },
    offsetWidth: {
      get () { return parseFloat(window.getComputedStyle(this).width) || 0; },
    },
  });
 
  beforeEach(() => {
    range.updateState(defaultModelOptions);
  });
 
  describe('updateState:', () => {
    test('должен обновлять состояние диапазона', () => {
      const newOptions: ICorrectOptions = {
        ...defaultModelOptions,
        ...{ orientation: 'vertical' },
      };

      range.updateState(newOptions);

      expect(range.getDom().classList.contains(`${sliderClassNames.range.vertical}`)).toBeTruthy();
    });
  });
 
  describe('getDom:', () => {
    test('должен вернуть DOM диапазона', () => {
      expect(range.getDom()).toEqual(expect.any(HTMLDivElement));
    });
  });
 
  describe('setLength:', () => {
    test('должен задавать текущие значения диапазона', () => {
      const { from, to } = { from: 35, to: 75 };
      const newOptions: ICorrectOptions = {
        ...defaultModelOptions,
        ...{ orientation: 'vertical', type: 'range' },
      };

      range.updateState(newOptions);
      range.setLength(from, to);
 
      expect(parseFloat(range.getDom().style.bottom)).toEqual(from);
      expect(parseFloat(range.getDom().style.top)).toEqual(100 - to);
    });
  });
});
