<template>
	<div>
		<form class="lookup-form" @submit.prevent="submit">
			<label>Country</label>
			<select v-model="issuingAuthority" required>
				<option value="" selected disabled hidden>Select...</option>
				<option v-for="(country, code) in countries" :key="code" :value="code">{{ country.name }}</option>
			</select>
			<label>Document number</label>
			<input type="text" placeholder="e.g. AB123456" v-model="passportNumber" required>
			<div class="lookup-form-submit">
				<input type="submit" value="Check">
			</div>
		</form>
		<div v-if="canEnter" class="card card-good">
			<p>You are eligible to enter the Prehevil Treaty free-travel zone.</p>
		</div>
		<div v-if="canEnter === false" class="card card-error">
			<p>You are not eligible to enter the Prehevil Treaty free-travel zone.</p>
		</div>
	</div>
</template>
<script setup lang="ts">
import { countries } from "prehevil-treaty-eta-common";
import { lookup } from "~/api";

const issuingAuthority = ref("");
const passportNumber = ref("");

const canEnter = ref<boolean | null>();

async function submit() {
	canEnter.value = (await lookup(issuingAuthority.value, passportNumber.value)).canEnter;
}
</script>
<style>
.lookup-form {
	display: grid;
	grid-template-columns: max-content 1fr;
	gap: 1rem;
	margin-bottom: 1rem;
}

.lookup-form label {
	display: flex;
	justify-content: end;
	align-items: center;
}

.lookup-form-submit {
	grid-column: 2;
}
</style>
