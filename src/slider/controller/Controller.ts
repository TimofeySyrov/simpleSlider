import { bind } from 'decko';

import IUserOptions from '../utils/interfaces/IUserOptions';
import { TDomParent, TUpdateToggle } from '../utils/types/namespace';
import Observer from '../observer/Observer';
import Model from '../model/Model';
import View from '../view/View';
import ICorrectOptions from '../utils/interfaces/ICorrectOptions';
import ISliderEvents from '../utils/interfaces/ISliderEvents';

class Controller extends Observer {
  private domParent: TDomParent;

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

  constructor (domParent: TDomParent, options: ICorrectOptions) {
    super();

    this.domParent = domParent;
    this.model = new Model(options);
    this.view = new View(this.domParent, this.model.options);

    this.init();
  }

  public updateOptions (options: IUserOptions): void {
    const newOptions = { ...this.model.options, ...options } as ICorrectOptions;
    this.model.updateModelOptions(newOptions);
  }

  public updateCurrentValue (toggle: TUpdateToggle): void {
    this.model.updateCurrentValueOption(toggle);
  }

  private init () {
    this.subscribeToLayers();
    this.subscribeToEvents();
  }

  private subscribeToLayers () {
    this.model.subscribe(this.onModelUpdate); // подписываемся на Модель
    this.view.subscribe(this.onViewUpdate); // подписываемся на Отображение
  }

  private subscribeToEvents () {
    this.model.events.currentValueChanged.subscribe(this.updateViewFromModelEvents);
    this.view.events.onSlide.subscribe(this.updateModelFromViewEvents);
  }

  @bind
  private updateViewFromModelEvents (toggle: TUpdateToggle) {
    this.view.updateCurrentValue(toggle);
  }

  @bind
  private updateModelFromViewEvents (toggle: TUpdateToggle) {
    this.model.updateCurrentValueOption(toggle);
  }

  // наблюдатель Модели
  @bind
  private onModelUpdate (newModelOptions: ICorrectOptions) {
    this.view.updateModelOptions(newModelOptions);
    this.model.events.modelOptionsChanged.notify(newModelOptions);
  }

  // наблюдатель Отображения
  @bind
  private onViewUpdate (newModelOptions: IUserOptions) {
    this.model.updateModelOptions(newModelOptions as ICorrectOptions);
  }
}

export default Controller;
