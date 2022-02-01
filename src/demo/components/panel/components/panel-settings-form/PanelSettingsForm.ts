import { bind } from 'decko';

import Options from '../../../../../slider/utils/interfaces/options';
import Observer from '../../../../../slider/Observer/Observer';
import INodes from '../../utils/interfaces/INodes';

class PanelSettingsForm extends Observer {
  private body: HTMLElement | null;
  private sliderOptions: Options;
  private nodes!: INodes;

  constructor (domParent: HTMLElement, options: Options) {
    super();

    this.body = domParent.querySelector('.js-panel-settings-form');
    this.sliderOptions = options;

    this.init();
  }

  @bind
  public updateState (options: Partial<Options>): void {
    const { nodes } = this;
    this.sliderOptions = { ...this.sliderOptions, ...options };
    const {
      min,
      max,
      from,
      to,
      step,
      type,
      direction,
      orientation,
      withRange,
      withScale,
      withThumb,
    } = this.sliderOptions;
    const isDoubleType = type === 'double';

    nodes.min.value = `${min}`;
    nodes.max.value = `${max}`;
    nodes.from.value = `${from}`;
    nodes.to.value = isDoubleType ? `${to}` : '';
    nodes.step.value = `${step}`;
    nodes[type].checked = true;
    nodes[orientation].checked = true;
    nodes[direction].checked = true;
    nodes.withRange.checked = withRange;
    nodes.withThumb.checked = withThumb;
    nodes.withScale.checked = withScale;
    nodes.to.disabled = !isDoubleType;
  }

  private init (): void {
    this.findDOMElements();
    this.updateState(this.sliderOptions);
    this.bindEventListeners();
  }

  private findDOMElements (): void {
    const { body } = this;
    const hasBody = body !== undefined && body !== null;

    if (hasBody) {
      this.nodes = {
        min: body.querySelector('[data-option-type="min"]') as HTMLInputElement,
        max: body.querySelector('[data-option-type="max"]') as HTMLInputElement,
        from: body.querySelector('[data-option-type="from"]') as HTMLInputElement,
        to: body.querySelector('[data-option-type="to"]') as HTMLInputElement,
        step: body.querySelector('[data-option-type="step"]') as HTMLInputElement,
        single: body.querySelector('[data-option-type="single"]') as HTMLInputElement,
        double: body.querySelector('[data-option-type="double"]') as HTMLInputElement,
        horizontal: body.querySelector('[data-option-type="horizontal"]') as HTMLInputElement,
        vertical: body.querySelector('[data-option-type="vertical"]') as HTMLInputElement,
        ltr: body.querySelector('[data-option-type="ltr"]') as HTMLInputElement,
        rtl: body.querySelector('[data-option-type="rtl"]') as HTMLInputElement,
        withRange: body.querySelector('[data-option-type="withRange"]') as HTMLInputElement,
        withThumb: body.querySelector('[data-option-type="withThumb"]') as HTMLInputElement,
        withScale: body.querySelector('[data-option-type="withScale"]') as HTMLInputElement,
      };
    }
  }

  private bindEventListeners (): void {
    const { nodes } = this;

    /* Input type of NUMBER */
    nodes.min.addEventListener('change', this.handleInputChange);
    nodes.max.addEventListener('change', this.handleInputChange);
    nodes.from.addEventListener('change', this.handleInputChange);
    nodes.to.addEventListener('change', this.handleInputChange);
    nodes.step.addEventListener('change', this.handleInputChange);

    /* Input type of RADIO */
    nodes.single.addEventListener('change', this.handleInputChange);
    nodes.double.addEventListener('change', this.handleInputChange);
    nodes.horizontal.addEventListener('change', this.handleInputChange);
    nodes.vertical.addEventListener('change', this.handleInputChange);
    nodes.ltr.addEventListener('change', this.handleInputChange);
    nodes.rtl.addEventListener('change', this.handleInputChange);

    /* Input type of CHECKBOX */
    nodes.withRange.addEventListener('change', this.handleInputChange);
    nodes.withThumb.addEventListener('change', this.handleInputChange);
    nodes.withScale.addEventListener('change', this.handleInputChange);
  }

  private updateSliderOptions (): void {
    const { nodes } = this;

    const newOptions: Options = {
      min: parseFloat(nodes.min.value),
      max: parseFloat(nodes.max.value),
      step: parseFloat(nodes.step.value),
      from: parseFloat(nodes.from.value),
      to: parseFloat(nodes.to.value),
      type: nodes.single.checked ? 'single' : 'double',
      orientation: nodes.horizontal.checked ? 'horizontal' : 'vertical',
      direction: nodes.ltr.checked ? 'ltr' : 'rtl',
      withRange: nodes.withRange.checked,
      withThumb: nodes.withThumb.checked,
      withScale: nodes.withScale.checked,
    };

    this.notify('changeOptions', newOptions);
  }

  @bind
  private handleInputChange (): void {
    this.updateSliderOptions();
  }
}

export default PanelSettingsForm;
