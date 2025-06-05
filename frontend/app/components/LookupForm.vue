<template>
	<form class="lookup-form">
		<label>Country</label>
		<select required>
			<option value="" selected disabled hidden>Select...</option>
			<option v-for="(country, code) in countries" :key="code">{{ country.name }}</option>
		</select>
		<label>Document number</label>
		<input type="text" placeholder="e.g. AB123456" required>
		<div class="lookup-form-submit">
			<input type="submit" value="Check" disabled>
		</div>
	</form>
</template>
<script setup lang="ts">
import { countries } from "@/common";
</script>
<style>
.lookup-form {
	display: grid;
	grid-template-columns: max-content 1fr;
	gap: 1rem;
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
