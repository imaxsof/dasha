<template>
	<ul class="lists">
		<li
			v-for="list in lists"
			:key="list.id"
			class="lists__item">
			{{ list.name }} ({{ tasksCount(list.id) }})

			<todo-tasks :list-id="list.id"/>
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

	.lists {
		padding-left: 0;
		list-style-type: none;
		margin-top: 0;
		margin-bottom: 0;
	}

	.lists__item {
		margin-bottom: 20px;
		background-color: #fff;
		color: #000;
	}
</style>
