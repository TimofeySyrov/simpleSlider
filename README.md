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

## NPM команды проекта
```js
$ npm run start  // Запуск webpack devServer
$ npm run dev  // Инициализация приложения в режиме development
$ npm run build  // Инициализация приложения в режиме production
$ npm run test  // Показать результаты всех тестов приложения с таблицей coverage 
$ npm run eslint  // Запуск eslint проверки кода приложения на требования airbnb ts
```

## Настройки
| Название  | Тип  | Значение по умолчанию | Описание |
| :------------: |:---------------:| :---------:|:--:|
| min     | number | 0 | Задает минимальное значение слайдера |
| max     | number | 100 | Задает максимальное значение слайдера |
| currentValue     | number или { from: number, to: number } | 50 | Задает текущее значение слайдера. При одиночном интервале использует тип number или ключ from опции currentValue. При диапазоне использует тип { from: number, to: number } или тип number (в таком случае ключи from и to опции currentValue будут равны number)  |
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
* `options` (): ICorrectOptions;</br></br>Это публичный метод, возвращающий опции слайдера.</br></br>**Пример использования:**
  > ```js
  > const myCustomSlider = $('sliderContainer').simpleSlider();
  > 
  > console.log(myCustomSlider.options);
  > ```
* `onSlide`: (callback: TUpdateCurrentValue) => void;</br></br>Это callback функция. При передвижении ползунков получает объект типа TUpdateCurrentValue = { option: 'from' | 'to', value: number }; Функция вызывается в объекте с настройками слайдера.</br></br>**Пример использования:**
  > ```js
  > const myCustomSlider = $('sliderContainer').simpleSlider({
  >   type: 'range',
  >   currentValue: {
  >     from: 13.5,
  >     to: 20,
  >   },
  >   onSlide: (obj) => {
  >     console.log(`Ползунок: ${obj.option}, значение: ${obj.value}`);
  >   },
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

## UML-диаграмма плагина

<img src="https://github.com/TimofeySyrov/simpleSlider/blob/master/UML%20SimpleSlider.png?raw=true" alt="plugin's UML"><img/>
</br>
**Pattern MVC with Passive View**
</br>
* **Model** хранит в себе опции и бизнес-логику приложения. Ничего не знает о слоях Controller и View. Model наследуется от класса Observer. С помощью функционала Observer, Model уведомляет, что изменился.

* **View** является пользовательским интерфейсом. View ничего не знает о слоях Controller и Model. View также, как и Model наследуется от класса Observer. View взаимодействует с пользователем и отображает получаемую информацию. С помощью функционала Observer, View уведомляет, что изменился.

* **Controller** является руководящим звеном в приложении. Controller знает о слоях Model и View, также он подписан на них. При обновлении View, Controller получает изменения и обновляет Model. Аналогично при обновлении Model, Controller получает изменения и обновляет View

* **Observer** реализует функционал наблюдаемого объекта. На объект можно подписаться и отписаться. Также можно уведомить подписчиков объекта о изменениях.

* **Bar, Range, Scale, Thumb, Toggle** являются subView компонентами. Имеют агригационные отношения с View.

* **SimpleSlider** является фасадом Controller'а. Реализует удобный интерфейс приложения.