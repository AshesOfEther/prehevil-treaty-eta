<template>
	<div v-if="props.result.accepted" class="card card-good">
		<p>Your application for an electronic travel authorization has been approved. You are now elligible to enter the Prehevil Treaty free-travel zone.</p>
		<p>Your ETA is valid until {{ formattedDate }}. If you intend to remain in the free-travel zone beyond this time, you must apply for a new ETA before the current one expires.</p>
	</div>
	<div v-else class="card card-error">
		<p>Your application for an electronic travel application has been rejected.</p>
		<p>If you disagree with this assessment, you may apply for a visa at the consulate of your primary destination state in the free-travel zone, or if none can be determined, the free-travel state of first entry.</p>
	</div>
</template>
<script setup lang="ts">
import type { ApiApplyResponse } from 'prehevil-treaty-eta-common';

const props = defineProps<{
	result: ApiApplyResponse
}>();

const formattedDate = computed(() => props.result.accepted
	? new Date(props.result.expiresAt).toLocaleString("en-US", {
		day: "numeric",
		month: "long",
		year: "numeric",
		hour: "numeric",
		minute: "numeric",
		timeZoneName: "short"
	})
	: null
);
</script>
