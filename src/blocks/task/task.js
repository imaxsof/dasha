// Task
//------------------------------------------------------------------------------

// Выводим дела в списки
//------------------------------------------------------------------------------

function loadTask() {

	// Вычисляем последний момент прошедшей недели
	var dayNumber = new Date().getDay();

	if (dayNumber == 0) {
		dayNumber = 7;
	}

	var newDate = new Date();
	newDate.setDate(newDate.getDate() - dayNumber);
	newDate.setHours(23, 59, 59, 999);

	// Итак, последний момент прошедшей недели
	var lastMomentLastWeek = newDate.getTime();

	// Готовим новый массив для дел
	var tasksNew = [];

	// Парсим Хранилище
	var mahoweekStorage = JSON.parse(localStorage.getItem('mahoweek'));

	// Пробегаемся по каждому делу
	for (var i = 0; i < mahoweekStorage.tasks.length; i ++) {
		// Если включено удаление выполненных дел,
		// а дело было реально выполнено и его дата выполнения совпадает с условием
		if (mahoweekStorage.settings.deleteCompletedTasks && mahoweekStorage.tasks[i].completed && mahoweekStorage.tasks[i].completedTime <= lastMomentLastWeek) {
			// Переходим к следующей итерации
			continue;
		}

		// Помещаем в новый массив дела, которые остались
		tasksNew.push(mahoweekStorage.tasks[i]);

		// Заносим дело в свой список
		LIST_BOARD.find('.list[data-id="' + mahoweekStorage.tasks[i].listId + '"] .list__tasks').append(makeTask(mahoweekStorage.tasks[i].id, mahoweekStorage.tasks[i].name, mahoweekStorage.tasks[i].completed, mahoweekStorage.tasks[i].markers));

		// Находим это дело
		var task = LIST_BOARD.find('.task[data-id="' + mahoweekStorage.tasks[i].id + '"]');

		// Изменяем стиль статуса дела
		changeStyleTaskStatus(task);
	}

	// Пробегаемся по каждому списку
	for (var i = 0; i < mahoweekStorage.lists.length; i ++) {
		// Рассчитываем прогресс выполнения списка
		makeProgress(mahoweekStorage.lists[i].id);

		// Включаем сортировку дел
		sortableTask(document.querySelectorAll('.list__tasks')[i]);
	}

	// Если массив дел изменился
	if (mahoweekStorage.tasks.length != tasksNew.length) {
		// Заменяем старый массив дел на новый
		mahoweekStorage.tasks = tasksNew;

		// Обновляем Хранилище
		updateStorage(mahoweekStorage);
	}

	// Показываем содержимое доски
	$('body').addClass('ready');

	// Меняем фавиконку
	changeFavicon();

}


// Фокусируем поле добавления дела
//------------------------------------------------------------------------------

(function() {

	// Если поле добавления в фокусе
	LIST_BOARD.on('focusin', '.js-add-task', function() {
		var isThis = $(this);

		// Скроллим список к началу
		// и запрещаем скроллиться
		isThis.parents('.list').scrollLeft(0).css({
			'overflow-x': 'hidden',
			'-webkit-overflow-scrolling': 'auto'
		});
	});

	// Если поле добавления не в фокусе
	LIST_BOARD.on('focusout', '.js-add-task', function() {
		var isThis = $(this);

		// Возвращаем списку скролл
		isThis.parents('.list').css({
			'overflow-x': '',
			'-webkit-overflow-scrolling': ''
		});
	});

}());


// Добавляем дело
//------------------------------------------------------------------------------

(function() {

	LIST_BOARD.on('keyup change', '.js-add-task', function(event) {
		var isThis = $(this);

		// Если был нажат Enter и поле с делом не пустое
		// или изменились данные в поле при потере фокуса
		if (event.keyCode === 13 && isThis.val() !== '' || event.type === 'change') {
			// Получаем хеш списка, хеш дела, текст дела и метку времени
			var listId = isThis.parents('.list').attr('data-id');
			var taskId = makeHash();
			var taskName = isThis.val();
			var taskCreatedTime = new Date().getTime();

			// Парсим Хранилище
			var mahoweekStorage = JSON.parse(localStorage.getItem('mahoweek'));

			// Добавляем новое дело
			mahoweekStorage.tasks.push({
				id: taskId,
				listId: listId,
				name: taskName,
				createdTime: taskCreatedTime
			});

			// Обновляем Хранилище
			updateStorage(mahoweekStorage);

			// Стираем поле ввода добавления дела
			isThis.val('');

			// Выводим дело в списке
			isThis.parents('.list').find('.list__tasks').append(makeTask(taskId, taskName));

			// Рассчитываем прогресс выполнения списка
			makeProgress(listId);

			// Находим созданное дело
			var taskNew = isThis.parents('.list').find('.list__tasks .task:last-child');

			// Берем данные окна
			var win = $(window);

			// Если созданное дело вытесняет за рамки экрана конец списка
			if (taskNew.offset().top > win.scrollTop() + win.height() - 30 - 40 - 39) {
				// Смещаем позицию прокрутки на высоту строки дела
				win.scrollTop(win.scrollTop() + taskNew.outerHeight(true));
			}

			// Добавляем данные в Метрику
			yaCounter43856389.reachGoal('ya-add-task');
		}
	});

}());


