<template>
	<p>If you are entering the Prehevil Treaty free-travel zone, you might need an ETA.</p>

	<p>Please have your passport ready before continuing.</p>

	<div>
		<select v-model="selectedDebugPassport" @change="selectDebugPassport">
			<option value="" selected disabled hidden>Select debug passport...</option>
			<option value="ftz">Free-travel zone (Solstice)</option>
			<option value="waiver">Waiver (TAY)</option>
			<option value="othder">Other (Aura Regions)</option>
		</select>
	</div>

	<button @click="emit('continue')">Continue</button>
</template>
<script setup lang="ts">
import type { Passport } from 'prehevil-treaty-eta-common';

const emit = defineEmits<{
	(e: "continue"): void
	(e: "select-debug-passport", passport: Passport): void
}>();

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
		emit("select-debug-passport", debugPassports[selectedDebugPassport.value]);
	}
}
</script>
