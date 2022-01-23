/**
 * @jest-environment jsdom
 */
import defaultModelOptions from '../../../utils/defaultModelOptions';
import ICorrectOptions from '../../../utils/interfaces/ICorrectOptions';
import sliderClassNames from '../../../utils/sliderClassNames';
import Thumb from './Thumb';
   
describe('Thumb:', () => {
  const thumb = new Thumb(defaultModelOptions);
   
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
    thumb.updateState(defaultModelOptions);
  });
   
  describe('updateState:', () => {
    test('должен обновлять состояние подсказки', () => {
      const newOptions: ICorrectOptions = {
        ...defaultModelOptions,
        ...{ orientation: 'vertical' },
      };
 
      thumb.updateState(newOptions);
 
      expect(thumb.getDom().classList.contains(`${sliderClassNames.thumb.vertical}`)).toBeTruthy();
    });
  });
   
  describe('getDom:', () => {
    test('должен вернуть DOM подсказки', () => {
      expect(thumb.getDom()).toEqual(expect.any(HTMLDivElement));
    });
  });
   
  describe('setValue:', () => {
    test('должен задавать значение подсказки', () => {
      thumb.setValue(812);

      expect(thumb.getDom().textContent).toEqual('812');
    });
  });
});
