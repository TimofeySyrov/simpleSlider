import { bind } from 'decko';

import IUserOptions from '../utils/interfaces/IUserOptions';
import ICorrectOptions from '../utils/interfaces/ICorrectOptions';
import ISliderEvents from '../utils/interfaces/ISliderEvents';
import { DomParent, UpdateCurrentValue } from '../utils/types/namespace';
import Observer from '../observer/Observer';
import Model from '../model/Model';
import View from '../view/View';

class Controller extends Observer {
  private domParent: DomParent;

  private model: Model;

  private view: View;

  get events (): ISliderEvents {
    return {
      ...this.model.events,
      ...this.view.events,
    };
  }

  get options (): ICorrectOptions {
    return this.model.options;
  }

  constructor (domParent: DomParent, options: ICorrectOptions) {
    super();

    this.domParent = domParent;
    this.model = new Model(options);
    this.view = new View(this.domParent, this.model.options);

    this.init();
  }

  public updateOptions (options: IUserOptions): void {
    const newOptions = { ...this.model.options, ...options } as ICorrectOptions;
    this.model.updateOptions(newOptions);
  }

  public updateCurrentValue (newValue: UpdateCurrentValue): void {
    this.model.updateCurrentValue(newValue);
  }

  private init () {
    this.subscribeToLayers();
    this.subscribeToEvents();
  }

  private subscribeToLayers () {
    this.model.subscribe(this.handleModelUpdate);
    this.view.subscribe(this.handleViewUpdate);
  }

  private subscribeToEvents () {
    this.model.events.currentValueChanged.subscribe(this.handleModelCurrentValueChange);
    this.view.events.onSlide.subscribe(this.handleViewOnSlide);
  }

  @bind
  private handleModelCurrentValueChange (newValue: UpdateCurrentValue) {
    this.view.updateCurrentValue(newValue);
  }

  @bind
  private handleViewOnSlide (newValue: UpdateCurrentValue) {
    this.model.updateCurrentValue(newValue);
  }

  // наблюдатель Модели
  @bind
  private handleModelUpdate (newOptions: ICorrectOptions) {
    this.view.updateOptions(newOptions);
  }

  // наблюдатель Отображения
  @bind
  private handleViewUpdate (newOptions: ICorrectOptions) {
    this.model.updateOptions(newOptions);
  }
}

export default Controller;
