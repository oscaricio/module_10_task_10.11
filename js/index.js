// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);

/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
const display = () => {
  // TODO: очищаем fruitsList от вложенных элементов,
  // чтобы заполнить актуальными данными из fruits
  fruitsList.innerHTML = '';

  for (let i = 0; i < fruits.length; i++) {
    // TODO: формируем новый элемент <li> при помощи document.createElement,
    // и добавляем в конец списка fruitsList при помощи document.appendChild
    let listItem = document.createElement('li'),
        itemInfo = document.createElement('div'),
        fruit = fruits[i],
        classNameColor = '',
        node = document.createElement('div'),
        textNode = document.createTextNode(`index: ${i}`);

    listItem.className ='fruit__item';
    itemInfo.className = 'fruit__info';
    // itemInfo.innerHTML = `<div>index: ${i}</div>`;

    node.append(textNode);
    itemInfo.append(node);

    Object.entries(fruit).forEach((item, index) => {
      // console.log(item, index)
      let node = document.createElement('div'),
          textNode = document.createTextNode(`${item[0]}${item[0]==='weight'?' (кг)':''}: ${item[1]}`);
      // node.innerText = `${item[0]}${item[0]==='weight'?' (кг)':''}: ${item[1]}`;
      node.append(textNode);
      itemInfo.append(node);
    });

    switch (fruit.color) {
      case 'фиолетовый':
        classNameColor = 'violet';
        break;
      case 'зеленый':
        classNameColor = 'green';
        break;
      case 'розово-красный':
        classNameColor = 'carmazin';
        break;
      case 'желтый':
        classNameColor = 'yellow';
        break;
      case 'светло-коричневый':
        classNameColor = 'lightbrown';
        break;
    }

    listItem.classList.add('fruit_' + classNameColor);
    listItem.append(itemInfo);
    fruitsList.append(listItem);

    // <li className="fruit__item fruit_violet">
    //   <div className="fruit__info">
    //     <div>index: 0</div>
    //     <div>kind: Мангустин</div>
    //     <div>color: фиолетовый</div>
    //     <div>weight (кг): 13</div>
    //   </div>
    // </li>
  }
};

// первая отрисовка карточек
display();

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = () => {
  let result = [],
      index = 0,
      arrTempFruits = fruits.slice(),
      bIdentity = true;

  // ATTENTION: сейчас при клике вы запустите бесконечный цикл и браузер зависнет
  while (fruits.length > 0) {
    // TODO: допишите функцию перемешивания массива
    //
    // Подсказка: находим случайный элемент из fruits, используя getRandomInt
    // вырезаем его из fruits и вставляем в result.
    // ex.: [1, 2, 3], [] => [1, 3], [2] => [3], [2, 1] => [], [2, 1, 3]
    // (массив fruits будет уменьшатся, а result заполняться)

    index = getRandomInt(0, fruits.length-1);
    result.push(fruits[index]);
    fruits.splice(index, 1);
  }

  for (let i = 0; i < arrTempFruits.length; i++) {
    Object.keys(arrTempFruits[i]).forEach((key) => {
      if (arrTempFruits[i][key] !== result[i][key])
        bIdentity = false;
    });
    if (!bIdentity) break;
  }

  if (bIdentity) {
    alert('Предупреждаем! Порядок не изменился!')
  }
  fruits = result;
};

shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  display();
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => {
  fruits = fruits.filter((item) => {
    // TODO: допишите функцию
    const minVal = parseInt(document.getElementsByClassName('minweight__input')[0].value),
          maxVal = parseInt(document.getElementsByClassName('maxweight__input')[0].value);

    if (!isNaN(minVal) && !isNaN(maxVal) && minVal <= maxVal) {
      // console.log(1);
      return item.weight >= minVal && item.weight <= maxVal;
    }
    else if (!isNaN(minVal) && isNaN(maxVal)) {
      // console.log(2);
      return item.weight >= minVal;
    }
    else if (isNaN(minVal) && !isNaN(maxVal)) {
      // console.log(3);
      return item.weight <= maxVal;
    }
    else {
      // console.log(4);
      return true;
    }
  });
};

filterButton.addEventListener('click', () => {
  filterFruits();
  display();
});

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

