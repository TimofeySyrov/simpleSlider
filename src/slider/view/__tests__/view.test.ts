/**
 * @jest-environment jsdom
 */

import View from '../View';
import defaultModelOptions from '../../model/utils/defaultModelOptions';
import IModelOptions from '../../interfaces/IModelOptions';
import sliderClassNames from '../components/utils/sliderClassNames';
import { TUpdateToggle } from '../../interfaces/namespace';

const mockParent = document.createElement('div');

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

      const view = new View(mockParent, newOptions);
      view.updateCurrentValue(newToValue);
      view.updateCurrentValue(newFromValue);

      const valueTo = mockParent.querySelector(`[data-index="1"]`).querySelector(`.${sliderClassNames.thumb.main}`).innerHTML;
      const valueFrom = mockParent.querySelector(`[data-index="0"]`).querySelector(`.${sliderClassNames.thumb.main}`).innerHTML;

      expect(valueTo).toBe(`76.00`);
      expect(valueFrom).toBe(`1.00`);
    });
  });
});