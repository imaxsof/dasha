<template>
	<div class="">
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

<style lang="less">
	@import "../assets/less/global";
</style>
