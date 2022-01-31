import { bind } from 'decko';

import Options from '../../../slider/utils/interfaces/options';
import { UpdateValues } from '../../../slider/utils/types/namespace';
import SimpleSlider from '../../../slider/simpleSlider';
import '../../../slider/index';
import PanelSlider from './components/panel-slider/PanelSlider';
import PanelSettingsForm from './components/panel-settings-form/PanelSettingsForm';

class Panel {
  private domParent: HTMLElement;
  private sliderBox: HTMLElement | null;
  private settingsBox: HTMLElement | null;
  private settingsForm!: PanelSettingsForm;
  private slider!: SimpleSlider;

  constructor (domParent: HTMLElement) {
    this.domParent = domParent;
    this.sliderBox = this.domParent.querySelector('.js-panel__slider-box');
    this.settingsBox = this.domParent.querySelector('.js-panel__settings-box');

    this.init();
  }

  private init (): void {
    this.initPanelSlider();
    this.initPanelSettingsForm();
    this.bindEventListener();
  }

  private initPanelSlider (): void {
    const { sliderBox } = this;
    const hasSliderBox = sliderBox !== undefined && sliderBox !== null;

    if (hasSliderBox) {
      const panelSlider = new PanelSlider(sliderBox);
      const panelSliderDom = panelSlider.getDom();
      const hasPanelSliderDom = panelSliderDom !== undefined && panelSliderDom !== null;
      
      if (hasPanelSliderDom) {
        this.slider = $(panelSliderDom).data('simpleSlider');
      }
    }
  }

  private initPanelSettingsForm (): void {
    const { settingsBox } = this;
    const hasSettingsBox = settingsBox !== undefined && settingsBox !== null;

    if (hasSettingsBox) {
      this.settingsForm = new PanelSettingsForm(settingsBox, this.slider.options);
    }
  }

  private bindEventListener (): void {
    this.slider.subscribe('updateOptions', this.handleSliderUpdateOptions);
    this.slider.subscribe('updateValues', this.handleSliderUpdateValues);
    this.settingsForm.subscribe('changeOptions', this.handleSettingsFormChangeOptions);
  }

  @bind
  private handleSettingsFormChangeOptions (newOptions: Options) {
    this.slider.updateOptions(newOptions);
  }

  @bind
  private handleSliderUpdateOptions (newOptions: Options) {
    this.settingsForm.updateState(newOptions);
  }

  @bind
  private handleSliderUpdateValues ({ option, value }: UpdateValues) {
    this.settingsForm.updateState({ [option]: value });
  }
}

export default Panel;
