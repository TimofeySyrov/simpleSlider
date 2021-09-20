import { bind } from "decko";
import IModelOptions from "../../slider/interfaces/IModelOptions";
import { TCurrentValue, TDomParent, TUpdateToggle } from "../../slider/interfaces/namespace";
import SimpleSlider from "../../slider/simpleSlider";
import template from "./utils/template";
import INodes from "./interfaces/INodes";
import debounce from "./utils/debounce";

class SimpleSliderPanel {

  private domParent: TDomParent;
  private slider: SimpleSlider;
  private nodes: INodes;
  private modelOptions: IModelOptions;

  constructor (domParent: TDomParent, slider: SimpleSlider) {
    this.domParent = domParent;
    this.slider = slider;
    this.modelOptions = this.slider.options;
    this.render();
    this.subscribeToSliderEvents();
    this.initPanelListeners();
  }

  private render (): void {
    const panel = document.createElement('div');
    panel.classList.add(`panel`);
    panel.innerHTML = template;

    this.nodes = {
      min: panel.querySelector(`.js-panel__min-input`),
      max: panel.querySelector(`.js-panel__max-input`),
      from: panel.querySelector(`.js-panel__from-input`),
      to: panel.querySelector(`.js-panel__to-input`),
      step: panel.querySelector(`.js-panel__step-input`),
      horizontal: panel.querySelector(`.js-panel__horizontal-input`),
      vertical: panel.querySelector(`.js-panel__vertical-input`),
      'from-start': panel.querySelector(`.js-panel__from-start-input`),
      'from-end': panel.querySelector(`.js-panel__from-end-input`),
      'range': panel.querySelector(`.js-panel__range-input`),
      withRange: panel.querySelector(`.js-panel__withRange-input`),
      withThumb: panel.querySelector(`.js-panel__withThumb-input`),
      withScale: panel.querySelector(`.js-panel__withScale-input`),
    };
    
    this.nodes.to.disabled = true;
    this.domParent.appendChild(panel);
    this.onUpdateOptions(this.modelOptions);
  }

  private subscribeToSliderEvents(): void {
    this.slider.events.modelOptionsChanged.subscribe(this.onUpdateOptions);
    this.slider.events.currentValueChanged.subscribe(this.onSlideUpdate);
  }

  private initPanelListeners(): void {
    const nodes = this.nodes;

    /* Input type of NUMBER */
    nodes.min.addEventListener('input', this.onNumberInputChange);
    nodes.max.addEventListener('input', this.onNumberInputChange);
    nodes.from.addEventListener('input', this.onNumberInputChange);
    nodes.to.addEventListener('input', this.onNumberInputChange);
    nodes.step.addEventListener('input', this.onNumberInputChange);

    /* Input type of RADIO */
    nodes.horizontal.addEventListener('change', this.onInputChange);
    nodes.vertical.addEventListener('change', this.onInputChange);
    nodes["from-start"].addEventListener('change', this.onInputChange);
    nodes["from-end"].addEventListener('change', this.onInputChange);
    nodes.range.addEventListener('change', this.onInputChange);

    /* Input type of CHECKBOX */
    nodes.withRange.addEventListener('change', this.onInputChange);
    nodes.withThumb.addEventListener('change', this.onInputChange)
    nodes.withScale.addEventListener('change', this.onInputChange);
  }

  private updateSliderOptions (): void {
    const newOptions: IModelOptions = {};
    const nodes = this.nodes;
    const optionOrientation = nodes.horizontal.checked ? 'horizontal' : 'vertical';
    const optionType = nodes.range.checked ? 'range' : nodes["from-start"].checked ? 'from-start' : 'from-end';

    newOptions.min = nodes.min.value ? parseFloat(nodes.min.value) : this.modelOptions.min;
    newOptions.max = nodes.max.value ? parseFloat(nodes.max.value) : this.modelOptions.max;
    newOptions.step = nodes.step.value ? parseFloat(nodes.step.value) : this.modelOptions.step;

    newOptions.currentValue = {
      min: nodes.from.value ? parseFloat(nodes.from.value) : this.modelOptions.min,
      max: nodes.to.value ? parseFloat(nodes.to.value) : this.modelOptions.min
    };

    newOptions.orientation = optionOrientation;
    newOptions.type = optionType;
    newOptions.withRange = nodes.withRange.checked;
    newOptions.withThumb = nodes.withThumb.checked;
    newOptions.withScale = nodes.withScale.checked;
    
    this.slider.updateOptions(newOptions);
  }


  private onNumberInputChange = debounce(() => {
    this.updateSliderOptions();
  });

  @bind
  private onInputChange (): void {
    this.updateSliderOptions();
  }

  @bind
  private onSlideUpdate (toggle: TUpdateToggle): void {
    const nodes = this.nodes;

    nodes[toggle.handle].value = `${toggle.value}`;
  }

  private changeCurrentValue (currentValue: TCurrentValue): void {
    const nodes = this.nodes;

    if(typeof currentValue === 'object') {
      nodes.from.value = `${currentValue.min}`;
      nodes.to.value = `${currentValue.max}`;
    }

    if(typeof currentValue === 'number') {
      nodes.from.value = `${currentValue}`;
    }
  }

  @bind
  private onUpdateOptions (options: IModelOptions): void {
    const { min, max, currentValue, step, type, orientation,
      withRange, withScale, withThumb } = options;
    const nodes = this.nodes;
    const isRange = type === 'range';

    nodes.min.value = `${min}`;
    nodes.max.value = `${max}`;

    nodes.to.disabled = !isRange;
    this.changeCurrentValue(currentValue);

    nodes.step.value = `${step}`;

    nodes[orientation].checked = true;
    nodes[type].checked = true;
    
    nodes.withRange.checked = withRange;
    nodes.withThumb.checked = withThumb;
    nodes.withScale.checked = withScale;
  }
}

export default SimpleSliderPanel;