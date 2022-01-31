import Options from './utils/interfaces/options';
import { DomParent, SliderEvents, UpdateValues } from './utils/types/namespace';
import Controller from './controller/Controller';

class SimpleSlider {
  private controller: Controller;

  get options (): Options {
    return this.controller.options;
  }

  constructor (domParent: DomParent, options: Options) {
    this.controller = new Controller(domParent, options);
  }

  public updateOptions (options: Partial<Options>): void {
    this.controller.updateOptions(options);
  }

  public updateValues (value: UpdateValues): void {
    this.controller.updateValues(value);
  }

  public subscribe (event: SliderEvents, cb: Function): void {
    this.controller.subscribe(event, cb);
  }

  public unsubscribe (event: SliderEvents, cb: Function): void {
    this.controller.unsubscribe(event, cb);
  }
}

export default SimpleSlider;
