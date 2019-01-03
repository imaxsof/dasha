export default {
	initState(state, data) {
		state.storage = data;
	},
	addList(state, data) {
		state.storage.lists.push(data);
	},
	addTask(state, data) {
		state.storage.tasks.push(data);
	}
}
