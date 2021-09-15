/**
 * @jest-environment jsdom
 */

import $ from 'jquery';
import View from '../View';
import defaultModelOptions from '../../model/utils/defaultModelOptions';
import IModelOptions from '../../interfaces/IModelOptions';
import sliderClassNames from '../components/utils/sliderClassNames';
import { TUpdateToggle } from '../../interfaces/namespace';

describe('View:', () => {

  describe('updateModelOptions:', () => {
    test('должен обновлять опции', () => {

      const newOptions: IModelOptions = {
        min: 10,
        max: 50,
        step: 2,
        orientation: 'vertical',
        type: 'from-end',
        currentValue: 10,
        withRange: false,
        withThumb: false,
        withScale: false
      };
      
      const mockParent = document.createElement('div');
      const view = new class mockView extends View {

        get options(): IModelOptions {
          //@ts-ignore
          return this.modelOptions;
        }

        constructor(){
          super(mockParent, defaultModelOptions);
        }
      };
      view.updateModelOptions(newOptions);
  
      expect(view.options).toStrictEqual(newOptions);
    });
  });

  describe('updateCurrentValue:', () => {
    test('должен обновлять значения позлунков слайдера', () => {

      const newOptions: IModelOptions = {
        min: 0,
        max: 100,
        step: 1,
        orientation: 'horizontal',
        type: 'range',
        currentValue: { min: 25, max: 50 },
        withRange: true,
        withThumb: true,
        withScale: true
      };

      const newToValue: TUpdateToggle = {
        handle: 'to',
        value: 76
      }

      const newFromValue: TUpdateToggle = {
        handle: 'from',
        value: 1
      }

      const mockParent = document.createElement('div');
      const view = new View(mockParent, newOptions);

      view.updateCurrentValue(newToValue);
      view.updateCurrentValue(newFromValue);

      const valueTo = mockParent.querySelector(`[data-index="1"]`).querySelector(`.${sliderClassNames.thumb.main}`).innerHTML;
      const valueFrom = mockParent.querySelector(`[data-index="0"]`).querySelector(`.${sliderClassNames.thumb.main}`).innerHTML;

      expect(valueTo).toBe(`76.00`);
      expect(valueFrom).toBe(`1.00`);
    });
  });

  describe('initSubView, render:', () => {
    test('должны корректно создавать DOM слайдера', () => {

      const newOptions: IModelOptions = {
        min: 0,
        max: 100,
        step: 1,
        orientation: 'vertical',
        type: 'range',
        currentValue: { min: 25, max: 50 },
        withRange: true,
        withThumb: true,
        withScale: true
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

  describe('renderSubViewStyles:', () => {
    test('должен корректно задавать классы и дата-атрибуты для subView', () => {

      const newOptions: IModelOptions = {
        min: 0,
        max: 100,
        step: 1,
        orientation: 'vertical',
        type: 'range',
        currentValue: { min: 25, max: 50 },
        withRange: true,
        withThumb: true,
        withScale: true
      };

      const mockParent = document.createElement('div');
      const view = new View(mockParent, newOptions);

      const slider = mockParent.querySelector(`.${sliderClassNames.slider.main}`);
      const bar = mockParent.querySelector(`.${sliderClassNames.bar.main}`);
      const range = mockParent.querySelector(`.${sliderClassNames.range.main}`);
      const toggles = mockParent.querySelectorAll(`.${sliderClassNames.toggle.main}`);
      const thumbs = mockParent.querySelectorAll(`.${sliderClassNames.thumb.main}`);
      const scale = mockParent.querySelector(`.${sliderClassNames.scale.main}`);
      const scaleItems = mockParent.querySelectorAll(`.${sliderClassNames.scaleItem.main}`);

      expect(slider.classList.contains(`${sliderClassNames.slider[newOptions.orientation]}`)).toBeTruthy();
      expect(bar.classList.contains(`${sliderClassNames.bar[newOptions.orientation]}`)).toBeTruthy();
      expect(range.classList.contains(`${sliderClassNames.range[newOptions.orientation]}`)).toBeTruthy();

      /* From toggle */
      expect(toggles[0].classList.contains(`${sliderClassNames.toggle[newOptions.orientation]}`)).toBeTruthy();
      expect(toggles[0].getAttribute(`data-index`)).toEqual(`0`);
      expect(thumbs[0].classList.contains(`${sliderClassNames.thumb[newOptions.orientation]}`)).toBeTruthy();

      /* To toggle */
      expect(toggles[1].classList.contains(`${sliderClassNames.toggle[newOptions.orientation]}`)).toBeTruthy();
      expect(toggles[1].getAttribute(`data-index`)).toEqual(`1`);
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

      const newOptions: IModelOptions = {
        min: 0,
        max: 100,
        step: 1,
        orientation: 'vertical',
        type: 'range',
        currentValue: { min: 25, max: 50 },
        withRange: true,
        withThumb: true,
        withScale: true
      };

      const mockParent = document.createElement('div');
      const view = new View(mockParent, newOptions);

      const sb = jest.fn();
      view.events.slide.subscribe(sb);

      const scaleItem = mockParent.querySelector(`.${sliderClassNames.scaleItem.main}`);
      const bar = mockParent.querySelector(`.${sliderClassNames.bar.main}`);

      $(scaleItem).trigger("click");
      $(bar).trigger("click");

      expect(sb).toBeCalledTimes(2);
    });
  });
});