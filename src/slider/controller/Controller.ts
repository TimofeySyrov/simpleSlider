import { bind } from 'decko';

import Options from '../utils/interfaces/options';
import { DomParent, UpdateValues } from '../utils/types/namespace';
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
    this.model = new Model(options);
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
}

export default Controller;
