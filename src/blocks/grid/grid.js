// Grid
//------------------------------------------------------------------------------

// Добавляем/убираем метку
//------------------------------------------------------------------------------

(function($) {

	LIST_BOARD.on('mousedown click', '.js-marker-task:not(.grid__date--past):not(.grid__date--completed)', function(event) {
		var isThis = $(this);

		// Получаем дело и дату
		var task = isThis.parents('.task');
		var taskDate = isThis.attr('data-date');

		// Если метка ставилась при добавлении дела
		if (task.hasClass('task--filled') && event.type === 'mousedown') {
			// Запоминаем метку для нового дела
			localStorage.setItem('mwTempNewTaskMarker', taskDate);

		// Если метка ставилась у существующего дела
		} else if (!task.hasClass('task--add') && event.type === 'click') {
			// Получаем хеш списка и хеш дела
			var listId = isThis.parents('.list').attr('data-id');
			var taskId = task.attr('data-id');

			// Парсим Хранилище
			var mahoweekStorage = JSON.parse(localStorage.getItem('mwStorage'));

			// Получаем элемент дела в Хранилище
			var taskElement = mahoweekStorage.tasks.filter(function(value) {
				return value.id == taskId;
			});

			// Получаем индекс дела в Хранилище
			var taskIndex = mahoweekStorage.tasks.indexOf(taskElement[0]);

			// Если массива маркеров не существовало
			if (!mahoweekStorage.tasks[taskIndex].markers) {
				// Создаем массив маркеров и заполняем
				mahoweekStorage.tasks[taskIndex].markers = [{
					date: taskDate,
					label: 'bull'
				}];

				// Добавляем метку в сетку дат
				isThis.addClass('grid__date--bull');

				// Если дело было выполнено
				if (task.hasClass('task--completed')) {
					// Помечаем дело как невыполненное
					delete mahoweekStorage.tasks[taskIndex].completed;
					delete mahoweekStorage.tasks[taskIndex].completedTime;

					// Обновляем дело в списке
					task.removeClass('task--completed');
				}

			// Если существовало
			} else {
				// Проверяем существовала ли уже метка на это число
				var markerElement = mahoweekStorage.tasks[taskIndex].markers.filter(function(value) {
					return value.date == taskDate;
				});

				// Если метка существовала
				if (markerElement != '') {
					// Получаем индекс метки
					var markerIndex = mahoweekStorage.tasks[taskIndex].markers.indexOf(markerElement[0]);

					// Удаляем метку
					mahoweekStorage.tasks[taskIndex].markers.splice(markerIndex, 1);

					// Убираем метку из сетки дат
					isThis.removeClass('grid__date--bull');

				// Если метка не существовала
				} else {
					// Добавляем метку
					mahoweekStorage.tasks[taskIndex].markers.push({
						date: taskDate,
						label: 'bull'
					});

					// Добавляем метку в сетку дат
					isThis.addClass('grid__date--bull');

					// Если дело было выполнено
					if (task.hasClass('task--completed')) {
						// Помечаем дело как невыполненное
						delete mahoweekStorage.tasks[taskIndex].completed;
						delete mahoweekStorage.tasks[taskIndex].completedTime;

						// Обновляем дело в списке
						task.removeClass('task--completed');
					}
				}
			}

			// Обновляем Хранилище
			updateStorage(mahoweekStorage);

			// Изменяем стиль статуса дела
			changeStyleTaskStatus(task);

			// Рассчитываем прогресс выполнения списка
			makeProgress(listId);

			// Меняем фавиконку
			changeFavicon();
		}
	});

}(jQuery));


// Генерируем сетку дат
//------------------------------------------------------------------------------

