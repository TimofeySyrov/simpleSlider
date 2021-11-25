import { bind } from 'decko';

import ICorrectOptions from '../../../slider/utils/interfaces/ICorrectOptions';
import IUserOptions from '../../../slider/utils/interfaces/IUserOptions';
import { TUpdateCurrentValue } from '../../../slider/utils/types/namespace';
import SimpleSlider from '../../../slider/simpleSlider';
import '../../../slider/index';
import PanelSettingsForm from './components/panel-settings-form/PanelSettingsForm';

class Panel {
  private domParent: HTMLElement;
  private sliderBox: HTMLElement | null;
  private settingsBox: HTMLElement | null;
  private slider!: SimpleSlider;
  private settingsForm!: PanelSettingsForm;

  constructor(domParent: HTMLElement) {
    this.domParent = domParent;
    this.sliderBox = this.domParent.querySelector('.js-panel__slider-box');
    this.settingsBox = this.domParent.querySelector('.js-panel__settings-box');

    this.init();
  }

  private init(): void {
    this.initSlider();
    this.initPanelSettingsForm();
    this.bindEventListener();
  }

  private initSlider(): void {
    const panelSlider = this.sliderBox?.firstElementChild as HTMLElement;
    const isPanelSlider = panelSlider !== undefined && panelSlider !== null;
    const options = this.getSliderOptions();

    if (isPanelSlider) {
      this.slider = $(panelSlider).simpleSlider(options);
    }
  }

  private initPanelSettingsForm(): void {
    const panelForm = this.settingsBox?.firstElementChild as HTMLElement;
    const isPaneForm = panelForm !== undefined && panelForm !== null;

    if (isPaneForm) {
      this.settingsForm = new PanelSettingsForm(panelForm, this.slider.options);
    }
  }

  private getSliderOptions(): IUserOptions | undefined {
    const panelSlider = this.sliderBox?.firstElementChild;
    const isPanelSlider = panelSlider !== undefined && panelSlider !== null;

    if (isPanelSlider) {
      const min = parseFloat(`${panelSlider?.getAttribute('data-min')}`);
      const max = parseFloat(`${panelSlider?.getAttribute('data-max')}`);
      const step = parseFloat(`${panelSlider?.getAttribute('data-step')}`);
      const from = parseFloat(`${panelSlider?.getAttribute('data-from')}`);
      const to = parseFloat(`${panelSlider?.getAttribute('data-to')}`);
      const type = panelSlider?.getAttribute('data-type');
      const orientation = panelSlider?.getAttribute('data-orientation');
      const withRange = panelSlider?.getAttribute('data-with-range') === 'true';
      const withThumb = panelSlider?.getAttribute('data-with-thumb') === 'true';
      const withScale = panelSlider?.getAttribute('data-with-scale') === 'true';

      const options = {
        min,
        max,
        step,
        currentValue: { from, to },
        type,
        orientation,
        withRange,
        withThumb,
        withScale,
      };

      return options as IUserOptions;
    }

    return undefined;
  }

  private bindEventListener(): void {
    const { modelOptionsChanged, currentValueChanged } = this.slider.events;

    modelOptionsChanged.subscribe(this.handleModelOptionsChange);
    currentValueChanged.subscribe(this.handleCurrentValueUpdate);
    this.settingsForm.subscribe(this.handleSettingsFormChange)
  }

  @bind
  private handleSettingsFormChange(newOptions: ICorrectOptions) {
    this.slider.updateOptions(newOptions);
  }

  @bind
  private handleModelOptionsChange(newOptions: ICorrectOptions) {
    this.settingsForm.updateOptions(newOptions);
  }

  @bind
  private handleCurrentValueUpdate(newValue: TUpdateCurrentValue) {
    this.settingsForm.updateCurrentValue(newValue);
  }
}

export default Panel;
