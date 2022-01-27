import { bind } from 'decko';

import IUserOptions from '../utils/interfaces/IUserOptions';
import ICorrectOptions from '../utils/interfaces/ICorrectOptions';
import { DomParent, UpdateCurrentValue } from '../utils/types/namespace';
import Observer from '../observer/Observer';
import Model from '../model/Model';
import View from '../view/View';

class Controller extends Observer {
  private domParent: DomParent;
  private model: Model;
  private view: View;

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
    this.model.subscribe('updateOptions', this.handleModelUpdateOptions);
    this.model.subscribe('updateCurrentValue', this.handleModelUpdateCurrentValue);
    this.view.subscribe('onSlide', this.handleViewOnSlide);
  }

  @bind
  private handleModelUpdateOptions (newOptions: ICorrectOptions) {
    this.view.updateOptions(newOptions);
  }

  @bind
  private handleModelUpdateCurrentValue (newValue: UpdateCurrentValue) {
    this.view.updateCurrentValue(newValue);
  }

  @bind
  private handleViewOnSlide (newValue: UpdateCurrentValue) {
    this.model.updateCurrentValue(newValue);
  }
}

export default Controller;
