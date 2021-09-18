import Controller from "./controller/Controller";
import IModelOptions from "./interfaces/IModelOptions";
import { TDomParent } from "./interfaces/namespace";

class SimpleSlider {

  private controller: Controller;

  constructor (domParent: TDomParent, options: IModelOptions) {
    this.controller = new Controller(domParent, options);
    this.initUserCallbackEvents(options);
  }

  public updateOptions (options: Partial<IModelOptions>): void {
    this.controller.updateOptions(options);
    this.initUserCallbackEvents(options);
  }

  private initUserCallbackEvents(options: IModelOptions) {
    const { onSlide } = options;

    if(onSlide) {
      this.controller.events.currentValueChanged.subscribe(onSlide)
    }
  }
}

export default SimpleSlider;