<template>
	<div class="app">
		<main class="app__lists">
			<todo-lists/>
		</main>

		<div class="app__new">
			<todo-task-add/>
		</div>
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

<style lang="less">
	@import "../assets/less/global";
</style>
