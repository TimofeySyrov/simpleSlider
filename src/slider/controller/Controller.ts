import IModelOptions from "../interfaces/IModelOptions";

import Observer from "../observer/Observer";
import Model from "../model/Model";
import View from "../view/View";
import { bind } from "decko";
import { TDomParent, TToggle, TUpdateToggle } from "../interfaces/namespace";

class Controller extends Observer {

  private sliderOptions: IModelOptions;
  private domParent: TDomParent;

  private model: Model;
  private view: View;

  get options(): IModelOptions {
    return this.sliderOptions;
  }

  constructor(domParent: TDomParent, sliderOptions: IModelOptions) {
    super();

    this.domParent = domParent;
    this.sliderOptions = sliderOptions;

    this.model = new Model(this.sliderOptions);
    this.view = new View(this.domParent, this.model.options);

    this.init();
  }

  public updateOptions(option: Partial<IModelOptions>) {
    this.model.updateModelOptions(option);
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
    this.view.events.slide.subscribe(this.updateModelFromViewEvents);
  }

  @bind
  private updateViewFromModelEvents (toggle: TUpdateToggle) {
    this.view.updateCurrentValue(toggle);
  }

  @bind
  private updateModelFromViewEvents (toggle: TUpdateToggle) {
    this.model.updateCurrentValueOption(toggle);
  }

  @bind
  private updateOptionsForController (newModelOptions: IModelOptions) { // метод обновления Контроллера
    this.sliderOptions = newModelOptions;
  }

  @bind
  private onModelUpdate (newModelOptions: IModelOptions) { // наблюдатель Модели
    this.view.updateModelOptions(newModelOptions); // передаем изменения для обновления Отображения
    this.updateOptionsForController(newModelOptions); // передаем изменения для обновления Контроллера
  }

  @bind
  private onViewUpdate (newModelOptions: IModelOptions) { // наблюдатель Отображения
    this.model.updateModelOptions(newModelOptions)
  }

}

export default Controller