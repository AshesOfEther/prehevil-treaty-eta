<template>
	<div v-if="result == null && beamCode != null">
		<p>Please run the command below in-game within 60 seconds:</p>
		<div id="beam-command-row">
			<code id="beam-command">/passport beam {{ beamCode }}</code>
			<button @click="copyCommand">Copy</button>
		</div>

		<select>
			<option value="" selected disabled hidden>Select debug passport...</option>
		</select>
	</div>
	<div v-else-if="result?.status == 'success'">
		<p>Please verify that the below details are correct before continuing:</p>
		<table>
			<tr>
				<th>Issuing authority</th>
				<td>{{ countries[result.passport.issuingAuthority]?.name ?? `Unknown (${result.passport.issuingAuthority})` }}</td>
			</tr>
			<tr>
				<th>Name</th>
				<td>{{ result.passport.familyName }}, {{ result.passport.givenName }}</td>
			</tr>
			<tr>
				<th>Document number</th>
				<td>{{ result.passport.passportNumber }}</td>
			</tr>
			<tr>
				<th>Date of birth</th>
				<td>{{ formatDate(result.passport.dateOfBirth) }}</td>
			</tr>
			<tr>
				<th>Date of expiry</th>
				<td>{{ formatDate(result.passport.expiryDate) }}</td>
			</tr>
		</table>
		<div class="button-row">
			<button @click="emit('try-again')">Try again</button>
			<button @click="emit('continue')">Continue</button>
		</div>
	</div>
	<div v-else-if="result?.status == 'error'" class="card card-error">
		{{ errorMessages[result.error] }}
	</div>
</template>
<script setup lang="ts">
import { countries, type Passport } from 'prehevil-treaty-eta-common';
import { beam, type BeamErrorCode, type BeamResult } from '~/beam';
import { formatDate } from '~/utils';

const errorMessages = {
	"timeout": "You did not run the command and/or select a passport within the time limit.",
	"bad-details": "The selected passport does not match the specified document number. Ensure that you have the correct passport in your inventory or your ender chest."
} satisfies Record<BeamErrorCode, string>;

const props = defineProps<{
	username: string;
	passportNumber: string;
}>();

const passport = defineModel<Passport | null>();

const emit = defineEmits<{
	(event: "try-again"): void;
	(event: "continue"): void;
}>();

const beamCode = ref<string | null>();
const result = ref<BeamResult | null>();

const abortController = ref<AbortController | null>();

onBeforeMount(() => beginBeam());
onUnmounted(() => abortController.value?.abort());

async function beginBeam() {
	result.value = null;
	beamCode.value = null;
	const session = await beam(props.username, props.passportNumber);
	beamCode.value = session.code;
	abortController.value = session.abortController;

	result.value = await session.promise;
	passport.value = result.value.status == "success" ? result.value.passport : null;
}

function copyCommand() {
	navigator.clipboard.writeText(`/passport beam ${beamCode.value}`);
}
</script>
<style>
#beam-command-row {
	display: flex;
	gap: 0.5rem;
}

#beam-command {
	display: flex;
	align-items: center;
	padding: 0.5rem;
	font-size: 1rem;
	line-height: inherit;
	background-color: var(--color-gray-dark);
}
</style>
