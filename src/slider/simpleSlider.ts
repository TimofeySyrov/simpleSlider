import Controller from './controller/Controller';
import IUserOptions from './utils/interfaces/IUserOptions';
import ICorrectOptions from './utils/interfaces/ICorrectOptions';
import { TDomParent, TUpdateCurrentValue } from './utils/types/namespace';
import ISliderEvents from './utils/interfaces/ISliderEvents';

class SimpleSlider {
  private controller: Controller;

  get events (): ISliderEvents {
    return this.controller.events;
  }

  get options (): ICorrectOptions {
    return this.controller.options;
  }

  constructor (domParent: TDomParent, options: IUserOptions) {
    this.controller = new Controller(domParent, options as ICorrectOptions);
    this.initUserCallbackEvents(options);
  }

  public updateOptions (options: IUserOptions): void {
    this.controller.updateOptions(options);
    this.initUserCallbackEvents(options);
  }

  public updateCurrentValue (newValue: TUpdateCurrentValue): void {
    this.controller.updateCurrentValue(newValue);
  }

  private initUserCallbackEvents (options: IUserOptions): void {
    const { onSlide } = options;

    if (onSlide) {
      this.controller.events.currentValueChanged.subscribe(onSlide);
    }
  }
}

export default SimpleSlider;
