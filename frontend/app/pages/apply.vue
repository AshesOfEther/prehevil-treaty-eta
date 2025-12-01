<template>
	<main>
		<div>

		</div>
		<div v-if="currentStep == 0">
			<h2>Introduction</h2>
			<p>If you are entering the Prehevil Treaty free-travel zone, you might need an ETA.</p>

			<p>Please have your passport ready before continuing.</p>

			<div>
				<select v-model="selectedDebugPassport" @change="selectDebugPassport">
					<option value="" selected disabled hidden>Select debug passport...</option>
					<option value="ftz">Free-travel zone (Solstice)</option>
					<option value="waiver">Waiver (TAY)</option>
					<option value="other">Other (Aura Regions)</option>
				</select>
			</div>

			<button @click="nextStep">Continue</button>
		</div>
		<div v-else-if="currentStep == 1">
			<h2>Passport</h2>
			<form @submit.prevent="nextStep">
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
					<fieldset class="apply-form">
						<label>Username</label>
						<input v-model="username" type="text" required />
						<label>Document number</label>
						<input v-model="passportNumber" type="text" placeholder="e.g. AB123456" required />
					</fieldset>
					<p>Your passport will now be scanned. Ensure that you are logged into the server, and then click the button below.</p>
					<input type="submit" value="I am ready" />
				</template>

				<div v-if="hasEpassportPlus == 'no'">
					Lorem ipsum dolor sit amet
				</div>
			</form>
		</div>
		<div v-else-if="currentStep == 2">
			<h2>Passport</h2>
			<Beam :username :passport-number="passportNumber" v-model="passport" @tryAgain="previousStep" @continue="nextStep" />
		</div>
		<div v-else-if="currentStep == 3">
			<h2>Questions</h2>
			<div v-if="country?.status == 'ftz'">
				<p>
					You do not need to apply for an ETA, as you are a citizen of a Prehevil Treaty free-travel state.
				</p>
			</div>
			<div v-else-if="country?.status == 'waiver'">
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
			<div v-else>
				<p>You are not eligible to apply for an ETA under this arrangement.</p>
				<p>Please contact the diplomatic mission of your destination country to apply for a visa.</p>
			</div>
			<form v-if="['waiver', 'required'].includes(country?.status ?? '')" @submit.prevent="apply">
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
			<div v-if="country?.status == 'waiver' && canEnter">
				<p>You are elligible to enter the free-travel zone under this arrangement and do not need an ETA.</p>
			</div>
			<div v-if="country?.status == 'waiver' && needsVisa">
				<p>You will need a visa to be able to enter the free-travel zone.</p>
				<p>Please contact your destination country's embassy for further assistance.</p>
			</div>
		</div>
		<div v-else-if="currentStep == 4">
			TODO: Application result
		</div>
	</main>
</template>
<script setup lang="ts">
import { countries, type Passport } from 'prehevil-treaty-eta-common';
import { formatDate } from '~/utils';

const currentStep = ref(0);

const hasEpassportPlus = ref<"yes" | "no" | null>();
const username = ref("");
const passportNumber = ref("");

const passport = ref<Passport | null>();

const hasCriminalConviction = ref<"yes" | "no" | null>();
const hasBeenDeported = ref<"yes" | "no" | null>();
const hasTuberculosis = ref<"yes" | "no" | null>();

const country = computed(() => passport.value != null ? countries[passport.value.issuingAuthority] : null);

const canEnter = computed(() => hasCriminalConviction.value == "no" && hasBeenDeported.value == "no" && hasTuberculosis.value == "no");
const needsVisa = computed(() => hasCriminalConviction.value == "yes" || hasBeenDeported.value == "yes" || hasTuberculosis.value == "yes");

function previousStep() {
	currentStep.value--;
}

function nextStep() {
	currentStep.value++;
}

function apply() {
	nextStep();
}

const debugPassports = {
	"ftz": {
		passportNumber: "AA123456",
		givenName: "FTZ",
		familyName: "DEBUG",
		issuingAuthority: "SFR",
		nationality: "Placeholder",
		expiryDate: "2035-01-01T00:00:00.000Z",
		dateOfBirth: "2000-01-01T00:00:00.000Z",
		placeOfBirth: "Placeholder",
		isExpired: false
	},
	"waiver": {
		passportNumber: "AB123456",
		givenName: "WAIVER",
		familyName: "DEBUG",
		issuingAuthority: "TAY",
		nationality: "Placeholder",
		expiryDate: "2035-01-01T00:00:00.000Z",
		dateOfBirth: "2000-01-01T00:00:00.000Z",
		placeOfBirth: "Placeholder",
		isExpired: false
	},
	"other": {
		passportNumber: "AC123456",
		givenName: "OTHER",
		familyName: "DEBUG",
		issuingAuthority: "ALR",
		nationality: "Placeholder",
		expiryDate: "2035-01-01T00:00:00.000Z",
		dateOfBirth: "2000-01-01T00:00:00.000Z",
		placeOfBirth: "Placeholder",
		isExpired: false
	},
} satisfies Record<string, Passport>;

const selectedDebugPassport = ref<keyof typeof debugPassports | "">("");

function selectDebugPassport() {
	if (selectedDebugPassport.value != "") {
		passport.value = debugPassports[selectedDebugPassport.value];
		currentStep.value = 3;
	}
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

.apply-form {
	margin: 1rem 0 1rem 0;
	display: grid;
	grid-template-columns: max-content 1fr;
	gap: 1rem;
}

.apply-form label {
	display: flex;
	justify-content: end;
	align-items: center;
}

.apply-form p {
	grid-column: 1 / 3;
}

.apply-form-submit {
	grid-column: 2;
}
</style>
