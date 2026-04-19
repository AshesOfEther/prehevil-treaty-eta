<template>
	<main>
		<header>
			<h1>Apply for an ETA</h1>
			<div id="progress">
				<div v-for="i in 5" :key="i"  class="progress-step-number" :data-step="i">
					<div class="progress-step-circle" :class="{'progress-step-active' : i <= currentStepNumber}">
						{{ i }}
					</div>
				</div>
				<div id="progress-bar-container">
					<div id="progress-bar"></div>
				</div>
				<div class="progress-step-name">
					Introduction
				</div>
				<div class="progress-step-name">
					Passport
				</div>
				<div class="progress-step-name">
					Beam
				</div>
				<div class="progress-step-name">
					Questions
				</div>
				<div class="progress-step-name">
					Result
				</div>
			</div>
		</header>
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
				v-model:has-epassport-plus="hasEpassportPlus"
				v-model:username="username"
				v-model:passport-number="passportNumber"
				@continue="currentStep = 'beam'"
			/>
		</div>
		<div v-else-if="currentStep == 'beam'">
			<h2>Beam</h2>
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
			<ApplyQuestions :country="country!" @submit="submit" />
		</div>
		<div v-else-if="currentStep == 'result'">
			<h2>Result</h2>
			<ApplyResult :result="result!" />
		</div>
	</main>
</template>
<script setup lang="ts">
import { countries, type Answers, type ApiApplyResponse, type Country, type Passport } from 'prehevil-treaty-eta-common';
import { apply } from '~/api';

const STEPS: Array<(typeof currentStep)["value"]> = ["introduction", "passportInfo", "beam", "questions", "result"];

const currentStep = ref<"introduction" | "passportInfo" | "beam" | "questions" | "result">("introduction");
const currentStepNumber = computed(() => STEPS.indexOf(currentStep.value) + 1);

const hasEpassportPlus = ref<"yes" | "no" | null>();
const username = ref("");
const passportNumber = ref("");
const passport = ref<Passport | null>();

const result = ref<ApiApplyResponse | null>();

const country = computed(() => passport.value != null ? countries[passport.value.issuingAuthority] ?? null : null);

definePageMeta({
	title: "Apply for an ETA",
	description: "An electronic travel authorization lets you travel throughout the Prehevil Treaty free-travel zone without restrictions."
});

const shouldBlockLeave = () =>
	currentStep.value != "result" &&
	hasEpassportPlus.value != "no" &&
	!(currentStep.value == "questions" && country.value?.status == "waiver");

// Handle navigations to other routes on this website.
onBeforeRouteLeave(() => {
	if (shouldBlockLeave()) {
		const answer = window.confirm("Are you sure you want to leave? Your form progress will not be saved.");
		if (!answer) return false;
	}

	window.removeEventListener("beforeunload", preventLeaveHandler);
});

// Handle navigations away from this website.
function preventLeaveHandler(event: BeforeUnloadEvent) {
	if (shouldBlockLeave())
		event.preventDefault();
}

if (import.meta.client)
	window.addEventListener("beforeunload", preventLeaveHandler);

function selectDebugPassport(debugPassport: Passport) {
	passport.value = debugPassport;
	currentStep.value = "questions";
}

async function submit(answers: Answers) {
	result.value = await apply({
		username: username.value,
		passport: passport.value as Passport, // Known to be non-null at this point
		answers
	});
	currentStep.value = "result";
}
</script>
<style>
#progress {
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	grid-template-rows: repeat(2, auto);
	counter-reset: step;
}

.progress-step-number {
	grid-row: 1;
	display: flex;
	justify-content: center;
}

.progress-step-number:nth-child(1) { grid-column: 1; }
.progress-step-number:nth-child(2) { grid-column: 2; }
.progress-step-number:nth-child(3) { grid-column: 3; }
.progress-step-number:nth-child(4) { grid-column: 4; }
.progress-step-number:nth-child(5) { grid-column: 5; }

.progress-step-circle {
	background-color: var(--color-gray);
	width: 3rem;
	height: 3rem;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: bold;
}

.progress-step-active {
	background-color: var(--color-accent);
}

#progress-bar-container {
	grid-row: 1;
	grid-column: 1 / 6;
	z-index: -1;
	display: flex;
	align-items: center;
	padding: 0 10% 0 10%;
}

#progress-bar {
	background-color: var(--color-gray);
	flex: 1;
	height: 0.5rem;
}

#progress-bar::before {
	background-color: var(--color-accent);
	display: block;
	width: calc(25% * (v-bind(currentStepNumber) - 1));
	height: 100%;
	content: "";
}

.progress-step-name {
	padding-top: 0.5rem;
	text-align: center;
}
</style>
