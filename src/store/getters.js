export default {
	getLists: (state) => {
		return state.storage.lists;
	},

	getTasks: (state) => {
		return state.storage.tasks;
	},
	getTasksByListId: state => data => {
		return state.storage.tasks.filter(el => el.listId === data);
	},
	getCountTasksByListId: state => data => {
		return state.storage.tasks.filter(el => el.listId === data).length;
	}
}
