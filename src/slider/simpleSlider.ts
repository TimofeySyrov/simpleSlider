import IModelOptions, { API } from "./interfaces/IModelOptions";
import Controller from "./controller/Controller";
import './view/styles/view.scss';
import { TDomParent } from "./interfaces/namespace";

class SimpleSlider implements API {

  private options: IModelOptions;
  private domParent: TDomParent;
  private controller: Controller;

  constructor (domParent: TDomParent, options: IModelOptions) {
    this.domParent = domParent
    this.options = options;
    this.controller = new Controller(this.domParent, this.options);
    this.initUserCallbackEvents();
  }

  public updateOptions (options: Partial<IModelOptions>): void {
    this.controller.updateOptions(options);
  }

  private initUserCallbackEvents() {
    const { onSlide } = this.options;

    if(onSlide) {
      this.controller.events.currentValueChanged.subscribe(onSlide)
    }
  }
}

export default SimpleSlider;