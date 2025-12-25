<template>
	<form @submit.prevent="emit('continue')">
		<fieldset>
			<legend>Do you have an ePassport+-enabled passport?</legend>
			<div>
				<input type="radio" name="has-epassport-plus" value="yes" v-model="hasEpassportPlus" required />
				<label for="yes">Yes</label>
			</div>
			<div>
				<input type="radio" name="has-epassport-plus" value="no" v-model="hasEpassportPlus" />
				<label for="no">No</label>
			</div>
		</fieldset>
		<template v-if="hasEpassportPlus == 'yes'">
			<fieldset class="passport-form">
				<label>Username</label>
				<input v-model="username" type="text" required />
				<label>Document number</label>
				<input v-model="passportNumber" type="text" placeholder="e.g. AB123456" required />
			</fieldset>
			<p>Your passport will now be scanned. Ensure that you are logged into the server, and then click the button below.</p>
			<input type="submit" value="I am ready" />
		</template>

		<div v-if="hasEpassportPlus == 'no'" class="card card-error">
			Lorem ipsum dolor sit amet
		</div>
	</form>
</template>
<script setup lang="ts">
const emit = defineEmits<{
	(e: "continue"): void
}>();

const hasEpassportPlus = ref<"yes" | "no" | null>();
const username = defineModel("username", { default: "" });
const passportNumber = defineModel("passport-number", { default: "" });
</script>
<style>
.passport-form {
	margin: 1rem 0 1rem 0;
	display: grid;
	grid-template-columns: max-content 1fr;
	gap: 1rem;
}

.passport-form label {
	display: flex;
	justify-content: end;
	align-items: center;
}

.passport-form p {
	grid-column: 1 / 3;
}

.passport-form-submit {
	grid-column: 2;
}
</style>