function makeGrid(type, data) {
	// Создаем объект с официальными и неофициальными
	// праздниками и праздничными днями РФ
	var holidays = {
		// "2019-01-01": {
		// 	icon: "🎅",
		// 	title: "Новый год, праздничный день",
		// 	dayoff: true
		// },
		// "2019-01-02": {
		// 	title: "Праздничный день",
		// 	dayoff: true
		// },
		// "2019-01-03": {
		// 	title: "Праздничный день",
		// 	dayoff: true
		// },
		// "2019-01-04": {
		// 	title: "Праздничный день",
		// 	dayoff: true
		// },
		// "2019-01-05": {
		// 	title: "Праздничный день (выходной перенесён на 2 мая)",
		// 	dayoff: true
		// },
		// "2019-01-06": {
		// 	title: "Праздничный день (выходной перенесён на 3 мая)",
		// 	dayoff: true
		// },
		// "2019-01-07": {
		// 	icon: "👼",
		// 	title: "Рождество Христово, праздничный день",
		// 	dayoff: true
		// },
		// "2019-01-08": {
		// 	title: "Праздничный день",
		// 	dayoff: true
		// },
		// "2019-01-13": {
		// 	icon: "🎄",
		// 	title: "Старый Новый год"
		// },
		// "2019-01-25": {
		// 	icon: "🎓",
		// 	title: "Татьянин день"
		// },
		"2019-02-02": {
			icon: "🐹",
			title: "День сурка"
		},
		"2019-02-14": {
			icon: "❤",
			title: "День всех влюблённых"
		},
		"2019-02-22": {
			title: "Сокращённый рабочий день",
			dayoff: false
		},
		"2019-02-23": {
			icon: "💪",
			title: "День защитника Отечества, праздничный день (выходной перенесён на 10 мая)",
			dayoff: true
		},
		"2019-03-01": {
			icon: "🌷",
			title: "Первый день весны"
		},
		"2019-03-07": {
			title: "Сокращённый рабочий день",
			dayoff: false
		},
		"2019-03-08": {
			icon: "👩",
			title: "Международный женский день, праздничный день",
			dayoff: true
		},
		"2019-03-10": {
			icon: "🌞",
			title: "Масленица"
		},
		"2019-03-17": {
			icon: "🍀",
			title: "День святого Патрика"
		},
		// "2018-04-01": {
		// 	icon: "😄",
		// 	title: "День смеха"
		// },
		// "2018-04-08": {
		// 	icon: "🐇",
		// 	title: "Пасха"
		// },
		// "2018-04-12": {
		// 	icon: "🚀",
		// 	title: "День космонавтики"
		// },
		// "2018-04-28": {
		// 	title: "Сокращённый рабочий день (выходной перенесён на 30 апреля)",
		// 	dayoff: false
		// },
		// "2018-04-30": {
		// 	title: "Праздничный день (выходной за счёт 28-го апреля)",
		// 	dayoff: true
		// },
		// "2018-05-01": {
		// 	icon: "🌷",
		// 	title: "Праздник Весны и Труда, праздничный день",
		// 	dayoff: true
		// },
		// "2018-05-02": {
		// 	title: "Праздничный день (выходной за счёт 7-го января)",
		// 	dayoff: true
		// },
		// "2018-05-08": {
		// 	title: "Сокращённый рабочий день",
		// 	dayoff: false
		// },
		// "2018-05-09": {
		// 	icon: "🎆",
		// 	title: "День Победы, праздничный день",
		// 	dayoff: true
		// },
		// "2018-06-01": {
		// 	icon: "👶",
		// 	title: "Международный день защиты детей",
		// },
		// "2018-06-09": {
		// 	title: "Сокращённый рабочий день (выходной перенесён на 11 июня)",
		// 	dayoff: false
		// },
		// "2018-06-11": {
		// 	title: "Праздничный день (выходной за счёт 9-го июня)",
		// 	dayoff: true
		// },
		// "2018-06-12": {
		// 	icon: "🇷🇺",
		// 	title: "День России, праздничный день",
		// 	dayoff: true
		// },
		// "2018-09-01": {
		// 	icon: "📚",
		// 	title: "День Знаний"
		// },
		// "2018-09-03": {
		// 	icon: "",
		// 	title: "Перевернуть календарь"
		// },
		"2019-09-13": {
			icon: "😈",
			title: "Пятница 13"
		},
		// "2018-10-31": {
		// 	icon: "🎃",
		// 	title: "Хэллоуин"
		// },
		// "2018-11-04": {
		// 	icon: "✊",
		// 	title: "День народного единства, праздничный день (выходной перенесён на 5 ноября)",
		// 	dayoff: true
		// },
		// "2018-11-05": {
		// 	title: "Праздничный день (выходной за счёт 4-го ноября)",
		// 	dayoff: true
		// },
		// "2018-11-25": {
		// 	icon: "👩",
		// 	title: "День матери"
		// },
		// "2018-12-01": {
		// 	icon: "",
		// 	title: "Всемирный день борьбы со СПИДом"
		// },
		"2019-12-13": {
			icon: "😈",
			title: "Пятница 13"
		},
		// "2018-12-29": {
		// 	title: "Сокращённый рабочий день (выходной перенесён на 31 декабря)",
		// 	dayoff: false
		// },
		// "2018-12-31": {
		// 	title: "Праздничный день (выходной за счёт 29-го декабря)",
		// 	dayoff: true
		// }
	}

	// Получаем метку реального времени
	var date = new Date();

	// Вычисляем номер дня
	var dayNumber = date.getDay();

	// Задаем воскресенью порядковый номер 7
	if (dayNumber == 0) {
		dayNumber = 7;
	}

	// Делаем по умолчанию день прошедший
	var past = 1;

	// Работаем с data
	if (data) {
		// Создаем объект с метками
		var markerList = {};

		// Добавляем метки в объект
		for (var i = 0; i < data.length; i ++) {
			var key = data[i].date;
			markerList[key] = data[i].label + '|' + (data[i].completed ? 1 : 0);
		}
	}

	// Начинаем генерировать дни
	var grid = '';

	// Генерируем каждый день,
	// причем сдвигаем дни недели если неделя закончилась
	for (var i = 1 - dayNumber; i <= 14 - dayNumber; i ++) {
		// Определяем переменные
		var dateClass = '';
		var newDate = new Date();
		var time = newDate.setDate(date.getDate() + i);
		var day = newDate.getDate(time);
		var newDayNumber = newDate.getDay();
		var dataDate = makeDate(time, 'grid');

		// Определяем текущий день
		if (date.getDate() == day) {
			dateClass += ' grid__date--today';

			// Меняем все последующие дни на непрошедшие
			past = 0;
		}

		// Определяем прошедшие дни
		if (past) {
			dateClass += ' grid__date--past';
		}

		// Если это шапка списка
		if (type == 'list') {
			if (dataDate in holidays) {
				// Определяем выходной ли или праздничный день
				if (holidays[dataDate].dayoff || ((newDayNumber === 6 || newDayNumber === 0) && holidays[dataDate].dayoff !== false)) {
					dateClass += ' grid__date--holiday';
				} else {
					dateClass += '';
				}

				// Выводим день
				grid += '<div class="grid__date' + dateClass + '" title="' + holidays[dataDate].title + '">' + (holidays[dataDate].icon !== undefined ? holidays[dataDate].icon : day) + '</div>';
			} else {
				// Определяем выходной ли день
				if (newDayNumber == 6 || newDayNumber == 0) {
					dateClass += ' grid__date--holiday';
				}

				// Выводим день
				grid += '<div class="grid__date' + dateClass + '">' + day + '</div>';
			}

		// Если это дело
		} else if (type == 'task') {
			// Если у дела есть метки
			if (markerList) {
				// Смотрим есть ли метка на этот день
				if (dataDate in markerList) {
					// Смотрим есть ли конкретно метка
					if (markerList[dataDate].split('|')[0] == 'bull') {
						dateClass += ' grid__date--bull';
					}

					// Смотрим выполнено ли дело в этот день
					if (markerList[dataDate].split('|')[1] == 1) {
						dateClass += ' grid__date--completed';
					}
				}
			}

			if (past) {
				// Выводим прошедший день
				grid += '<div class="grid__date' + dateClass + '"></div>';
			} else {
				// Выводим день настоящий или будущий
				grid += '<button type="button" class="grid__date  js-marker-task' + dateClass + '" data-date="' + dataDate +'" aria-label="Добавить или снять метку" ></button>';
			}
		}
	}

	// Выводим дни
	return grid;
}
