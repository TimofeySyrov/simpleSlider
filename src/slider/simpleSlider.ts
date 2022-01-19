import IUserOptions from './utils/interfaces/IUserOptions';
import ICorrectOptions from './utils/interfaces/ICorrectOptions';
import ISliderEvents from './utils/interfaces/ISliderEvents';
import { DomParent, UpdateCurrentValue } from './utils/types/namespace';
import Controller from './controller/Controller';

class SimpleSlider {
  private controller: Controller;

  get events (): ISliderEvents {
    return this.controller.events;
  }

  get options (): ICorrectOptions {
    return this.controller.options;
  }

  constructor (domParent: DomParent, options: IUserOptions) {
    this.controller = new Controller(domParent, options as ICorrectOptions);
    this.initUserCallbackEvents(options);
  }

  public updateOptions (options: IUserOptions): void {
    this.controller.updateOptions(options);
    this.initUserCallbackEvents(options);
  }

  public updateCurrentValue (newValue: UpdateCurrentValue): void {
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
