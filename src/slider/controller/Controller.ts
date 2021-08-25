import IModelOptions from "../interfaces/IModelOptions";

import Observer from "../observer/Observer";
import Model from "../model/Model";
import View from "../view/View";

class Controller extends Observer {

  private sliderOptions: IModelOptions;
  private domParent: HTMLDivElement;

  private model: Model;
  private view: View;

  constructor(domParent: HTMLDivElement, sliderOptions: IModelOptions) {
    super();

    this.domParent = domParent;
    this.sliderOptions = sliderOptions;

    this.model = new Model(this.sliderOptions);
    this.view = new View(this.domParent, this.sliderOptions);
  }

  private subscribeToModules () {
    this.model.subscribe(this.onModelUpdate); // подписываемся на Модель
    this.view.subscribe(this.onViewUpdate); // подписываемся на Отображение
  }

  public updateModelOptions (newModelOptions: IModelOptions) { // метод обновления Контроллера
    this.sliderOptions = newModelOptions;
  }

  private onModelUpdate (modelOptions: IModelOptions) { // наблюдатель Модели
    this.view.updateModelOptions(modelOptions); // передаем изменения для обновления Отображения
    this.updateModelOptions(modelOptions); // передаем изменения для обновления Контроллера
  }

  private onViewUpdate (modelOptions: IModelOptions) { // наблюдатель Отображения
    this.model.updateModelOptions(modelOptions); // передаем изменения для обновления Модели
  }

}

export default Controller