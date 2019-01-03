function makeHash() {
	let hash = '';
	let possible = '0123456789abcdefghijklmnopqrstuvwxyz';

	for (let i = 0; i < 8; i ++) {
		hash += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return hash;
}

const listId = makeHash();

export default {
	storage: {
		lists: [
			{
				id: listId,
				name: 'Краткосрочный план дел'
			}
		],
		tasks: [
			{
				id: makeHash(),
				listId: listId,
				name: '21:00 Прочитать справку о сайте: https://mahoweek.com/#about!'
			}, {
				id: makeHash(),
				listId: listId,
				name: 'Посмотреть как здесь всё устроено: https://mahoweek.com/#tour'
			}, {
				id: makeHash(),
				listId: listId,
				name: 'Настроить вид и синхронизацию: https://mahoweek.com/#settings'
			}, {
				id: makeHash(),
				listId: listId,
				name: 'Добавить в список ближайшие дела'
			}, {
				id: makeHash(),
				listId: listId,
				name: 'Наметить на календарной сетке даты выполнения задач'
			}
		]
	}
}
