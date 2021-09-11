import IModelOptions from "../interfaces/IModelOptions";

import Observer from "../observer/Observer";
import Model from "../model/Model";
import View from "../view/View";
import { bind } from "decko";
import { TDomParent, TToggle } from "../interfaces/namespace";

class Controller extends Observer {

  private sliderOptions: IModelOptions;
  private domParent: TDomParent;

  private model: Model;
  private view: View;

  constructor(domParent: TDomParent, sliderOptions: IModelOptions) {
    super();

    this.domParent = domParent;
    this.sliderOptions = sliderOptions;

    this.model = new Model(this.sliderOptions);
    this.view = new View(this.domParent, this.model.options);

    this.init();
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
  private updateViewFromModelEvents (obj: { handle: TToggle, value: number }) {
    this.view.updateCurrentValue(obj);
  }

  @bind
  private updateModelFromViewEvents (obj: { handle: TToggle, value: number }) {
    this.model.updateCurrentValueOption(obj);
  }

  @bind
  public updateModelOptions (newModelOptions: IModelOptions) { // метод обновления Контроллера
    this.sliderOptions = newModelOptions;
  }

  @bind
  private onModelUpdate (newModelOptions: IModelOptions) { // наблюдатель Модели
    this.view.updateModelOptions(newModelOptions); // передаем изменения для обновления Отображения
    this.updateModelOptions(newModelOptions); // передаем изменения для обновления Контроллера
  }

  @bind
  private onViewUpdate (newModelOptions?: IModelOptions) { // наблюдатель Отображения
    this.model.updateModelOptions(newModelOptions)
  }

}

export default Controller