import { bind } from "decko";
import IModelOptions from "../../slider/interfaces/IModelOptions";
import { TCurrentValue, TDomParent, TUpdateToggle } from "../../slider/interfaces/namespace";
import SimpleSlider from "../../slider/simpleSlider";
import template from "./utils/template";
import INodes from "./interfaces/INodes";

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
    this.changeOptions(this.modelOptions);
  }

  private subscribeToSliderEvents(): void {
    this.slider.events.modelOptionsChanged.subscribe(this.changeOptions);
    this.slider.events.currentValueChanged.subscribe(this.onSlideUpdate);
  }

  private initPanelListeners(): void {
    const nodes = this.nodes;

    nodes.min.addEventListener('input', (e) => {
      this.slider.updateOptions({
        min: parseInt((e.target as HTMLInputElement).value)
      })
    })

    nodes.max.addEventListener('input', (e) => {
      this.slider.updateOptions({
        max: parseInt((e.target as HTMLInputElement).value)
      })
    })

    nodes.from.addEventListener('input', (e) => {
      this.slider.updateCurrentValue({
        handle: 'from',
        value: parseInt((e.target as HTMLInputElement).value)
      })
    })

    nodes.to.addEventListener('input', (e) => {
      this.slider.updateCurrentValue({
        handle: 'to',
        value: parseInt((e.target as HTMLInputElement).value)
      })
    })

    nodes.step.addEventListener('input', (e) => {
      this.slider.updateOptions({
        step: parseInt((e.target as HTMLInputElement).value)
      })
    })

    nodes.horizontal.addEventListener('change', (e) => {
      this.slider.updateOptions({
        orientation: 'horizontal'
      })
    })

    nodes.vertical.addEventListener('change', (e) => {
      this.slider.updateOptions({
        orientation: 'vertical'
      })
    })

    nodes['from-start'].addEventListener('change', (e) => {
      this.slider.updateOptions({
        type: 'from-start'
      })
    })

    nodes['from-end'].addEventListener('change', (e) => {
      this.slider.updateOptions({
        type: 'from-end'
      })
    })

    nodes['range'].addEventListener('change', (e) => {
      this.slider.updateOptions({
        type: 'range'
      })
    })

    nodes.withRange.addEventListener('change', (e) => {
      this.slider.updateOptions({
        withRange: Boolean((e.target as HTMLInputElement).checked)
      })
    })

    nodes.withThumb.addEventListener('change', (e) => {
      this.slider.updateOptions({
        withThumb: Boolean((e.target as HTMLInputElement).checked)
      })
    })

    nodes.withScale.addEventListener('change', (e) => {
      this.slider.updateOptions({
        withScale: Boolean((e.target as HTMLInputElement).checked)
      })
    })
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
  private changeOptions (options: IModelOptions): void {
    const { min, max, currentValue, step, type, orientation,
      withRange, withScale, withThumb } = options;
    const nodes = this.nodes;
    const isNotRange = type !== 'range';

    nodes.min.value = `${min}`;
    nodes.max.value = `${max}`;

    nodes.to.disabled = isNotRange;
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