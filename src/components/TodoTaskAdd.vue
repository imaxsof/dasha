<template>
	<form
		@submit.prevent="addTask"
		autocomplete="off">
		<input
			v-model.trim="task.name"
			type="text"
			placeholder="Что надо сделать?"
			maxlength="255"
			required>

		<br>

		<select
			v-model="task.listId"
			required>
			<option
				v-for="list in lists"
				:key="list.id"
				:value="list.id">
				{{ list.name }}
			</option>

			<option value="newList">
				Создать новый список
			</option>
		</select>

		<br>

		<input
			v-show="task.listId === 'newList'"
			v-model.trim="list.name"
			type="text"
			placeholder="Название листа"
			maxlength="255"
			:required="task.listId === 'newList'">

		<br>

		<button type="submit">Добавить</button>
	</form>
</template>

<script>
	import { mapGetters } from 'vuex';

	function makeHash() {
		let hash = '';
		let possible = '0123456789abcdefghijklmnopqrstuvwxyz';

		for (let i = 0; i < 8; i ++) {
			hash += possible.charAt(Math.floor(Math.random() * possible.length));
		}

		return hash;
	}

	export default {
		name: 'TodoTaskAdd',
		data: function() {
			return {
				list: {
					id: makeHash(),
					name: '',
				},
				task: {
					id: makeHash(),
					name: '',
					listId: ''
				}
			}
		},
		computed: {
			...mapGetters({
				lists: 'getLists'
			})
		},
		methods: {
			addTask: function() {
				let newTask = Object.assign({}, this.task);

				if (this.task.listId === 'newList' && this.list.name !== '') {
					let newList = Object.assign({}, this.list);
					this.$store.dispatch('addList', newList);

					newTask.listId = this.list.id;
				}

				this.$store.dispatch('addTask', newTask);

				Object.assign(this.$data, this.$options.data());
			}
		}
	};
</script>
