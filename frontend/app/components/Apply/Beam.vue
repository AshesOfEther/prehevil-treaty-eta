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
	<div v-if="result != null">
		<template v-if="result.status == 'success'">
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
			<div v-if="country == null" class="card card-error">
				<p>The issuing authority of this passport is not recognized. Please contact support for assistance.</p>
			</div>
			<div v-else-if="country.status == 'ftz'" class="card card-good">
				<p>You do not need to apply for an ETA, as you are a citizen of a Prehevil Treaty free-travel state.</p>
			</div>
			<div v-else-if="country.status == 'waiver'" class="card card-good">
				<p>You probably do not need an ETA, as you are a citizen of a Prehevil Treaty permit waiver state.</p>
				<p>You may continue to see if you are eligible to enter the free-travel zone under this arrangement</p>
			</div>
			<div v-else-if="country.status == 'reject'" class="card card-bad">
				<p>You are not eligible to apply for an ETA under this arrangement.</p>
				<p>Please contact the diplomatic mission of your destination country to apply for a visa.</p>
			</div>
		</template>
		<div v-else-if="result.status == 'error'" class="card card-error">
			{{ errorMessages[result.error] }}
		</div>
		<div class="button-row">
			<button @click="emit('try-again')">Try again</button>
			<button @click="emit('continue')" :disabled="!canContinue">Continue</button>
		</div>
	</div>
</template>
<script setup lang="ts">
import { countries, type Country, type Passport } from 'prehevil-treaty-eta-common';
import { beam, type BeamErrorCode, type BeamResult } from '~/beam';
import { formatDate } from '~/utils';

const errorMessages = {
	"timeout": "You did not run the command and/or select a passport within the time limit.",
	"bad-details": "The selected passport does not match the specified document number. Ensure that you have the correct passport in your inventory or your ender chest."
} satisfies Record<BeamErrorCode, string>;

const props = defineProps<{
	username: string;
	passportNumber: string;
	country: Country | null;
}>();

const passport = defineModel<Passport | null>();

const emit = defineEmits<{
	(event: "try-again"): void;
	(event: "continue"): void;
}>();

const beamCode = ref<string | null>();
const result = ref<BeamResult | null>();

const abortController = ref<AbortController | null>();

const canContinue = computed(() => result.value?.status == "success" && ["waiver", "required"].includes(props.country?.status ?? ""));

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
