import IModelOptions from "./interfaces/IModelOptions";
import Controller from "./controller/Controller";

class SimpleSlider {

  private options: IModelOptions;
  private domParent: HTMLDivElement;

  constructor (domParent: HTMLDivElement, options: IModelOptions) {
    this.domParent = domParent
    this.options = options;
    this.initApp();
  }

  private initApp () {
    const controller = new Controller(this.domParent, this.options)
  }
  
}

export default SimpleSlider;