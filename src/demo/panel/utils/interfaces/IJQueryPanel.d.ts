import SimpleSlider from '../../../../slider/simpleSlider';
import SimpleSliderPanel from '../../SimpleSliderPanel';

declare global {
  interface JQuery {
    simpleSliderPanel(slider: SimpleSlider): SimpleSliderPanel;
  }
}
