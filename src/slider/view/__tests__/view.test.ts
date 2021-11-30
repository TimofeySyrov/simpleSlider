/**
 * @jest-environment jsdom
 */
import $ from 'jquery';

import ICorrectOptions from '../../utils/interfaces/ICorrectOptions';
import { TUpdateCurrentValue } from '../../utils/types/namespace';
import defaultModelOptions from '../../utils/defaultModelOptions';
import sliderClassNames from '../../utils/sliderClassNames';
import View from '../View';

describe('View:', () => {
  describe('updateOptions:', () => {
    test('должен обновлять опции', () => {
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
      const domParent = document.createElement('div');
      const view = new View(domParent, defaultModelOptions);

      view.updateOptions(newOptions);

      expect(view.options).toStrictEqual(newOptions);
    });
  });

  describe('updateCurrentValue:', () => {
    test('должен обновлять значения позлунков слайдера', () => {
      const newOptions: ICorrectOptions = {
        min: 0,
        max: 100,
        step: 1,
        orientation: 'horizontal',
        type: 'range',
        currentValue: { from: 25, to: 50 },
        withRange: true,
        withThumb: true,
        withScale: true,
      };

      const mockParent = document.createElement('div');
      const newToValue: TUpdateCurrentValue = { option: 'to', value: 76 };
      const newFromValue: TUpdateCurrentValue = { option: 'from', value: 1 };
      const view = new View(mockParent, newOptions);

      view.updateCurrentValue(newToValue);
      view.updateCurrentValue(newFromValue);

      const toToggleBox = mockParent.querySelector('[data-index="1"]') as HTMLElement;
      const fromToggleBox = mockParent.querySelector('[data-index="0"]') as HTMLElement;
      const toThumbBox = toToggleBox.querySelector(`.${sliderClassNames.thumb.main}`) as HTMLElement;
      const fromThumbBox = fromToggleBox.querySelector(`.${sliderClassNames.thumb.main}`) as HTMLElement;

      expect(toThumbBox.innerHTML).toBe(`${newToValue.value}`);
      expect(fromThumbBox.innerHTML).toBe(`${newFromValue.value}`);
    });
  });

  describe('initSubView, render:', () => {
    test('должны корректно создавать DOM слайдера', () => {
      const newOptions: ICorrectOptions = {
        min: 0,
        max: 100,
        step: 1,
        orientation: 'vertical',
        type: 'range',
        currentValue: { from: 25, to: 50 },
        withRange: true,
        withThumb: true,
        withScale: true,
      };

      const mockParent = document.createElement('div');
      const view = new View(mockParent, newOptions);

      expect(mockParent.querySelector(`.${sliderClassNames.slider.main}`)).toBeInstanceOf(HTMLElement);
      expect(mockParent.querySelector(`.${sliderClassNames.bar.main}`)).toBeInstanceOf(HTMLElement);
      expect(mockParent.querySelector(`.${sliderClassNames.range.main}`)).toBeInstanceOf(HTMLElement);
      expect(mockParent.querySelectorAll(`.${sliderClassNames.toggle.main}`)[0]).toBeInstanceOf(HTMLElement);
      expect(mockParent.querySelectorAll(`.${sliderClassNames.toggle.main}`)[1]).toBeInstanceOf(HTMLElement);
      expect(mockParent.querySelectorAll(`.${sliderClassNames.thumb.main}`)[0]).toBeInstanceOf(HTMLElement);
      expect(mockParent.querySelectorAll(`.${sliderClassNames.thumb.main}`)[1]).toBeInstanceOf(HTMLElement);
      expect(mockParent.querySelector(`.${sliderClassNames.scale.main}`)).toBeInstanceOf(HTMLElement);
    });
  });

  describe('render:', () => {
    test('должен добавлять отсутствующие dom-элементы subView', () => {
      const newOptions: ICorrectOptions = {
        min: 0,
        max: 100,
        step: 1,
        orientation: 'vertical',
        type: 'range',
        currentValue: { from: 25, to: 50 },
        withRange: false,
        withThumb: false,
        withScale: false,
      };

      const mockParent = document.createElement('div');
      const view = new View(mockParent, newOptions);

      const fromToggle: ChildNode = mockParent.querySelectorAll(`.${sliderClassNames.toggle.main}`)[0];
      fromToggle.remove();

      view.updateOptions({
        ...newOptions,
        ...{ withRange: true, withScale: true, withThumb: true },
      });

      expect(mockParent.querySelector(`.${sliderClassNames.range.main}`)).toBeInstanceOf(HTMLElement);
      expect(mockParent.querySelectorAll(`.${sliderClassNames.toggle.main}`)[0]).toBeInstanceOf(HTMLElement);
      expect(mockParent.querySelectorAll(`.${sliderClassNames.thumb.main}`)[0]).toBeInstanceOf(HTMLElement);
      expect(mockParent.querySelectorAll(`.${sliderClassNames.thumb.main}`)[1]).toBeInstanceOf(HTMLElement);
      expect(mockParent.querySelector(`.${sliderClassNames.scale.main}`)).toBeInstanceOf(HTMLElement);
    });
    test('должен удалять лишние dom-элементы subView', () => {
      const newOptions: ICorrectOptions = {
        ...defaultModelOptions,
        ...{ withThumb: false, withRange: false, withScale: false },
      };

      const mockParent = document.createElement('div');
      const view = new View(mockParent, { ...defaultModelOptions, ...{ type: 'range' } });

      view.updateOptions(newOptions);

      expect(mockParent.querySelector(`.${sliderClassNames.range.main}`)).toBeUndefined;
      expect(mockParent.querySelectorAll(`.${sliderClassNames.toggle.main}`)[1]).toBeUndefined;
      expect(mockParent.querySelectorAll(`.${sliderClassNames.thumb.main}`)[0]).toBeUndefined;
      expect(mockParent.querySelectorAll(`.${sliderClassNames.thumb.main}`)[1]).toBeUndefined;
      expect(mockParent.querySelector(`.${sliderClassNames.scale.main}`)).toBeUndefined;
    });
  });

  describe('renderSubViewStyles:', () => {
    test('должен корректно задавать классы и дата-атрибуты для subView', () => {
      const newOptions: ICorrectOptions = {
        min: 0,
        max: 100,
        step: 1,
        orientation: 'vertical',
        type: 'range',
        currentValue: { from: 25, to: 50 },
        withRange: true,
        withThumb: true,
        withScale: true,
      };

      const mockParent = document.createElement('div');
      const view = new View(mockParent, newOptions);
      const slider = mockParent.querySelector(`.${sliderClassNames.slider.main}`) as HTMLElement;
      const bar = mockParent.querySelector(`.${sliderClassNames.bar.main}`) as HTMLElement;
      const range = mockParent.querySelector(`.${sliderClassNames.range.main}`) as HTMLElement;
      const toggles = mockParent.querySelectorAll(`.${sliderClassNames.toggle.main}`) as NodeListOf<HTMLElement>;
      const thumbs = mockParent.querySelectorAll(`.${sliderClassNames.thumb.main}`) as NodeListOf<HTMLElement>;
      const scale = mockParent.querySelector(`.${sliderClassNames.scale.main}`) as HTMLElement;
      const scaleItems = mockParent.querySelectorAll(`.${sliderClassNames.scaleItem.main}`) as NodeListOf<HTMLElement>;

      expect(slider.classList.contains(`${sliderClassNames.slider[newOptions.orientation]}`)).toBeTruthy();
      expect(bar.classList.contains(`${sliderClassNames.bar[newOptions.orientation]}`)).toBeTruthy();
      expect(range.classList.contains(`${sliderClassNames.range[newOptions.orientation]}`)).toBeTruthy();

      /* From toggle */
      expect(toggles[0].classList.contains(`${sliderClassNames.toggle[newOptions.orientation]}`)).toBeTruthy();
      expect(toggles[0].getAttribute('data-index')).toEqual('0');
      expect(thumbs[0].classList.contains(`${sliderClassNames.thumb[newOptions.orientation]}`)).toBeTruthy();

      /* To toggle */
      expect(toggles[1].classList.contains(`${sliderClassNames.toggle[newOptions.orientation]}`)).toBeTruthy();
      expect(toggles[1].getAttribute('data-index')).toEqual('1');
      expect(thumbs[1].classList.contains(`${sliderClassNames.thumb[newOptions.orientation]}`)).toBeTruthy();

      /* Scale */
      expect(scale.classList.contains(`${sliderClassNames.scale[newOptions.orientation]}`)).toBeTruthy();
      scaleItems.forEach((item) => {
        expect(item.classList.contains(`${sliderClassNames.scaleItem[newOptions.orientation]}`)).toBeTruthy();
      });
    });
  });

  describe('handleBarClick', () => {
    test('должны уведомлять при click на шкалу и бар слайдера', () => {
      const newOptions: ICorrectOptions = {
        min: 0,
        max: 100,
        step: 1,
        orientation: 'vertical',
        type: 'range',
        currentValue: { from: 25, to: 50 },
        withRange: true,
        withThumb: true,
        withScale: true,
      };

      const mockParent = document.createElement('div');
      const view = new View(mockParent, newOptions);

      const sb = jest.fn();
      view.events.onSlide.subscribe(sb);

      const scaleItem = mockParent.querySelector(`.${sliderClassNames.scaleItem.main}`) as HTMLElement;
      const bar = mockParent.querySelector(`.${sliderClassNames.bar.main}`) as HTMLElement;

      $(scaleItem).trigger('click');
      $(bar).trigger('click');

      expect(sb).toBeCalledTimes(2);
    });
  });

  describe('handleBarMouseDown', () => {
    test('должен уведомлять при mousedown на бар слайдера', () => {
      const newOptions: ICorrectOptions = {
        min: 0,
        max: 100,
        step: 1,
        orientation: 'horizontal',
        type: 'from-start',
        currentValue: 50,
        withRange: true,
        withThumb: true,
        withScale: true,
      };

      const mockParent = document.createElement('div');
      const view = new View(mockParent, newOptions);

      const sb = jest.fn();
      view.events.onSlide.subscribe(sb);
      const bar = mockParent.querySelector(`.${sliderClassNames.bar.main}`) as HTMLElement;

      bar.dispatchEvent(new Event('mousedown'));

      expect(sb).toBeCalledTimes(1);
    });
  });

  describe('setRangePosition:', () => {
    describe('должен корректно задавать стили для DOM range элеменета слайдера:', () => {
      describe('при vertical положении:', () => {
        test('при from-start типе', () => {
          const newOptions: ICorrectOptions = {
            min: 0,
            max: 100,
            step: 1,
            orientation: 'vertical',
            type: 'from-start',
            currentValue: 99.9,
            withRange: true,
            withThumb: true,
            withScale: true,
          };
    
          const mockParent = document.createElement('div');
          const view = new View(mockParent, newOptions);
          const barBox = mockParent.querySelector(`.${sliderClassNames.range.main}`) as HTMLDivElement;
          const rangeTopNum = Number((parseFloat(barBox.style.top).toFixed(1)));
          const rangeBottomNum = parseFloat(barBox.style.bottom);
    
          expect(rangeTopNum).toEqual(0.1);
          expect(rangeBottomNum).toEqual(0);
        });
        test('при from-end типе', () => {
          const newOptions: ICorrectOptions = {
            min: 0,
            max: 100,
            step: 1,
            orientation: 'vertical',
            type: 'from-end',
            currentValue: 0,
            withRange: true,
            withThumb: true,
            withScale: true,
          };
    
          const mockParent = document.createElement('div');
          const view = new View(mockParent, newOptions);
          const barBox = mockParent.querySelector(`.${sliderClassNames.range.main}`) as HTMLDivElement;
          const rangeTopNum = parseFloat(barBox.style.top);
          const rangeBottomNum = parseFloat(barBox.style.bottom);
    
          expect(rangeTopNum).toEqual(0);
          expect(rangeBottomNum).toEqual(100);
        });
        test('при range типе', () => {
          const newOptions: ICorrectOptions = {
            min: 0,
            max: 100,
            step: 1,
            orientation: 'vertical',
            type: 'range',
            currentValue: { from: 25, to: 68 },
            withRange: true,
            withThumb: true,
            withScale: true,
          };
    
          const mockParent = document.createElement('div');
          const view = new View(mockParent, newOptions);
          const barBox = mockParent.querySelector(`.${sliderClassNames.range.main}`) as HTMLDivElement;
          const rangeTopNum = parseFloat(barBox.style.top);
          const rangeBottomNum = parseFloat(barBox.style.bottom);
    
          expect(rangeTopNum).toEqual(32);
          expect(rangeBottomNum).toEqual(25);
        });
      });
      describe('при horizontal положении:', () => {
        test('при from-start типе', () => {
          const newOptions: ICorrectOptions = {
            min: 0,
            max: 100,
            step: 1,
            orientation: 'horizontal',
            type: 'from-start',
            currentValue: 43,
            withRange: true,
            withThumb: true,
            withScale: true,
          };
    
          const mockParent = document.createElement('div');
          const view = new View(mockParent, newOptions);
          const barBox = mockParent.querySelector(`.${sliderClassNames.range.main}`) as HTMLDivElement;
          const rangeLeftNum = parseFloat(barBox.style.left);
          const rangeRightNum = parseFloat(barBox.style.right);
    
          expect(rangeLeftNum).toEqual(0);
          expect(rangeRightNum).toEqual(57);
        });
        test('при from-end типе', () => {
          const newOptions: ICorrectOptions = {
            min: 0,
            max: 100,
            step: 1,
            orientation: 'horizontal',
            type: 'from-end',
            currentValue: 27.4,
            withRange: true,
            withThumb: true,
            withScale: true,
          };
    
          const mockParent = document.createElement('div');
          const view = new View(mockParent, newOptions);
          const barBox = mockParent.querySelector(`.${sliderClassNames.range.main}`) as HTMLDivElement;
          const rangeLeftNum = Number((parseFloat(barBox.style.left).toFixed(1)));
          const rangeRightNum = parseFloat(barBox.style.right);
    
          expect(rangeLeftNum).toEqual(72.6);
          expect(rangeRightNum).toEqual(0);
        });
        test('при range типе', () => {
          const newOptions: ICorrectOptions = {
            min: 0,
            max: 100,
            step: 1,
            orientation: 'horizontal',
            type: 'range',
            currentValue: { from: 50, to: 50 },
            withRange: true,
            withThumb: true,
            withScale: true,
          };
    
          const mockParent = document.createElement('div');
          const view = new View(mockParent, newOptions);
          const barBox = mockParent.querySelector(`.${sliderClassNames.range.main}`) as HTMLDivElement;
          const rangeLeftNum = parseFloat(barBox.style.left);
          const rangeRightNum = parseFloat(barBox.style.right);
    
          expect(rangeLeftNum).toEqual(50);
          expect(rangeRightNum).toEqual(50);
        });
      });
    });
  });
});
