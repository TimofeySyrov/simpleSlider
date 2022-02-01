/**
 * @jest-environment jsdom
 */
import defaultOptions from '../../../utils/defaultOptions';
import Options from '../../../utils/interfaces/options';
import sliderClassNames from '../../../utils/sliderClassNames';
import Range from './range';
 
describe('Range:', () => {
  const range = new Range(defaultOptions);
 
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
    range.updateState(defaultOptions);
  });
 
  describe('updateState:', () => {
    test('должен обновлять состояние диапазона', () => {
      const newOptions: Options = {
        ...defaultOptions,
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
    describe('при From:', () => {
      test('должен корректно задавать текущее значение диапазона при ltr положении', () => {
        const newOptions: Options = {
          ...defaultOptions,
          ...{
            orientation: 'horizontal',
            from: 35,
          },
        };
  
        range.updateState(newOptions);
        range.setLength(35, 0);
   
        expect(parseFloat(range.getDom().style.right)).toEqual(65);
        expect(parseFloat(range.getDom().style.left)).toEqual(0);
      });
      test('должен корректно задавать текущее значение диапазона при rtl положении', () => {
        const newOptions: Options = {
          ...defaultOptions,
          ...{
            direction: 'rtl',
            from: 35,
          },
        };
  
        range.updateState(newOptions);
        range.setLength(35, 0);
   
        expect(parseFloat(range.getDom().style.right)).toEqual(0);
        expect(parseFloat(range.getDom().style.left)).toEqual(35);
      });
    });
    describe('при From и To:', () => {
      test('должен корректно задавать текущее значение диапазона при ltr положении', () => {
        const newOptions: Options = {
          ...defaultOptions,
          ...{
            orientation: 'vertical',
            from: 35,
            to: 75,
            type: 'double',
          },
        };
  
        range.updateState(newOptions);
        range.setLength(35, 75);
   
        expect(parseFloat(range.getDom().style.bottom)).toEqual(35);
        expect(parseFloat(range.getDom().style.top)).toEqual(25);
      });
      test('должен корректно задавать текущее значение диапазона при rtl положении', () => {
        const newOptions: Options = {
          ...defaultOptions,
          ...{
            orientation: 'vertical',
            direction: 'rtl',
            from: 35,
            to: 75,
            type: 'double',
          },
        };
  
        range.updateState(newOptions);
        range.setLength(35, 75);
   
        expect(parseFloat(range.getDom().style.bottom)).toEqual(75);
        expect(parseFloat(range.getDom().style.top)).toEqual(65);
      });
    });
  });
});
