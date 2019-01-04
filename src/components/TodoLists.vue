<template>
	<ul >
		<li
			v-for="list in lists"
			:key="list.id">
			{{ list.name }} ({{ tasksCount(list.id) }})

			<TodoTasks :list-id="list.id"/>
		</li>
	</ul>
</template>

<script>
	import TodoTasks from './TodoTasks.vue';
	import { mapGetters } from 'vuex';

	export default {
		name: 'TodoLists',
		components: {
			TodoTasks
		},
		computed: {
			...mapGetters({
				lists: 'getLists',
				tasksCount: 'getCountTasksByListId'
			})
		}
	};
</script>

<style lang="less">
	@import (reference) "../assets/less/global";
</style>
