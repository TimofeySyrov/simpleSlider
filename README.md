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
| min     | number | 0 | Задает минимальное значение слайдера |
| max     | number | 100 | Задает максимальное значение слайдера |
| currentValue     | number или { min: number, max: number } | 50 | Задает текущее значение слайдера. При одиночном интервале использует тип number или ключ min опции currentValue. При диапазоне использует тип { min: number, max: number } или тип number (в таком случае ключи min и max опции currentValue будут равны number)  |
| step | number | 1 | Задает шаг для значений слайдера |
| orientation | string | "horizontal" | Задает горизонтальный или вертикальный вид слайдера. Для горизонтального значение - "horizontal", для вертикального - "vertical" |
| type | string | "from-start" | Задает тип и сторону старта слайдера. Одиночный интервал: "from-start" - сторона старта с начала, "from-end" - сторона старта с конца. Диапазон: "range" - сторона старта с начала |
| withRange | boolean | true | Задает отображение полоски интервала слайдера |
| withThumb | boolean | true | Задает отображение подсказки у ползунков слайдера |
| withScale | boolean | true | Задает отображение шкалы значений слайдера |

   **Настройки по умолчанию:**
  > ```js
  > const defaultModelOptions = {
  >   min: 0,
  >   max: 100,
  >   step: 1,
  >   orientation: 'horizontal',
  >   type: 'from-start',
  >   currentValue: 50,
  >   withRange: true,
  >   withThumb: true,
  >   withScale: true,
  > };
  > ```

## API плагина
* `onSlide`: (callback: TUpdateCurrentValue) => void;</br></br>Это callback функция. При передвижении ползунков получает объект типа TUpdateCurrentValue = { option: 'from' | 'to', value: number };</br></br>**Пример использования:**
  > ```js
  > const myCustomSlider = $('sliderContainer').simpleSlider({
  >   onSlide: (obj) => {
  >     console.log(`Ползунок: ${obj.option}, значение: ${obj.value}`);
  >   }
  > });
  > ```
* `updateOptions` (options: IUserOptions): void;</br></br>Это публичный метод обновления опций слайдера. Не обязательно передавать новые опции со старыми, достаточно передать лишь новые опции.</br></br>**Пример использования:**
  > ```js
  > const myCustomSlider = $('sliderContainer').simpleSlider();
  > 
  > myCustomSlider.updateOptions({ type: 'from-end', withScale: false });
  > ```
* `updateCurrentValue` (newValue: TUpdateCurrentValue): void;</br></br>Это публичный метод обновления текущего значения слайдера. Метод принимает объект типа TUpdateCurrentValue = { option: 'from' | 'to', value: number };</br></br>**Пример использования:**
  > ```js
  > const myCustomSlider = $('sliderContainer').simpleSlider();
  > 
  > myCustomSlider.updateCurrentValue({ option: 'from', value: 78 });
  > ```

## UML диаграмма плагина

<img src="https://sun9-67.userapi.com/impg/lukG1fPIWwiQNSB_T0XJfSE6eA4Ug82P4QZ3wg/L6WYrzt7Wg4.jpg?size=1331x1134&quality=96&sign=81a7982ed48397f4ac62de5ed185e229&type=album" alt="plugin's UML"><img/>
</br>
**Pattern MVC with Passive View**
</br>
* **Model** хранит в себе опции и бизнес-логику приложения. Ничего не знает о слоях Controller и View. Model наследуется от класса Observer. С помощью функционала Observer, Model уведомляет, что изменился.

* **View** является пользовательским интерфейсом. View ничего не знает о слоях Controller и Model. View также, как и Model наследуется от класса Observer. View взаимодействует с пользователем и отображает получаемую информацию. С помощью функционала Observer, View уведомляет, что изменился.

* **Controller** является руководящим звеном в приложении. Controller знает о слоях Model и View, также он подписан на них. При обновлении View, Controller получает изменения и обновляет Model. Аналогично при обновлении Model, Controller получает изменения и обновляет View

* **SimpleSlider** является фасадом Controller'а. Реализует удобный интерфейс приложения.