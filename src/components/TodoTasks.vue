<template>
	<ul>
		<li
			v-for="task in tasks(listId)"
			:key="task.id">
			{{ task.name }}
		</li>
	</ul>
</template>

<script>
	import { mapGetters } from 'vuex';

	export default {
		name: 'TodoTasks',
		props: {
			listId: String,
			required: true
		},
		computed: {
			...mapGetters({
				tasks: 'getTasksByListId'
			})
		}
	};
</script>

<style lang="less">
	@import (reference) "../assets/less/global";
</style>
