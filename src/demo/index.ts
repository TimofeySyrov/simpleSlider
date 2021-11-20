import '../slider/index';
import './panel/index';
import './index.scss';

/* Slider boxes */
const sliderBoxes1 = {
  sliderBox: $('.js-slider__slider-box-1'),
  panelBox: $('.js-slider__panel-box-1'),
};

const sliderBoxes2 = {
  sliderBox: $('.js-slider__slider-box-2'),
  panelBox: $('.js-slider__panel-box-2'),
};

const sliderBoxes3 = {
  sliderBox: $('.js-slider__slider-box-3'),
  panelBox: $('.js-slider__panel-box-3'),
};

/* Sliders */
const slider1 = sliderBoxes1.sliderBox.simpleSlider();
const slider2 = sliderBoxes2.sliderBox.simpleSlider({
  min: -10,
  max: 0,
  orientation: 'vertical',
  step: 0.01,
  type: 'from-end',
  withRange: false,
  currentValue: -7,
});
const slider3 = sliderBoxes3.sliderBox.simpleSlider({
  min: -50,
  max: 50,
  type: 'range',
  currentValue: {
    from: -20,
    to: 20,
  },
  step: 10,
  withRange: false,
  withScale: false,
  withThumb: false,
});

/* Slider panels */
sliderBoxes1.panelBox.simpleSliderPanel(slider1);
sliderBoxes2.panelBox.simpleSliderPanel(slider2);
sliderBoxes3.panelBox.simpleSliderPanel(slider3);
