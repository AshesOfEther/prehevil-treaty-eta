<template>
	<div v-if="country?.status == 'ftz'" class="card card-good">
		<p>
			You do not need to apply for an ETA, as you are a citizen of a Prehevil Treaty free-travel state.
		</p>
	</div>
	<div v-else-if="country?.status == 'waiver'" class="card card-good">
		<p>
			You do not need to apply for an ETA, as you are a citizen of a Prehevil Treaty permit waiver state.
		</p>
		<p>
			Please answer the questions below to determine if you are elligible to enter the free-travel zone.
		</p>
	</div>
	<div v-else-if="country?.status == 'required'">
		<p>Please answer the questions below to determine if you are eligible for an ETA.</p>
	</div>
	<div v-else class="card card-error">
		<p>You are not eligible to apply for an ETA under this arrangement.</p>
		<p>Please contact the diplomatic mission of your destination country to apply for a visa.</p>
	</div>
	<form v-if="['waiver', 'required'].includes(country?.status ?? '')" @submit.prevent="emit('continue')">
		<fieldset>
			<legend>Do you have any criminal convictions?</legend>
			<div>
				<input type="radio" name="has-criminal-conviction" value="yes" v-model="hasCriminalConviction" required />
				<label for="yes">Yes</label>
			</div>
			<div>
				<input type="radio" name="has-criminal-conviction" value="no" v-model="hasCriminalConviction" />
				<label for="no">No</label>
			</div>
		</fieldset>
		<fieldset>
			<legend>Have you ever been deported?</legend>
			<div>
				<input type="radio" name="has-been-deported" value="yes" v-model="hasBeenDeported" required />
				<label for="yes">Yes</label>
			</div>
			<div>
				<input type="radio" name="has-been-deported" value="no" v-model="hasBeenDeported" />
				<label for="no">No</label>
			</div>
		</fieldset>
		<fieldset>
			<legend>Do you have tuberculosis?</legend>
			<div>
				<input type="radio" name="has-tuberculosis" value="yes" v-model="hasTuberculosis" required />
				<label for="yes">Yes</label>
			</div>
			<div>
				<input type="radio" name="has-tuberculosis" value="no" v-model="hasTuberculosis" />
				<label for="no">No</label>
			</div>
		</fieldset>
		<template v-if="country?.status == 'required'">
			<div>
				<input type="checkbox" name="confirm" required />
				<label for="confirm">I hereby confirm that all information provided is accurate.</label>
			</div>
			<input type="submit" value="Continue" />
		</template>

	</form>
	<div v-if="country?.status == 'waiver' && canEnter" class="card card-good">
		<p>You are elligible to enter the free-travel zone under this arrangement and do not need an ETA.</p>
	</div>
	<div v-if="country?.status == 'waiver' && needsVisa" class="card card-error">
		<p>You will need a visa to be able to enter the free-travel zone.</p>
		<p>Please contact your destination country's embassy for further assistance.</p>
	</div>
</template>
<script setup lang="ts">
import type { Country } from 'prehevil-treaty-eta-common';

const { country } = defineProps<{
	country: Country
}>();

const emit = defineEmits<{
	(e: "continue"): void;
}>();

const hasCriminalConviction = ref<"yes" | "no" | null>();
const hasBeenDeported = ref<"yes" | "no" | null>();
const hasTuberculosis = ref<"yes" | "no" | null>();

const canEnter = computed(() => hasCriminalConviction.value == "no" && hasBeenDeported.value == "no" && hasTuberculosis.value == "no");
const needsVisa = computed(() => hasCriminalConviction.value == "yes" || hasBeenDeported.value == "yes" || hasTuberculosis.value == "yes");
</script>
