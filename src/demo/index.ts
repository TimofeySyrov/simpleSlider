import './index.scss';

var slider = document.querySelector('.simpleSlider');

var bar = slider.querySelector('.bar');
var scale = bar.querySelector('.bar__scale');

var toggle = slider.querySelector('.toggle');
var handle = toggle.querySelector('.toggle__handle');
var thumb = toggle.querySelector('.thumb');

var ruler = slider.querySelector('.ruler');
var ruler__item = ruler.querySelector('.ruler__item');

const maxValue = 10;
const minValue = 5;
const step = 2;

function getRulerValues(): any[] {

  const midQuantity = Math.ceil((maxValue - minValue) / step);
  const viewStep = Math.ceil(midQuantity / 5) * step;
  const midArr = [];
  let value = minValue;

  for (let i = 0; value < maxValue; i += 1) {
    value += viewStep;
    if (value < maxValue) {
      midArr.push(value);
    }
  }
  
  return [minValue, ...midArr, maxValue]
}

function getRulerItemPosition(item:number) {
  const posItem = ((item - minValue) / (maxValue - minValue)) * 320;
  return posItem
}

function setRulerValues() {
  const values = getRulerValues();
  

  values.map(function(item) {
    const posX = getRulerItemPosition(item)
    ruler.innerHTML += `<li class="ruler__item" style="transform: translateX(${posX}px);">${item}</li>`;
  })
}

setRulerValues();

thumb.innerHTML = `${minValue}`;

function updateDisplay(event: MouseEvent) {
  // ПОЛУЧАЕМ ЗНАЧЕНИЯ
  var sliderWidth = bar.getBoundingClientRect().width; // длина слайдера
  var windowXSliderStart = bar.getBoundingClientRect().x; // координата X начала слайдера относительно окна пользователя
  var windowX = event.pageX; // координата X из места клика относительно окна пользователя

  // ВЫЧИСЛЯЕМ КУДА КЛИКНУЛ
  var sliderX = windowX - windowXSliderStart; // координата X из места клика относительно длины слайдера
  var procent = sliderX / sliderWidth; // sliderX переводится в проценты для transform: scale

  // ВЫЧИСЛЯЕМ currentValue относительно position
  var currentValue = step * Math.round(procent * (maxValue - minValue) / step) + minValue;

  if(procent >= 0 && procent <= 1){
    // УСТАНАВЛИВАЕМ ДЛИНУ для scale
    scale.setAttribute("style", `transform: scale(${procent}, 1);`);

    // Переносим toggle в место клика
    toggle.setAttribute("style", `transform: translateX(${sliderX}px);`);

    // Передаем currentValue в thumb
    thumb.innerHTML = `${currentValue}`;
  }
}

slider.addEventListener('click', updateDisplay);

bar.addEventListener('mousedown', e => {
  document.addEventListener('mousemove', updateDisplay);
});

toggle.addEventListener('mousedown', e => {
  document.addEventListener('mousemove', updateDisplay);
});

document.addEventListener('mouseup', e => {
  document.removeEventListener('mousemove', updateDisplay);
});