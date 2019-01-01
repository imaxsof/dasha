<template>
	<ul >
		<li
			v-for="list in lists"
			:key="list.id">
			{{ list.name }}

			<TodoTasks :list-id="list.id"/>
		</li>
	</ul>
</template>

<script>
	import { mapState } from 'vuex';
	import TodoTasks from './TodoTasks.vue';

	export default {
		name: 'TodoLists',
		components: {
			TodoTasks
		},
		computed: mapState({
			lists: state => state.lists
		})
	};
</script>
