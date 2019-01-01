import Vue from 'vue';
import Vuex from 'vuex';
import App from './App.vue';

Vue.use(Vuex);

let mwStorage = {
	lists: [
		{
			id: 'rtg65d',
			name: 'Краткосрочный план дел'
		}, {
			id: '96t6ol',
			name: 'Регулярные дела'
		}
	],
	tasks: [
		{
			id: 'vc5r32',
			listId: 'rtg65d',
			name: 'Купить новую куртку'
		}, {
			id: 'n6654v',
			listId: 'rtg65d',
			name: 'Записаться на курсы рисования'
		}, {
			id: '0klas3',
			listId: 'rtg65d',
			name: 'Встретить товарища из Москвы'
		}, {
			id: 'kmc6tf',
			listId: '96t6ol',
			name: 'Подстричься'
		}, {
			id: 'ads77g',
			listId: '96t6ol',
			name: 'Полить цветы'
		}
	],
	settings: {
		theme: 'dark'
	}
}

let store = new Vuex.Store({
	state: mwStorage,
	// actions: {
	// 	addNote({commit}, note) {
	// 		commit('ADD_NOTE', note)
	// 	}
	// },
	// mutations: {
	// 	addTask(state, newTask) {
	// 		state.tasks.push(newTask);
	// 	}
	// },
	// getters: {
	// 	notes(state) {
	// 		return state.notes
	// 	}
	// },
	// modules: {}
})

new Vue({
	el: '#app',
	store,
	render: h => h(App)
});
