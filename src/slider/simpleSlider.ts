import IUserOptions from './utils/interfaces/IUserOptions';
import ICorrectOptions from './utils/interfaces/ICorrectOptions';
import { DomParent, UpdateCurrentValue } from './utils/types/namespace';
import Controller from './controller/Controller';

class SimpleSlider {
  private controller: Controller;

  get options (): ICorrectOptions {
    return this.controller.options;
  }

  constructor (domParent: DomParent, options: IUserOptions) {
    this.controller = new Controller(domParent, options as ICorrectOptions);
  }

  public updateOptions (options: IUserOptions): void {
    this.controller.updateOptions(options);
  }

  public updateCurrentValue (newValue: UpdateCurrentValue): void {
    this.controller.updateCurrentValue(newValue);
  }

  public subscribe (event: string, cb: Function): void {
    this.controller.subscribe(event, cb);
  }

  public unsubscribe (event: string, cb: Function): void {
    this.controller.unsubscribe(event, cb);
  }
}

export default SimpleSlider;
