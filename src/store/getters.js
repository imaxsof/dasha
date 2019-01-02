export default {
	getLists: (state) => {
		return state.lists;
	},

	getTasks: (state) => {
		return state.tasks;
	},
	getTasksByListId: state => data => {
		return state.tasks.filter(el => el.listId === data);
	},
	getCountTasksByListId: state => data => {
		return state.tasks.filter(el => el.listId === data).length;
	},

	getSettings: (state) => {
		return state.settings;
	}
}
