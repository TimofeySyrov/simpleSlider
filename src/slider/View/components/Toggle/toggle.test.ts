/**
 * @jest-environment jsdom
 */
import Options from '../../../utils/interfaces/options';
import defaultOptions from '../../../utils/defaultOptions';
import sliderClassNames from '../../../utils/sliderClassNames';
import Toggle from './Toggle';
    
describe('Toggle:', () => {
  const toggle = new Toggle(defaultOptions);
    
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
    toggle.updateState(defaultOptions);
  });
    
  describe('updateState:', () => {
    test('должен обновлять состояние ползунка', () => {
      const newOptions: Options = {
        ...defaultOptions,
        ...{ orientation: 'vertical' },
      };
  
      toggle.updateState(newOptions);
  
      expect(toggle.getDom().classList.contains(`${sliderClassNames.toggle.vertical}`)).toBeTruthy();
    });
  });
    
  describe('getDom:', () => {
    test('должен вернуть DOM ползунка', () => {
      expect(toggle.getDom()).toEqual(expect.any(HTMLDivElement));
    });
  });
    
  describe('getCoords:', () => {
    test('должен вернуть расположение ползунка относительно заданной величины', () => {
      expect(toggle.getCoords(100)).toEqual(expect.any(Number));
    });
  });

  describe('setValue:', () => {
    test('должен задавать значение ползунка', () => {
      toggle.setValue(69);

      expect(toggle.getDom().style.left).toEqual('69%');
    });
  });

  describe('setActive:', () => {
    test('должен задавать активное состояние ползунка', () => {
      toggle.setActive();

      const isActive = toggle.getDom().classList.contains(`${sliderClassNames.toggle.active}`);

      expect(isActive).toBeTruthy();
    });
  });

  describe('removeActive:', () => {
    test('должен отключать активное состояние ползунка', () => {
      toggle.removeActive();

      const isActive = toggle.getDom().classList.contains(`${sliderClassNames.toggle.active}`);

      expect(isActive).toBeFalsy();
    });
  });
});
