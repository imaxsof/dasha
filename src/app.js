import Vue from 'vue';
import App from './components/App.vue';
import store from './store';

new Vue({
	el: '#app',
	store,
	render: h => h(App),
	beforeCreate() {
		this.$store.dispatch('initState');
	},
	created() {
		this.$store.subscribe((mutation, state) => {
			localStorage.setItem('mwStorage', JSON.stringify(state.storage));
		});
	}
});