// Изменяем статус дела
//------------------------------------------------------------------------------

(function() {

	LIST_BOARD.on('click', '.js-completed-task', function() {
		var isThis = $(this);
		var task = isThis.parents('.task');

		// Получаем хеш списка, хеш дела, метку о выполнении и дату текущего дня
		var listId = task.parents('.list').attr('data-id');
		var taskId = task.attr('data-id');
		var taskCompleted = task.hasClass('task--completed');
		var taskDateToday = task.find('.grid__date--today').attr('data-date');

		// Парсим Хранилище
		var mahoweekStorage = JSON.parse(localStorage.getItem('mahoweek'));

		// Получаем элемент дела в Хранилище
		var taskElement = mahoweekStorage.tasks.filter(function(value) {
			return value.id == taskId;
		});

		// Получаем индекс дела в Хранилище
		var taskIndex = mahoweekStorage.tasks.indexOf(taskElement[0]);

		// Если дело невыполнено
		if (!taskCompleted) {
			// Переключаем метку выполнения в сетке дат
			task.find('.grid__date--today').toggleClass('grid__date--completed');

			// Переключаем метку выполнения в хранилище
			if (task.find('.grid__date--today').hasClass('grid__date--completed')) {
				var markerAct = 'add';
			} else {
				var markerAct = 'del';
			}

			// Если дело не запланировано в будущем
			if (!task.find('.grid__date--today').nextAll('.grid__date--bull').length) {
				// Окончательно ставим метку выполнения в сетке дат и в хранилище
				task.find('.grid__date--today').addClass('grid__date--completed');
				markerAct = 'add';

				// Получаем метку времени
				var taskCompletedTime = new Date().getTime();

				// Помечаем дело как выполненное
				mahoweekStorage.tasks[taskIndex].completed = 1;
				mahoweekStorage.tasks[taskIndex].completedTime = taskCompletedTime;

				// Обновляем дело в списке
				task.addClass('task--completed');
			}

		// Если дело было выполнено
		} else {
			// Убираем метку выполнения из сетки дат
			task.find('.grid__date--today').removeClass('grid__date--completed');

			// Убираем метку выполнения в хранилище
			var markerAct = 'del';

			// Помечаем дело как невыполненное
			delete mahoweekStorage.tasks[taskIndex].completed;
			delete mahoweekStorage.tasks[taskIndex].completedTime;

			// Обновляем дело в списке
			task.removeClass('task--completed');
		}

		// Заносим изменения в массив маркеров
		// и если массива маркеров не существовало
		if (markerAct == 'add' && !mahoweekStorage.tasks[taskIndex].markers) {
			// Создаем массив маркеров и заполняем
			mahoweekStorage.tasks[taskIndex].markers = [{
				date: taskDateToday,
				completed: 1
			}];

		// Если существовало
		} else {
			// Проверяем существовала ли уже метка на это число в хранилище
			var markerElement = mahoweekStorage.tasks[taskIndex].markers.filter(function(value) {
				return value.date == taskDateToday;
			});

			// Если метка существовала
			if (markerElement != '') {
				// Получаем индекс метки
				var markerIndex = mahoweekStorage.tasks[taskIndex].markers.indexOf(markerElement[0]);

				// Если действие добавления метки
				if (markerAct == 'add') {
					// Добавляем информацию о выполнении
					mahoweekStorage.tasks[taskIndex].markers[markerIndex].completed = 1;

				// Если удаления метки
				} else {
					// Если была установлена метка,
					// то удаляем только информацию о выполнении
					if (mahoweekStorage.tasks[taskIndex].markers[markerIndex].label) {
						delete mahoweekStorage.tasks[taskIndex].markers[markerIndex].completed;

					// Иначе удаляем метку полностью
					} else {
						mahoweekStorage.tasks[taskIndex].markers.splice(markerIndex, 1);
					}
				}

			// Если метка не существовала
			} else {
				// Если действие добавления метки
				if (markerAct == 'add') {
					// Добавляем метку только с информацией о выполнении
					mahoweekStorage.tasks[taskIndex].markers.push({
						date: taskDateToday,
						completed: 1
					});
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
	});

}());


// Сохраняем текст дела при изменении
//------------------------------------------------------------------------------

(function() {

	LIST_BOARD.on('keyup change', '.js-edit-task', function(event) {
		var isThis = $(this);

		// Если был нажат Enter или пропал фокус и были изменения
		if (event.keyCode == 13 || event.type == 'change') {
			// Получаем хеш и текст дела
			var taskId = isThis.parents('.task').attr('data-id');
			var taskName = isThis.val();

			// Парсим Хранилище
			var mahoweekStorage = JSON.parse(localStorage.getItem('mahoweek'));

			// Получаем элемент дела в Хранилище
			var taskElement = mahoweekStorage.tasks.filter(function(value) {
				return value.id == taskId;
			});

			// Получаем индекс дела в Хранилище
			var taskIndex = mahoweekStorage.tasks.indexOf(taskElement[0]);

			// Изменяем текст дела
			mahoweekStorage.tasks[taskIndex].name = taskName;

			// Обновляем Хранилище
			updateStorage(mahoweekStorage);

			// Убираем фокус с этого поля
			isThis.blur();
		}
	});

}());


// Удаляем дело
//------------------------------------------------------------------------------

(function() {

	LIST_BOARD.on('click', '.js-remove-task', function() {
		var isThis = $(this);

		// Получаем хеш списка, хеш дела и метку о выполнении
		var listId = isThis.parents('.list').attr('data-id');
		var taskId = isThis.parents('.task').attr('data-id');
		var taskCompleted = isThis.parents('.task').hasClass('task--completed');

		// Если дело не выполнено
		if (!taskCompleted) {
			// Задаем вопрос
			var question = confirm('Дело ещё не выполнено, но будет удалено');
		}

		// Если дело выполнено
		// или ответом на вопрос было «Да»
		if (taskCompleted || question) {
			// Парсим Хранилище
			var mahoweekStorage = JSON.parse(localStorage.getItem('mahoweek'));

			// Получаем элемент дела в хранилище
			var taskElement = mahoweekStorage.tasks.filter(function(value) {
				return value.id == taskId;
			});

			// Получаем индекс дела в Хранилище
			var taskIndex = mahoweekStorage.tasks.indexOf(taskElement[0]);

			// Удаляем дело
			mahoweekStorage.tasks.splice(taskIndex, 1);

			// Обновляем Хранилище
			updateStorage(mahoweekStorage);

			// Удаляем дело из списка
			isThis.parents('.task').remove();

			// Рассчитываем прогресс выполнения списка
			makeProgress(listId);

			// Меняем фавиконку
			changeFavicon();

			// Добавляем данные в Метрику
			yaCounter43856389.reachGoal('ya-remove-task');
		}
	});

}());


// Сортируем вручную дела
//------------------------------------------------------------------------------

function sortableTask(element) {

	Sortable.create(element, {
		group: 'group',
		delay: SPEED,
		animation: (SPEED / 2),
		handle: '.task__name',
		filter: '.task__input',
		preventOnFilter: false,
		ghostClass: 'task--ghost',
		chosenClass: 'task--chosen',
		dragClass: 'task--drag',
		forceFallback: true,
		fallbackClass: 'task--fallback',
		fallbackOnBody: true,
		scrollSensitivity: 100,
		onChoose: function() {
			// Добавляем класс, что выполняется сортировка
			LIST_BOARD.addClass('board__lists--drag');
		},
		onEnd: function() {
			// Удаляем класс, что выполняется сортировка
			LIST_BOARD.removeClass('board__lists--drag');
		},
		onSort: function(event) {
			// Получаем хеш листа и хеш текущего дела
			var listId = event.item.parentElement.parentElement.attributes['data-id'].value;
			var taskId = event.item.attributes['data-id'].value;

			// Парсим Хранилище
			var mahoweekStorage = JSON.parse(localStorage.getItem('mahoweek'));

			// Получаем элемент дела в Хранилище
			var taskElement = mahoweekStorage.tasks.filter(function(value) {
				return value.id == taskId;
			});

			// Получаем индекс дела в Хранилище
			var taskIndex = mahoweekStorage.tasks.indexOf(taskElement[0]);

			// Изменяем хеш листа дела
			mahoweekStorage.tasks[taskIndex].listId = listId;

			// Получаем удаленный элемент
			var taskRemove = mahoweekStorage.tasks.splice(taskIndex, 1)[0];

			// Если дело помещено в самое начало списка
			if (event.newIndex === 0) {
				// Сортируем
				mahoweekStorage.tasks.splice(0, 0, taskRemove);

			// Если дело помещено в середину списка
			} else {
				// Получаем хеш дела выше текущего
				var taskPrevId = event.item.previousElementSibling.attributes['data-id'].value;

				// Получаем элемент дела в Хранилище
				var taskPrevElement = mahoweekStorage.tasks.filter(function(value) {
					return value.id == taskPrevId;
				});

				// Получаем индекс дела в Хранилище
				var taskPrevIndex = mahoweekStorage.tasks.indexOf(taskPrevElement[0]);

				// Сортируем
				mahoweekStorage.tasks.splice((taskPrevIndex + 1), 0, taskRemove);
			}

			// Обновляем Хранилище
			updateStorage(mahoweekStorage);
		},
		onAdd: function(event) {
			// Получаем хеш листа в который перенесли дело
			var listId = event.to.parentElement.attributes['data-id'].value;

			// Рассчитываем прогресс выполнения списка
			makeProgress(listId);
		},
		onRemove: function(event) {
			// Получаем хеш листа из которого перенесли дело
			var listId = event.from.parentElement.attributes['data-id'].value;

			// Рассчитываем прогресс выполнения списка
			makeProgress(listId);
		}
	});

}


// Работаем со стилем статуса дела
//------------------------------------------------------------------------------

function changeStyleTaskStatus(task) {

	// Если у дела есть невыполненные метки за прошедшие дни
	// и если дело не было выполненным сегодня,
	// а так же если последняя метка точно о пропуске
	if (task.find('.grid__date.grid__date--past.grid__date--bull:not(.grid__date--completed)').length && !task.find('.grid__date.grid__date--today.grid__date--completed').length && task.find('.grid__date.grid__date--past.grid__date--bull:not(.grid__date--completed):last').index() > task.find('.grid__date.grid__date--past.grid__date--completed:last').index()) {
		// Помечаем дело как невыполненное
		task.addClass('task--past');
	} else {
		// Размечаем дело как невыполненное
		task.removeClass('task--past');
	}

	// Если у дела есть метка на любой будущий день
	if (task.find('.grid__date:not(.grid__date--past):not(.grid__date--completed).grid__date--bull').length) {
		// Помечаем дело как намеченное
		task.addClass('task--bull');
	} else {
		// Размечаем дело как намеченное
		task.removeClass('task--bull');
	}

	// Если у дела есть метка на сегодняшний день и она невыполнена
	if (task.find('.grid__date--today.grid__date--bull:not(.grid__date--completed)').length) {
		// Помечаем дело как сегодняшнее
		task.addClass('task--today');
	} else {
		// Размечаем дело как сегодняшнее
		task.removeClass('task--today');
	}

}


// Форматируем текст дела
//------------------------------------------------------------------------------

function remakeTaskName(name) {

	var remakeName = name;

	// Работаем с УРЛ
	if (/https:\/\/mahoweek\.ru\/#/.test(name)) {
		remakeName = remakeName.replace(/(https:\/\/)(mahoweek\.ru\/#)([\S]+[^ ,\.!])/ig, '<a href="#$3" class="cartonbox" data-cb-type="inline" data-cb-hash="$3"><span class="hidden">$1</span>$2$3</a>');
	} else {
		remakeName = remakeName.replace(/(http(s)?:\/\/(www\.)?)([\S]+[^ ,\.!])/ig, '<a href="$1$4" class="js-link-task" target="_blank" rel="noopener noreferrer"><span class="hidden">$1</span>$4</a>');
	}

	// Работаем с временем
	remakeName = remakeName.replace(/(.+)?(\s)?((2[0-3]|[0-1]\d):([0-5]\d))(\s)?(.+)?/ig, '<span class="task__time">$3</span> $1$7').trim();

	// Работаем с важностью
	if (/[!]{1,}/.test(name)) {
		remakeName = '<strong>' + remakeName + '</strong>';
	}

	// Выводим отформатированный текст
	return remakeName;

}


// Генерируем дело
//------------------------------------------------------------------------------

function makeTask(id, name, completed, markers) {

	// Определяем статус дела
	if (completed == 1) {
		var completed = ' task--completed';
	} else {
		var completed = '';
	}

	// Генерируем код
	return '' +
	'<div class="task' + completed + '" data-id="' + id + '">' +
		'<div class="task__wrap">' +
			'<div class="task__status">' +
				'<button type="button" class="task__check  js-completed-task" aria-label="Отметить"></button>' +
			'</div>' +
			'<div class="task__name  js-name">' +
				remakeTaskName(name) +
			'</div>' +
			'<div class="task__options">' +
				'<button type="button" class="task__trash  js-remove-task" aria-label="Удалить">' +
					'<svg>' +
						'<use xlink:href="#icon-trash"></use>' +
					'</svg>' +
				'</button>' +
			'</div>' +
		'</div>' +
		'<div class="task__grid  grid">' +
			makeGrid('task', markers) +
		'</div>' +
	'</div>';

}
