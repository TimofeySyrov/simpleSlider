# SimpleSlider (JQuery плагин)
SimpleSlider – это простой и отзывчивый слайдер диапазона. Слайдер реализован с [front-end-best-practices
](https://github.com/fullstack-development/front-end-best-practices) MetaLamp.

## Демо-страница
[Basic demo](https://timofeysyrov.github.io/simpleSlider/)

На демо-странице каждый слайдер имеет панель конфигурирования, для удобного демонстрирования вариаций настроек.

## Git клонирование и отчеты тестов
```
$ git clone https://github.com/TimofeySyrov/simpleSlider.git
$ cd simpleSlider
$ npm i && npm test
```

## Настройки
| Название  | Тип  | Значение по умолчанию | Описание |
| :------------: |:---------------:| :---------:|:--:|
| min     | number | min: 0 | Задает минимальное значение слайдера |
| max     | number | max: 100 | Задает максимальное значение слайдера |
| currentValue     | number или { min: number, max: number } | currentValue: 50 | Задает текущее значение слайдера. При одиночном интервале использует тип number или ключ min опции currentValue. При диапазоне использует тип { min: number, max: number } или тип number (в таком случае ключи min и max опции currentValue будут равны number)  |
| step | number | 1 | Задает шаг для значений слайдера |
| orientation | string | "horizontal" | Задает горизонтальный или вертикальный вид слайдера. Для горизонтального значение - "horizontal", для вертикального - "vertical" |
| type | string | "from-start" | Задает сторону начала для значений слайдера  |
| withRange | boolean | true | Задает отображение полоски интервала слайдера |
| withThumb | boolean | true | Задает отображение подсказки у ползунков слайдера |
| withScale | boolean | true | Задает отображение шкалы значений слайдера |
