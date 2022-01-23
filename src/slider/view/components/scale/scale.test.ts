/**
 * @jest-environment jsdom
 */
import defaultModelOptions from '../../../utils/defaultModelOptions';
import ICorrectOptions from '../../../utils/interfaces/ICorrectOptions';
import sliderClassNames from '../../../utils/sliderClassNames';
import Scale from './Scale';
  
describe('Scale:', () => {
  const scale = new Scale(defaultModelOptions);
  
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
    scale.updateState(defaultModelOptions);
  });
  
  describe('updateState:', () => {
    test('должен обновлять состояние шкалы', () => {
      const newOptions: ICorrectOptions = {
        ...defaultModelOptions,
        ...{ orientation: 'vertical' },
      };

      scale.updateState(newOptions);

      expect(scale.getDom().classList.contains(`${sliderClassNames.scale.vertical}`)).toBeTruthy();
    });
  });
  
  describe('getDom:', () => {
    test('должен вернуть DOM шкалы', () => {
      expect(scale.getDom()).toEqual(expect.any(HTMLUListElement));
    });
  });
  
  describe('getValues:', () => {
    test('должен вернуть значения шкалы', () => {
      expect(scale.getValues().length).toEqual(7);
    });
  });

  describe('addItem:', () => {
    test('должен добавить значение в шкалу', () => {
      scale.addItem(55.1);

      const items = Object.values(scale.getItems());
      const [itemDom] = items.filter((item) => item.getAttribute('data-value') === '55.1');

      expect(items.length).toEqual(8);
      expect(itemDom).toEqual(expect.any(HTMLLIElement));
    });
  });

  describe('getItems:', () => {
    test('должен вернуть DOMs значений шкалы', () => {
      scale.getItems().forEach((item) => {
        expect(item).toEqual(expect.any(HTMLLIElement));
      });
    });
  });
});
