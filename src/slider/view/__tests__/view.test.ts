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
  const domParent = document.createElement('div');
  const view = new View(domParent, defaultModelOptions);
  const getNodes = (body: HTMLElement) => ({
    slider: body.querySelector(`.${sliderClassNames.slider.main}`) as HTMLElement,
    bar: body.querySelector(`.${sliderClassNames.bar.main}`) as HTMLElement,
    range: body.querySelector(`.${sliderClassNames.range.main}`) as HTMLElement,
    from: {
      handle: body.querySelectorAll(`.${sliderClassNames.toggle.main}`)[0] as HTMLElement,
      thumb: body.querySelectorAll(`.${sliderClassNames.thumb.main}`)[0] as HTMLElement,
    },
    to: {
      handle: body.querySelectorAll(`.${sliderClassNames.toggle.main}`)[1] as HTMLElement,
      thumb: body.querySelectorAll(`.${sliderClassNames.thumb.main}`)[1] as HTMLElement,
    },
    scale: body.querySelector(`.${sliderClassNames.scale.main}`) as HTMLElement,
    scaleItems: body.querySelectorAll(`.${sliderClassNames.scaleItem.main}`) as NodeListOf<HTMLElement>,
  });

  beforeEach(() => {
    view.updateOptions(defaultModelOptions);
  });

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

      view.updateOptions(newOptions);

      expect(view.options).toStrictEqual(newOptions);
    });
  });

  describe('updateCurrentValue:', () => {
    test('должен обновлять значения позлунков слайдера', () => {
      const newOptions: ICorrectOptions = {
        ...defaultModelOptions,
        ...{
          type: 'range',
          currentValue: { from: 25, to: 50 },
        },
      };
      const newToValue: TUpdateCurrentValue = { option: 'to', value: 76 };
      const newFromValue: TUpdateCurrentValue = { option: 'from', value: 1 };
      
      view.updateOptions(newOptions);
      view.updateCurrentValue(newToValue);
      view.updateCurrentValue(newFromValue);

      const { from, to } = getNodes(domParent);

      expect(from.thumb.innerHTML).toBe(`${newFromValue.value}`);
      expect(to.thumb.innerHTML).toBe(`${newToValue.value}`);
    });
  });

  describe('initSubView, render:', () => {
    test('должны корректно создавать DOM слайдера', () => {
      const newOptions: ICorrectOptions = {
        ...defaultModelOptions,
        ...{
          orientation: 'vertical',
          type: 'range',
          currentValue: { from: 25, to: 50 },
        },
      };

      view.updateOptions(newOptions);

      const { slider, bar, range, from, to, scale } = getNodes(domParent);

      expect(slider).toBeInstanceOf(HTMLElement);
      expect(bar).toBeInstanceOf(HTMLElement);
      expect(range).toBeInstanceOf(HTMLElement);
      expect(from.handle).toBeInstanceOf(HTMLElement);
      expect(from.thumb).toBeInstanceOf(HTMLElement);
      expect(to.handle).toBeInstanceOf(HTMLElement);
      expect(to.thumb).toBeInstanceOf(HTMLElement);
      expect(scale).toBeInstanceOf(HTMLElement);
    });
  });

  describe('render:', () => {
    test('должен добавлять отсутствующие dom-элементы subView', () => {
      const newOptions: ICorrectOptions = {
        ...defaultModelOptions,
        ...{ type: 'range' },
      };

      view.updateOptions(newOptions);

      const { from, to } = getNodes(domParent);

      expect(from.handle).toBeInstanceOf(HTMLElement);
      expect(from.thumb).toBeInstanceOf(HTMLElement);
      expect(to.handle).toBeInstanceOf(HTMLElement);
      expect(to.thumb).toBeInstanceOf(HTMLElement);
    });
    test('должен удалять лишние dom-элементы subView', () => {
      const newOptions: ICorrectOptions = {
        ...defaultModelOptions,
        ...{
          type: 'range',
          withThumb: false,
          withRange: false,
          withScale: false,
        },
      };

      view.updateOptions(newOptions);

      const { range, from, to, scale } = getNodes(domParent);

      /* eslint-disable @typescript-eslint/no-unused-expressions */
      expect(range).toBeUndefined;
      expect(from.thumb).toBeUndefined;
      expect(to.thumb).toBeUndefined;
      expect(scale).toBeUndefined;
      /* eslint-enable @typescript-eslint/no-unused-expressions */
    });
  });

  describe('renderSubViewStyles:', () => {
    test('должен корректно задавать классы и дата-атрибуты для subView', () => {
      const newOptions: ICorrectOptions = {
        ...defaultModelOptions,
        ...{ orientation: 'vertical', type: 'range' },
      };

      view.updateOptions(newOptions);

      const { slider, bar, range, from, to, scale, scaleItems } = getNodes(domParent);

      expect(slider.classList.contains(`${sliderClassNames.slider[newOptions.orientation]}`)).toBeTruthy();
      expect(bar.classList.contains(`${sliderClassNames.bar[newOptions.orientation]}`)).toBeTruthy();
      expect(range.classList.contains(`${sliderClassNames.range[newOptions.orientation]}`)).toBeTruthy();

      /* From toggle */
      expect(from.handle.classList.contains(`${sliderClassNames.toggle[newOptions.orientation]}`)).toBeTruthy();
      expect(from.handle.getAttribute('data-index')).toEqual('0');
      expect(from.thumb.classList.contains(`${sliderClassNames.thumb[newOptions.orientation]}`)).toBeTruthy();

      /* To toggle */
      expect(to.handle.classList.contains(`${sliderClassNames.toggle[newOptions.orientation]}`)).toBeTruthy();
      expect(to.handle.getAttribute('data-index')).toEqual('1');
      expect(to.thumb.classList.contains(`${sliderClassNames.thumb[newOptions.orientation]}`)).toBeTruthy();

      /* Scale */
      expect(scale.classList.contains(`${sliderClassNames.scale[newOptions.orientation]}`)).toBeTruthy();
      scaleItems.forEach((item) => {
        expect(item.classList.contains(`${sliderClassNames.scaleItem[newOptions.orientation]}`)).toBeTruthy();
      });
    });
  });

  describe('handleBarClick', () => {
    test('должны уведомлять при click на шкалу и бар слайдера', () => {
      const sb = jest.fn();
      const { bar, scaleItems } = getNodes(domParent);

      view.events.onSlide.subscribe(sb);
      $(scaleItems[0]).trigger('click');
      $(bar).trigger('click');

      expect(sb).toBeCalledTimes(2);
    });
  });

  describe('handleBarMouseDown', () => {
    test('должен уведомлять при mousedown на бар слайдера', () => {
      const sb = jest.fn();
      const { bar } = getNodes(domParent);

      view.events.onSlide.subscribe(sb);
      bar.dispatchEvent(new Event('mousedown'));

      expect(sb).toBeCalledTimes(1);
    });
  });

  describe('setRangePosition:', () => {
    describe('должен корректно задавать стили для DOM range элеменета слайдера:', () => {
      describe('при vertical положении:', () => {
        test('при from-start типе', () => {
          const newOptions: ICorrectOptions = {
            ...defaultModelOptions,
            ...{
              orientation: 'vertical',
              currentValue: 99.9,
            },
          };
    
          view.updateOptions(newOptions);

          const { range } = getNodes(domParent);
          const rangeTopNum = Number((parseFloat(range.style.top).toFixed(1)));
          const rangeBottomNum = parseFloat(range.style.bottom);
    
          expect(rangeTopNum).toEqual(0.1);
          expect(rangeBottomNum).toEqual(0);
        });
        test('при from-end типе', () => {
          const newOptions: ICorrectOptions = {
            ...defaultModelOptions,
            ...{
              orientation: 'vertical',
              type: 'from-end',
              currentValue: 0,
            },
          };
    
          view.updateOptions(newOptions);

          const { range } = getNodes(domParent);
          const rangeTopNum = parseFloat(range.style.top);
          const rangeBottomNum = parseFloat(range.style.bottom);
    
          expect(rangeTopNum).toEqual(0);
          expect(rangeBottomNum).toEqual(100);
        });
        test('при range типе', () => {
          const newOptions: ICorrectOptions = {
            ...defaultModelOptions,
            ...{
              orientation: 'vertical',
              type: 'range',
              currentValue: { from: 25, to: 68 },
            },
          };
    
          view.updateOptions(newOptions);

          const { range } = getNodes(domParent);
          const rangeTopNum = parseFloat(range.style.top);
          const rangeBottomNum = parseFloat(range.style.bottom);
    
          expect(rangeTopNum).toEqual(32);
          expect(rangeBottomNum).toEqual(25);
        });
      });
      describe('при horizontal положении:', () => {
        test('при from-start типе', () => {
          const newOptions: ICorrectOptions = {
            ...defaultModelOptions,
            ...{ currentValue: 43 },
          };
    
          view.updateOptions(newOptions);

          const { range } = getNodes(domParent);
          const rangeLeftNum = parseFloat(range.style.left);
          const rangeRightNum = parseFloat(range.style.right);
    
          expect(rangeLeftNum).toEqual(0);
          expect(rangeRightNum).toEqual(57);
        });
        test('при from-end типе', () => {
          const newOptions: ICorrectOptions = {
            ...defaultModelOptions,
            ...{
              type: 'from-end',
              currentValue: 27.4,
            },
          };
    
          view.updateOptions(newOptions);

          const { range } = getNodes(domParent);
          const rangeLeftNum = Number((parseFloat(range.style.left).toFixed(1)));
          const rangeRightNum = parseFloat(range.style.right);
    
          expect(rangeLeftNum).toEqual(72.6);
          expect(rangeRightNum).toEqual(0);
        });
        test('при range типе', () => {
          const newOptions: ICorrectOptions = {
            ...defaultModelOptions,
            ...{
              type: 'range',
              currentValue: { from: 50, to: 50 },
            },
          };
    
          view.updateOptions(newOptions);

          const { range } = getNodes(domParent);
          const rangeLeftNum = parseFloat(range.style.left);
          const rangeRightNum = parseFloat(range.style.right);
    
          expect(rangeLeftNum).toEqual(50);
          expect(rangeRightNum).toEqual(50);
        });
      });
    });
  });
});
