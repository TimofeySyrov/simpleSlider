import './index.scss';
import '../slider/index';
import '../slider/view/styles/view.scss';
import './panel/index';
import './panel/styles/view.scss';

/* Slider boxes */
const sliderBoxes_1 = {
  sliderBox: $('.js-slider__slider-box-1'),
  panelBox: $('.js-slider__panel-box-1')
};

const sliderBoxes_2 = {
  sliderBox: $('.js-slider__slider-box-2'),
  panelBox: $('.js-slider__panel-box-2')
};

const sliderBoxes_3 = {
  sliderBox: $('.js-slider__slider-box-3'),
  panelBox: $('.js-slider__panel-box-3')
};

/* Sliders */
const slider_1 = sliderBoxes_1.sliderBox.simpleSlider();
const slider_2 = sliderBoxes_2.sliderBox.simpleSlider({
  min: -10,
  max: 0,
  orientation: 'vertical',
  step: 0.01,
  type: 'from-end',
  withRange: false,
  currentValue: -7
});
const slider_3 = sliderBoxes_3.sliderBox.simpleSlider({
  min: -50,
  max: 50,
  type: 'range',
  currentValue: {
    min: -20,
    max: 20
  },
  step: 10,
  withRange: false,
  withScale: false,
  withThumb: false
});

/* Slider panels */
const panel_1 = sliderBoxes_1.panelBox.simpleSliderPanel(slider_1);
const panel_2 = sliderBoxes_2.panelBox.simpleSliderPanel(slider_2);
const panel_3 = sliderBoxes_3.panelBox.simpleSliderPanel(slider_3);