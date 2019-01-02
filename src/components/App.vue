<template>
	<div>
		<TodoLists/>
		<hr>
		<TodoTaskAdd/>
	</div>
</template>

<script>
	import TodoLists from './TodoLists.vue';
	import TodoTaskAdd from './TodoTaskAdd.vue';

	export default {
		name: 'app',
		components: {
			TodoLists,
			TodoTaskAdd
		}
	};
</script>
