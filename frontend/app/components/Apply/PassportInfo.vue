<template>
	<form class="form" @submit.prevent="emit('continue')">
		<fieldset class="form-radio">
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
	</form>
	<template v-if="hasEpassportPlus == 'no'">
		<div class="card card-error">
			<p>ePassport+ is required to apply for an ETA. Please contact your national authority to acquire an ePassport+-enabled passport.</p>
			<p>If this is not possible, you may instead apply for a visa from your primary destination country, or if one cannot be determined, the free-travel country of first entry. Such a visa will still grant entry into the entire free-travel zone.</p>
		</div>
		<p>
			<a href="/">Return to home page</a>
		</p>
	</template>
</template>
<script setup lang="ts">
const emit = defineEmits<{
	(e: "continue"): void
}>();

const hasEpassportPlus = defineModel<"yes" | "no" | null>("has-epassport-plus");
const username = defineModel("username", { default: "" });
const passportNumber = defineModel("passport-number", {
	default: "",
	set: value => value.toUpperCase().slice(0, 8)
});
</script>
<style>
.passport-form {
	display: grid;
	grid-template-columns: max-content 1fr;
	gap: 1rem;
}

.passport-form label {
	display: flex;
	justify-content: end;
	align-items: center;
}
</style>
