import Controller from "./controller/Controller";
import IModelOptions from "./interfaces/IModelOptions";
import IEvents from "./interfaces/model/IModelEvents";
import { TDomParent, TUpdateToggle } from "./interfaces/namespace";

class SimpleSlider {

  private controller: Controller;

  get events (): IEvents {
    return this.controller.events;
  }

  get options (): IModelOptions {
    return this.controller.options;
  }

  constructor (domParent: TDomParent, options: IModelOptions) {
    this.controller = new Controller(domParent, options);
    this.initUserCallbackEvents(options);
  }

  public updateOptions (options: Partial<IModelOptions>): void {
    this.controller.updateOptions(options);
    this.initUserCallbackEvents(options);
  }

  public updateCurrentValue (toggle: TUpdateToggle) {
    this.controller.updateCurrentValue(toggle);
  }

  private initUserCallbackEvents(options: IModelOptions) {
    const { onSlide } = options;

    if(onSlide) {
      this.controller.events.currentValueChanged.subscribe(onSlide)
    }
  }
}

export default SimpleSlider;