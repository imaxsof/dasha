<template>
	<form @submit.prevent="addtask">
		<input v-model="name" type="text" placeholder="Название" required><br>
		<select v-model="listId">
			<option v-for="list in lists" :key="list.id" name="list.id">
				{{ list.name }}
			</option>
		</select><br>
		<button type="submit">Добавить</button>
	</form>
</template>

<script>
	import { mapState } from 'vuex';

	export default {
		name: 'TodoTaskAdd',
		data: function() {
			return {
				name: null,
				listId: null
			}
		},
		computed: mapState({
			lists: state => state.lists
		}),
		methods: {
			addtask: function() {
				console.log(this.name);
				this.$store.commit('addTask', {
					id: 'vc5r39',
					listId: 'rtg65d',
					name: this.name
				})
			}
		}
	};
</script>
