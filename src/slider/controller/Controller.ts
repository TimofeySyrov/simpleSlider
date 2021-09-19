import { bind } from "decko";
import IModelOptions from "../interfaces/IModelOptions";
import Observer from "../observer/Observer";
import Model from "../model/Model";
import View from "../view/View";
import { TDomParent, TUpdateToggle } from "../interfaces/namespace";
import IEvents from "../interfaces/model/IModelEvents";

class Controller extends Observer {

  private domParent: TDomParent;

  private model: Model;
  private view: View;
  private _events: IEvents = {
    modelOptionsChanged: new Observer
  }

  get events (): IEvents {
    return { 
      ...this.model.events,
      ...this._events, 
      ...this.view.events 
    };
  }

  get options (): IModelOptions {
    return this.model.options;
  }

  constructor (domParent: TDomParent, options: IModelOptions) {
    super();

    this.domParent = domParent;
    this.model = new Model(options);
    this.view = new View(this.domParent, this.model.options);

    this.init();
  }

  public updateOptions (options: Partial<IModelOptions>): void {
    this.model.updateModelOptions(options);
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

  // наблюдатель Модели
  @bind
  private onModelUpdate (newModelOptions: IModelOptions) {
    this.view.updateModelOptions(newModelOptions);
    this._events.modelOptionsChanged.notify(newModelOptions);
  }

  // наблюдатель Отображения
  @bind
  private onViewUpdate (newModelOptions: IModelOptions) {
    this.model.updateModelOptions(newModelOptions)
  }

}

export default Controller