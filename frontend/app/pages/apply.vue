<template>
	<main>
		<div>

		</div>
		<div v-if="currentStep == 'introduction'">
			<h2>Introduction</h2>
			<ApplyIntroduction
				@select-debug-passport="selectDebugPassport"
				@continue="currentStep = 'passportInfo'"
			/>
		</div>
		<div v-else-if="currentStep == 'passportInfo'">
			<h2>Passport</h2>
			<ApplyPassportInfo
				v-model:username="username"
				v-model:passport-number="passportNumber"
				@continue="currentStep = 'beam'"
			/>
		</div>
		<div v-else-if="currentStep == 'beam'">
			<h2>Passport</h2>
			<ApplyBeam
				:username="username"
				:passport-number="passportNumber"
				:country="country"
				v-model="passport"
				@try-again="currentStep = 'passportInfo'"
				@continue="currentStep = 'questions'"
			/>
		</div>
		<div v-else-if="currentStep == 'questions'">
			<h2>Questions</h2>
			<ApplyQuestions :country="country as Country" />
		</div>
		<div v-else-if="currentStep == 'result'">
			TODO: Application result
		</div>
	</main>
</template>
<script setup lang="ts">
import { countries, type Country, type Passport } from 'prehevil-treaty-eta-common';

const currentStep = ref<"introduction" | "passportInfo" | "beam" | "questions" | "result">("introduction");

const username = ref("");
const passportNumber = ref("");
const passport = ref<Passport | null>();

const country = computed(() => passport.value != null ? countries[passport.value.issuingAuthority] ?? null : null);

function selectDebugPassport(debugPassport: Passport) {
	passport.value = debugPassport;
	currentStep.value = "questions";
}
</script>
