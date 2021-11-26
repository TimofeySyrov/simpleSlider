/**
 * @jest-environment jsdom
 */
import ICorrectOptions from '../../utils/interfaces/ICorrectOptions';
import { TUpdateCurrentValue } from '../../utils/types/namespace';
import defaultModelOptions from '../../utils/defaultModelOptions';
import sliderClassNames from '../../utils/sliderClassNames';
import View from '../View';

describe('View:', () => {
  describe('updateModelOptions:', () => {
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

      const mockParent = document.createElement('div');
      const view = new class MockView extends View {
        constructor () {
          super(mockParent, defaultModelOptions);
        }

        get options (): ICorrectOptions {
          // @ts-ignore
          return this.modelOptions;
        }
      }();

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

      const newToValue: TUpdateCurrentValue = { option: 'to', value: 76 };

      const newFromValue: TUpdateCurrentValue = { option: 'from', value: 1 };

      const mockParent = document.createElement('div');
      const view = new View(mockParent, newOptions);

      view.updateCurrentValue(newToValue);
      view.updateCurrentValue(newFromValue);

      const valueTo = (mockParent.querySelector('[data-index="1"]') as HTMLElement).querySelector(`.${sliderClassNames.thumb.main}`) as HTMLDivElement;
      const valueFrom = (mockParent.querySelector('[data-index="0"]') as HTMLElement).querySelector(`.${sliderClassNames.thumb.main}`) as HTMLDivElement;

      expect(valueTo.innerHTML).toBe('76');
      expect(valueFrom.innerHTML).toBe('1');
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

  describe('startDragging, drag, finishDragging:', () => {
    test('должны уведомлять при взаимодействии со шкалой и баром слайдера', () => {
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

  describe('clickEvent:', () => {
    test('должен вызывать метод dragEvent при клике', () => {
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

      // @ts-ignore
      const mockDragEvent = jest.spyOn(view, 'dragEvent');

      const scaleItem = mockParent.querySelector(`.${sliderClassNames.scaleItem.main}`) as HTMLElement;
      const from = mockParent.querySelectorAll(`.${sliderClassNames.toggle.main}`)[0] as HTMLElement;

      $(from).trigger('click');

      expect(mockDragEvent).toHaveBeenCalled();
    });
  });

  describe('convertValueToPercent:', () => {
    test('должнен вернуть корректный процент', () => {
      const newOptions: ICorrectOptions = {
        min: 256,
        max: 842,
        step: 1,
        orientation: 'horizontal',
        type: 'from-start',
        currentValue: 555,
        withRange: true,
        withThumb: true,
        withScale: true,
      };

      const mockParent = document.createElement('div');
      const view = new View(mockParent, newOptions);

      const { min, max } = newOptions;
      const value = 429.5;
      const result = Number((((value - min) / (max - min)) * 100).toFixed(3));

      // @ts-ignore
      expect(view.convertValueToPercent(value)).toEqual(result);
    });
  });

  describe('setRangePosition:', () => {
    test('должнен задавать стили для range', () => {
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

      const bar = mockParent.querySelector(`.${sliderClassNames.range.main}`) as HTMLDivElement;
      const to = mockParent.querySelectorAll(`.${sliderClassNames.toggle.main}`)[1] as HTMLDivElement;
      const newBottom = 30;

      to.style.bottom = `${newBottom}%`;

      // @ts-ignore
      view.setRangePosition();

      expect(bar.style.top).toEqual(`${100 - newBottom}%`);
      expect(bar.style.bottom).toEqual(`${25}%`);
    });
  });
});
