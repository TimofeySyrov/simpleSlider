/**
 * @jest-environment jsdom
 */
import $ from 'jquery';

import Options from '../../utils/interfaces/options';
import { UpdateValues } from '../../utils/types/namespace';
import defaultOptions from '../../utils/defaultOptions';
import sliderClassNames from '../../utils/sliderClassNames';
import View from '../View';

describe('View:', () => {
  const domParent = document.createElement('div');
  const view = new View(domParent, defaultOptions);
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
    view.updateOptions(defaultOptions);
  });

  describe('updateOptions:', () => {
    test('должен обновлять опции', () => {
      const newOptions: Options = {
        ...defaultOptions,
        ...{
          min: 10,
          max: 50,
          step: 2,
          orientation: 'vertical',
          direction: 'ltr',
          from: 10,
          withRange: false,
          withThumb: true,
          withScale: false,
        },
      };

      view.updateOptions(newOptions);

      const { slider, range, from, scale } = getNodes(domParent);

      expect(slider.classList.contains(`${sliderClassNames.slider[newOptions.orientation]}`)).toBeTruthy();
      expect(range).toBeFalsy();
      expect(scale).toBeFalsy();
      expect(from.thumb).not.toBeFalsy();
      expect(from.thumb.textContent).toEqual(`${newOptions.from}`);
    });
  });

  describe('UpdateValues:', () => {
    test('должен обновлять значения позлунков слайдера', () => {
      const newOptions: Options = {
        ...defaultOptions,
        ...{
          type: 'double',
          from: 25,
          to: 50,
        },
      };
      const newToValue: UpdateValues = { option: 'to', value: 76 };
      const newFromValue: UpdateValues = { option: 'from', value: 1 };
      
      view.updateOptions(newOptions);
      view.updateValues(newToValue);
      view.updateValues(newFromValue);

      const { from, to } = getNodes(domParent);

      expect(from.thumb.textContent).toBe(`${newFromValue.value}`);
      expect(to.thumb.textContent).toBe(`${newToValue.value}`);
    });
  });

  describe('initComponents, render:', () => {
    test('должны корректно создавать DOM слайдера', () => {
      const newOptions: Options = {
        ...defaultOptions,
        ...{
          type: 'double',
          orientation: 'vertical',
          from: 25,
          to: 50,
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
      const newOptions: Options = {
        ...defaultOptions,
        ...{
          to: 100,
          type: 'double',
        },
      };

      view.updateOptions(newOptions);

      const { from, to } = getNodes(domParent);

      expect(from.handle).toBeInstanceOf(HTMLElement);
      expect(from.thumb).toBeInstanceOf(HTMLElement);
      expect(to.handle).toBeInstanceOf(HTMLElement);
      expect(to.thumb).toBeInstanceOf(HTMLElement);
    });

    test('должен удалять лишние dom-элементы subView', () => {
      const newOptions: Options = {
        ...defaultOptions,
        ...{
          to: 100,
          type: 'double',
          withThumb: false,
          withRange: false,
          withScale: false,
        },
      };

      view.updateOptions(newOptions);

      const { range, from, to, scale } = getNodes(domParent);

      expect(range).toBeFalsy();
      expect(from.thumb).toBeFalsy();
      expect(to.thumb).toBeFalsy();
      expect(scale).toBeFalsy();
    });
  });

  describe('updateSliderState:', () => {
    test('должен корректно задавать классы для subView', () => {
      const newOptions: Options = {
        ...defaultOptions,
        ...{
          orientation: 'vertical',
          to: 100,
          type: 'double',
        },
      };

      view.updateOptions(newOptions);

      const { slider, bar, range, from, to, scale, scaleItems } = getNodes(domParent);

      expect(slider.classList.contains(`${sliderClassNames.slider[newOptions.orientation]}`)).toBeTruthy();
      expect(bar.classList.contains(`${sliderClassNames.bar[newOptions.orientation]}`)).toBeTruthy();
      expect(range.classList.contains(`${sliderClassNames.range[newOptions.orientation]}`)).toBeTruthy();

      /* From toggle */
      expect(from.handle.classList.contains(`${sliderClassNames.toggle[newOptions.orientation]}`)).toBeTruthy();
      expect(from.thumb.classList.contains(`${sliderClassNames.thumb[newOptions.orientation]}`)).toBeTruthy();

      /* To toggle */
      expect(to.handle.classList.contains(`${sliderClassNames.toggle[newOptions.orientation]}`)).toBeTruthy();
      expect(to.thumb.classList.contains(`${sliderClassNames.thumb[newOptions.orientation]}`)).toBeTruthy();

      /* Scale */
      expect(scale.classList.contains(`${sliderClassNames.scale[newOptions.orientation]}`)).toBeTruthy();
      scaleItems.forEach((item) => {
        expect(item.classList.contains(`${sliderClassNames.scaleItem[newOptions.orientation]}`)).toBeTruthy();
      });
    });
  });

  describe('handleScaleClick', () => {
    test('должен уведомлять при click на шкалу слайдера', () => {
      const sb = jest.fn();
      const { scaleItems } = getNodes(domParent);

      view.subscribe('onSlide', sb);
      $(scaleItems[0]).trigger('click');

      expect(sb).toBeCalledTimes(1);
    });
  });

  describe('handleBarMouseDown', () => {
    test('должен уведомлять при mousedown на бар слайдера', () => {
      const sb = jest.fn();
      const { bar } = getNodes(domParent);

      view.subscribe('onSlide', sb);
      bar.dispatchEvent(new Event('mousedown'));

      expect(sb).toBeCalledTimes(1);
    });
  });

  describe('setRangePosition:', () => {
    describe('должен корректно задавать стили для DOM range элеменета слайдера:', () => {
      describe('при vertical положении:', () => {
        test('при ltr положении', () => {
          const newOptions: Options = {
            ...defaultOptions,
            ...{
              orientation: 'vertical',
              from: 99.9,
            },
          };
    
          view.updateOptions(newOptions);

          const { range } = getNodes(domParent);
          const rangeTopNum = Number((parseFloat(range.style.top).toFixed(1)));
          const rangeBottomNum = parseFloat(range.style.bottom);
    
          expect(rangeTopNum).toEqual(0.1);
          expect(rangeBottomNum).toEqual(0);
        });

        test('при rtl положении', () => {
          const newOptions: Options = {
            ...defaultOptions,
            ...{
              orientation: 'vertical',
              direction: 'rtl',
              from: 0,
              to: 20,
              type: 'double',
            },
          };
    
          view.updateOptions(newOptions);

          const { range } = getNodes(domParent);
          const rangeTopNum = parseFloat(range.style.top);
          const rangeBottomNum = parseFloat(range.style.bottom);
    
          expect(rangeTopNum).toEqual(0);
          expect(rangeBottomNum).toEqual(80);
        });
      });

      describe('при horizontal положении:', () => {
        test('при ltr положении', () => {
          const newOptions: Options = {
            ...defaultOptions,
            ...{ from: 43 },
          };
    
          view.updateOptions(newOptions);

          const { range } = getNodes(domParent);
          const rangeLeftNum = parseFloat(range.style.left);
          const rangeRightNum = parseFloat(range.style.right);
    
          expect(rangeLeftNum).toEqual(0);
          expect(rangeRightNum).toEqual(57);
        });

        test('при rtl положении', () => {
          const newOptions: Options = {
            ...defaultOptions,
            ...{
              direction: 'rtl',
              from: 27.4,
              to: 50,
              type: 'double',
            },
          };
    
          view.updateOptions(newOptions);

          const { range } = getNodes(domParent);
          const rangeLeftNum = parseFloat(range.style.left);
          const rangeRightNum = Number((parseFloat(range.style.right).toFixed(1)));
    
          expect(rangeLeftNum).toEqual(50);
          expect(rangeRightNum).toEqual(27.4);
        });
      });
    });
  });
});
