export default {
	addList(state, data) {
		state.lists.push(data);
	},
	addTask(state, data) {
		state.tasks.push(data);
	}
}
