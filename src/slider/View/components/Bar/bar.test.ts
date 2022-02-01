/**
 * @jest-environment jsdom
 */
import Options from '../../../utils/interfaces/options';
import defaultOptions from '../../../utils/defaultOptions';
import sliderClassNames from '../../../utils/sliderClassNames';
import Bar from './bar';

describe('Bar:', () => {
  const bar = new Bar(defaultOptions);

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
    bar.updateState(defaultOptions);
  });

  describe('updateState:', () => {
    test('должен обновлять состояние бара', () => {
      const newOptions: Options = {
        ...defaultOptions,
        ...{ orientation: 'vertical' },
      };

      bar.updateState(newOptions);

      expect(bar.getDom().classList.contains(`${sliderClassNames.bar.vertical}`)).toBeTruthy();
    });
  });

  describe('getDom:', () => {
    test('должен вернуть DOM бара', () => {
      expect(bar.getDom()).toEqual(expect.any(HTMLDivElement));
    });
  });

  describe('getRelativeCoords:', () => {
    test('должен вернуть координаты относительно бара', () => {
      const mockEvent = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
      });

      expect(bar.getRelativeCoords(mockEvent)).toEqual(expect.any(Number));
    });
  });

  describe('getValueByCoords:', () => {
    test('должен вернуть значение по координатам относительно бара', () => {
      expect(bar.getValueByCoords(100)).toEqual(expect.any(Number));
    });
  });

  describe('getLength:', () => {
    test('должен вернуть длину бара', () => {
      const width = 175;

      bar.getDom().setAttribute('style', `width: ${width}px; height: 50px;`);
      
      expect(bar.getLength()).toEqual(width);
    });
  });

  describe('getOffset:', () => {
    test('должен вернуть отступ бара', () => {
      expect(bar.getOffset()).toEqual(expect.any(Number));
    });
  });
});
