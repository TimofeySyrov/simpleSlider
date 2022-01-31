import { bind } from 'decko';

import Options from '../utils/interfaces/options';
import { Direction, DomParent, Orientation, Type, UpdateValues } from '../utils/types/namespace';
import sliderDataAttributes from '../utils/sliderDataAttributes';
import Observer from '../observer/Observer';
import Model from '../model/Model';
import View from '../view/View';

class Controller extends Observer {
  private domParent: DomParent;
  private model: Model;
  private view: View;

  get options (): Options {
    return this.model.options;
  }

  constructor (domParent: DomParent, options: Options) {
    super();

    this.domParent = domParent;
    this.model = new Model({
      ...options,
      ...this.getOptionsFromAttributes(),
    });
    this.view = new View(this.domParent, this.model.options);

    this.init();
  }

  public updateOptions (options: Partial<Options>): void {
    this.model.updateOptions(options);
  }

  public updateValues (value: UpdateValues): void {
    this.model.updateValues(value);
  }

  private init () {
    this.model.subscribe('updateOptions', this.handleModelUpdateOptions);
    this.model.subscribe('updateValues', this.handleModelUpdateValues);
    this.view.subscribe('onSlide', this.handleViewOnSlide);
  }

  @bind
  private handleModelUpdateOptions (options: Options) {
    this.view.updateOptions(options);
    this.notify('updateOptions', options);
  }

  @bind
  private handleModelUpdateValues (value: UpdateValues) {
    this.view.updateValues(value);
    this.notify('updateValues', value);
  }

  @bind
  private handleViewOnSlide (value: UpdateValues) {
    this.model.updateValues(value);
  }

  private getOptionsFromAttributes (): Partial<Options> {
    const {
      min,
      max,
      step,
      from,
      to,
      type,
      direction,
      orientation,
      withScale,
      withThumb,
      withRange,
    } = {
      min: this.domParent.getAttribute(`${sliderDataAttributes.min}`),
      max: this.domParent.getAttribute(`${sliderDataAttributes.max}`),
      from: this.domParent.getAttribute(`${sliderDataAttributes.from}`),
      to: this.domParent.getAttribute(`${sliderDataAttributes.to}`),
      step: this.domParent.getAttribute(`${sliderDataAttributes.step}`),
      type: this.domParent.getAttribute(`${sliderDataAttributes.type}`),
      direction: this.domParent.getAttribute(`${sliderDataAttributes.direction}`),
      orientation: this.domParent.getAttribute(`${sliderDataAttributes.orientation}`),
      withRange: this.domParent.getAttribute(`${sliderDataAttributes.withRange}`),
      withThumb: this.domParent.getAttribute(`${sliderDataAttributes.withThumb}`),
      withScale: this.domParent.getAttribute(`${sliderDataAttributes.withScale}`),
    };

    return {
      min: min ? parseFloat(min) : undefined,
      max: max ? parseFloat(max) : undefined,
      step: step ? parseFloat(step) : undefined,
      from: from ? parseFloat(from) : undefined,
      to: to ? parseFloat(to) : undefined,
      type: type ? type as Type : undefined,
      direction: direction ? direction as Direction : undefined,
      orientation: orientation ? orientation as Orientation : undefined,
      withRange: withRange ? withRange === 'true' : undefined,
      withThumb: withThumb ? withThumb === 'true' : undefined,
      withScale: withScale ? withScale === 'true' : undefined,
    };
  }
}

export default Controller;
