<template>
	<ul>
		<li
			v-for="task in tasksList"
			:key="task.id">
			{{ task.name }}
		</li>
	</ul>
</template>

<script>
	import { mapState } from 'vuex';

	export default {
		name: 'TodoTasks',
		props: {
			listId: String
		},
		computed: mapState({
			tasksList(state) {
				let listId = this.listId;

				return state.tasks.filter(function(el) {
					if (el.listId === listId) {
						return true;
					}
				})
			}
		})
	};
</script>