const comparationColor = (a, b) => {
  // TODO: допишите функцию сравнения двух элементов по цвету
  console.log(a, b)
  const priority = ['красный', 'оранжевый', 'желтый', 'зеленый', 'голубой', 'синий', 'фиолетовый'];
  // Те, что не в массиве приоритетов - в конец большим индексом
  //const priority1 = priority.indexOf(a.color) === -1 ? priority.length + 1 : priority.indexOf(a.color);
  //const priority2 = priority.indexOf(b.color) === -1 ? priority.length + 1 : priority.indexOf(b.color);

  // Доработал логику.
  // Если оба значения отсутствуют в массиве приоритетов,
  let priority1, priority2;
  if (priority.indexOf(a.color) === -1 && priority.indexOf(b.color) === -1) {
    // то сравниваем их как строки
    priority1 = a.color;
    priority2 = b.color;
  } else {
    // иначе сравниваем по индексу из массива приоритетов.
    // Если одного из значения нет в массиве приоритетов, отправляем его в конец
    priority1 = priority.indexOf(a.color) === -1 ? priority.length + 1 : priority.indexOf(a.color);
    priority2 = priority.indexOf(b.color) === -1 ? priority.length + 1 : priority.indexOf(b.color);
  }


  return priority1 > priority2;
};

const sortAPI = {
  bubbleSort(arr, comparation) {
    // TODO: допишите функцию сортировки пузырьком
    let n = arr.length;
    if (n > 0) {
      // внешняя итерация по элементам
      for (let i = 0; i < n - 1; i++) {
        // внутренняя итерация для перестановки элемента в конец массива
        for (let j = 0; j < n - 1 - i; j++) {
          // сравниваем элементы
          if (comparation(arr[j], arr[j + 1])) {
            // делаем обмен элементов
            let temp = arr[j + 1];
            arr[j + 1] = arr[j];
            arr[j] = temp;
          }
        }
      }
    }
  },

  quickSort(arr, comparation) {
    // TODO: допишите функцию быстрой сортировки
    //console.log(arr)
    function quickSortFun(arr) {
      if (arr.length < 2) return arr; // нет смысла перебирать, если элементов меньше 2

      let pivot = arr[0]; //берем первый элемент массива как опорный

      // будущие левые и правые части массива
      const left = [];
      const right = [];

      // перебираем весь массив по порядку
      for (let i = 1; i < arr.length; i++) {
        // используя наш метод сравнения по цвету сравниваем,
        // если опорный элемент больше текущего
        if (comparation(pivot, arr[i])) {
          // то добавляем текущий элемент в левую часть
          left.push(arr[i]);
          // в противном случае
        } else {
          // добавляем текущий элемент в правую часть
          right.push(arr[i]);
        }
      }
      //console.log(arr);
      // отправляем на рекурсивную обработку левую и правую части массива
      // и возвращаем результат в виде двух склеенных массивов
      return quickSortFun(left).concat(pivot, quickSortFun(right));

    }
    fruits = quickSortFun(arr);
  },

  // выполняет сортировку и производит замер времени
  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  // TODO: переключать значение sortKind между 'bubbleSort' / 'quickSort'
  sortKind = sortKind === 'bubbleSort' ? 'quickSort' : 'bubbleSort';
  sortKindLabel.textContent = sortKind;
});

sortActionButton.addEventListener('click', () => {
  // TODO: вывести в sortTimeLabel значение 'sorting...'
  sortTimeLabel.textContent = 'sorting...';
  const sort = sortAPI[sortKind];
  sortAPI.startSort(sort, fruits, comparationColor);
  display();
  // TODO: вывести в sortTimeLabel значение sortTime
  sortTimeLabel.textContent = sortTime;
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
  // TODO: создание и добавление нового фрукта в массив fruits
  // необходимые значения берем из kindInput, colorInput, weightInput
  if (!kindInput.value.length || !colorInput.value.length || !weightInput.value.length) {
    alert('Не все поля заполнены! Добавить фрукт не получится!');
    return;
  }
  let newFruit = {"kind": kindInput.value, "color": colorInput.value, "weight": weightInput.value};
  fruits.push(newFruit);
  display();
});
