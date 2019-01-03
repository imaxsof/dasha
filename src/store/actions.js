export default {
	initState({ commit, state }) {
		if (!localStorage.getItem('mwStorage')) {
			localStorage.clear();

			let storage = state.storage;
			localStorage.setItem('mwStorage', JSON.stringify(storage));
		} else {
			let storage = JSON.parse(localStorage.getItem('mwStorage'));
			commit('initState', storage);
		}
	},
	addList({ commit }, data) {
		commit('addList', data);
	},
	addTask({ commit }, data) {
		commit('addTask', data);
	}
}
