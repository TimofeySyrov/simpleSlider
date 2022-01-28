import { bind } from 'decko';

import Options from '../../../slider/utils/interfaces/options';
import { UpdateValues } from '../../../slider/utils/types/namespace';
import SimpleSlider from '../../../slider/simpleSlider';
import '../../../slider/index';
import PanelSettingsForm from './components/panel-settings-form/PanelSettingsForm';

class Panel {
  private domParent: HTMLElement;
  private sliderBox: HTMLElement | null;
  private settingsBox: HTMLElement | null;
  private slider!: SimpleSlider;
  private settingsForm!: PanelSettingsForm;

  constructor (domParent: HTMLElement) {
    this.domParent = domParent;
    this.sliderBox = this.domParent.querySelector('.js-panel__slider-box');
    this.settingsBox = this.domParent.querySelector('.js-panel__settings-box');

    this.init();
  }

  private init (): void {
    this.initSlider();
    this.initPanelSettingsForm();
    this.bindEventListener();
  }

  private initSlider (): void {
    const panelSlider = this.sliderBox?.firstElementChild as HTMLElement;
    const isPanelSlider = panelSlider !== undefined && panelSlider !== null;
    const options = this.getSliderOptions();

    if (isPanelSlider) {
      $(panelSlider).simpleSlider(options);
      this.slider = $(panelSlider).data('simpleSlider');
    }
  }

  private initPanelSettingsForm (): void {
    const panelForm = this.settingsBox?.firstElementChild as HTMLElement;
    const isPaneForm = panelForm !== undefined && panelForm !== null;

    if (isPaneForm) {
      this.settingsForm = new PanelSettingsForm(panelForm, this.slider.options);
    }
  }

  private getSliderOptions (): Options | undefined {
    const panelSlider = this.sliderBox?.firstElementChild;
    const isPanelSlider = panelSlider !== undefined && panelSlider !== null;

    if (isPanelSlider) {
      const min = parseFloat(`${panelSlider?.getAttribute('data-min')}`);
      const max = parseFloat(`${panelSlider?.getAttribute('data-max')}`);
      const step = parseFloat(`${panelSlider?.getAttribute('data-step')}`);
      const from = parseFloat(`${panelSlider?.getAttribute('data-from')}`);
      const to = parseFloat(`${panelSlider?.getAttribute('data-to')}`);
      const direction = panelSlider?.getAttribute('data-direction');
      const orientation = panelSlider?.getAttribute('data-orientation');
      const withRange = panelSlider?.getAttribute('data-with-range') === 'true';
      const withThumb = panelSlider?.getAttribute('data-with-thumb') === 'true';
      const withScale = panelSlider?.getAttribute('data-with-scale') === 'true';

      const options = {
        min,
        max,
        step,
        from,
        to,
        direction,
        orientation,
        withRange,
        withThumb,
        withScale,
      };

      return options as Options;
    }

    return undefined;
  }

  private bindEventListener (): void {
    this.slider.subscribe('updateOptions', this.handleModelUpdateOptions);
    this.slider.subscribe('updateValues', this.handleModelValuesUpdate);
    this.settingsForm.subscribe('changeOptions', this.handleSettingsFormChange);
  }

  @bind
  private handleSettingsFormChange (newOptions: Options) {
    this.slider.updateOptions(newOptions);
  }

  @bind
  private handleModelUpdateOptions (newOptions: Options) {
    this.settingsForm.updateState(newOptions);
  }

  @bind
  private handleModelValuesUpdate ({ option, value }: UpdateValues) {
    this.settingsForm.updateState({ [option]: value });
  }
}

export default Panel;
