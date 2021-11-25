import { bind } from 'decko';

import ICorrectOptions from '../../../../../slider/utils/interfaces/ICorrectOptions';
import { TCurrentValue, TType, TUpdateCurrentValue } from '../../../../../slider/utils/types/namespace';
import Observer from '../../../../../slider/observer/Observer';
import INodes from './utils/interfaces/INodes';
import debounce from './utils/debounce';

class PanelSettingsForm extends Observer {
  private domParent: HTMLElement;
  private sliderOptions: ICorrectOptions;
  private nodes!: INodes;

  constructor (domParent: HTMLElement, options: ICorrectOptions) {
    super();

    this.domParent = domParent;
    this.sliderOptions = options;

    this.init();
  }

  @bind
  public updateOptions (options: ICorrectOptions): void {
    const { nodes } = this;
    const {
      min,
      max,
      currentValue,
      step,
      type,
      orientation,
      withRange,
      withScale,
      withThumb,
    } = options;
    const isRange = type === 'range';

    nodes.min.value = `${min}`;
    nodes.max.value = `${max}`;
    nodes.step.value = `${step}`;
    nodes[orientation].checked = true;
    nodes[type].checked = true;
    nodes.withRange.checked = withRange;
    nodes.withThumb.checked = withThumb;
    nodes.withScale.checked = withScale;
    nodes.to.disabled = !isRange;

    this.changeCurrentValue(currentValue);
  }

  @bind
  public updateCurrentValue (newValue: TUpdateCurrentValue): void {
    const { nodes } = this;

    nodes[newValue.option].value = `${newValue.value}`;
  }

  private init(): void {
    this.findDOMElements();
    this.updateOptions(this.sliderOptions);
    this.bindEventListeners();
  }

  private findDOMElements (): void {
    const { domParent } = this;
    this.nodes = {
      min: domParent.querySelector('[data-option-type="min"]') as HTMLInputElement,
      max: domParent.querySelector('[data-option-type="max"]') as HTMLInputElement,
      from: domParent.querySelector('[data-option-type="from"]') as HTMLInputElement,
      to: domParent.querySelector('[data-option-type="to"]') as HTMLInputElement,
      step: domParent.querySelector('[data-option-type="step"]') as HTMLInputElement,
      horizontal: domParent.querySelector('[data-option-type="horizontal"]') as HTMLInputElement,
      vertical: domParent.querySelector('[data-option-type="vertical"]') as HTMLInputElement,
      'from-start': domParent.querySelector('[data-option-type="from-start"]') as HTMLInputElement,
      'from-end': domParent.querySelector('[data-option-type="from-end"]') as HTMLInputElement,
      range: domParent.querySelector('[data-option-type="range"]') as HTMLInputElement,
      withRange: domParent.querySelector('[data-option-type="withRange"]') as HTMLInputElement,
      withThumb: domParent.querySelector('[data-option-type="withThumb"]') as HTMLInputElement,
      withScale: domParent.querySelector('[data-option-type="withScale"]') as HTMLInputElement,
    };
  }

  private bindEventListeners (): void {
    const { nodes } = this;

    /* Input type of NUMBER */
    nodes.min.addEventListener('input', this.handleNumberInputInput);
    nodes.max.addEventListener('input', this.handleNumberInputInput);
    nodes.from.addEventListener('input', this.handleNumberInputInput);
    nodes.to.addEventListener('input', this.handleNumberInputInput);
    nodes.step.addEventListener('input', this.handleNumberInputInput);

    /* Input type of RADIO */
    nodes.horizontal.addEventListener('change', this.handleInputChange);
    nodes.vertical.addEventListener('change', this.handleInputChange);
    nodes['from-start'].addEventListener('change', this.handleInputChange);
    nodes['from-end'].addEventListener('change', this.handleInputChange);
    nodes.range.addEventListener('change', this.handleInputChange);

    /* Input type of CHECKBOX */
    nodes.withRange.addEventListener('change', this.handleInputChange);
    nodes.withThumb.addEventListener('change', this.handleInputChange);
    nodes.withScale.addEventListener('change', this.handleInputChange);
  }

  private updateSliderOptions(): void {
    const { nodes } = this;
    const getCheckedType = (): TType => {
      const isFromEnd = nodes['from-end'].checked;
      const isRange = nodes.range.checked;

      if (isRange) return 'range';
      if (isFromEnd) return 'from-end';
      return 'from-start';
    };

    const newOptions: ICorrectOptions = {
      min: nodes.min.value ? parseFloat(nodes.min.value) : this.sliderOptions.min,
      max: nodes.max.value ? parseFloat(nodes.max.value) : this.sliderOptions.max,
      step: nodes.step.value ? parseFloat(nodes.step.value) : this.sliderOptions.step,
      currentValue: {
        from: nodes.from.value ? parseFloat(nodes.from.value) : this.sliderOptions.min,
        to: nodes.to.value ? parseFloat(nodes.to.value) : this.sliderOptions.min,
      },
      orientation: nodes.horizontal.checked ? 'horizontal' : 'vertical',
      type: getCheckedType(),
      withRange: nodes.withRange.checked,
      withThumb: nodes.withThumb.checked,
      withScale: nodes.withScale.checked,
    };

    this.notify(newOptions);
  }

  private handleNumberInputInput = debounce(() => {
    this.updateSliderOptions();
  });

  @bind
  private handleInputChange(): void {
    this.updateSliderOptions();
  }

  private changeCurrentValue (currentValue: TCurrentValue): void {
    const { nodes } = this;

    if (typeof currentValue === 'object') {
      nodes.from.value = `${currentValue.from}`;
      nodes.to.value = `${currentValue.to}`;
    }

    if (typeof currentValue === 'number') {
      nodes.from.value = `${currentValue}`;
    }
  }
}

export default PanelSettingsForm;
