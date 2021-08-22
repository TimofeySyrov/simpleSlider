import './index.scss';

var slider = document.querySelector('.simpleSlider');

var bar = slider.querySelector('.bar');
var scale = bar.querySelector('.bar__scale');

var toggle = slider.querySelector('.toggle');
var handle = toggle.querySelector('.toggle__handle');
var thumb = toggle.querySelector('.thumb');

var ruler = slider.querySelector('.ruler');

const maxValue = 100;
const minValue = 0;

function updateDisplay(event: any) {

  // ПОЛУЧАЕМ ЗНАЧЕНИЯ
  var sliderWidth = bar.getBoundingClientRect().width; // длина слайдера
  var windowXSliderStart = bar.getBoundingClientRect().x; // координата X начала слайдера относительно окна пользователя
  var windowX = event.pageX; // координата X из места клика относительно окна пользователя

  // ВЫЧИСЛЯЕМ КУДА КЛИКНУЛ
  var sliderX = (windowX - windowXSliderStart); // координата X из места клика относительно длины слайдера
  var procent = ((sliderX / sliderWidth)); // sliderX переводится в проценты для transform: scale

  if((procent*100) >= minValue && (procent*100) <= maxValue){
    // УСТАНАВЛИВАЕМ ДЛИНУ
    scale.setAttribute("style", `transform: scale(${procent}, 1);`);

    // Переносим toggle в место клика
    toggle.setAttribute("style", `transform: translateX(${sliderX}px);`);

    // ВЫЧИСЛЯЕМ ЗНАЧЕНИЕ КООРДИНАТЫ ОТНОСИТЕЛЬНО ДЛИНЫ
    var currentValue = Math.floor(maxValue * procent);

    // Передаем current value в thumb
    thumb.innerHTML = `${currentValue}`;
  }

  // // ТЕСТ
  // console.log('')
  // console.log(`/ Длина слайдера: ${sliderWidth}px`)
  // console.log(`| Начало слайдера: ${windowXSliderStart}px`)
  // console.log(`| Клик относительно окна: ${windowX}px`)
  // console.log(`| Клик относительно слайдера: ${sliderX}px`)
  // console.log(`| Процент длины для scale: ${procent}`)
}

slider.addEventListener('click', updateDisplay);

slider.addEventListener('mousedown', e => {
  document.addEventListener('mousemove', updateDisplay);
});

document.addEventListener('mouseup', e => {
  document.removeEventListener('mousemove', updateDisplay);
});