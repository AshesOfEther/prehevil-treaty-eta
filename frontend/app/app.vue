<template>
	<div id="container">
		<header id="header">
			<img id="header-logo" src="~/assets/logo.svg">
			<div id="header-title">Prehevil Treaty</div>
		</header>
		<NuxtRouteAnnouncer />
		<NuxtPage />
	</div>
</template>
<script setup lang="ts">
import logo from "~/assets/logo.svg?no-inline";

const route = useRoute();

useSeoMeta({
	title: () => route.meta.title != null ? (route.meta.title + " - Prehevil Treaty") : "Prehevil Treaty",
	ogTitle: () => route.meta.title ?? "Prehevil Treaty",
	ogSiteName: () => route.meta.title != null ? "Prehevil Treaty" : null,
	ogDescription: () => route.meta.description ?? "A collection of countries cooperating to make cross-border travel faster and easier.",
	ogImage: logo,
});

useHead({
	link: [
		{ rel: "icon", type: "image/svg+xml", href: logo }
	]
});
</script>
<style>
#container {
	max-width: 768px;
	margin: 0 auto 0 auto;
	padding: 1rem;
}

#header {
	height: 3rem;
	display: flex;
	gap: 0.75rem;
	align-items: center;
}

#header-title {
	font-size: 1.5rem;
	font-weight: medium;
	line-height: 2rem;
}

#header-logo {
	height: 100%;
	aspect-ratio: auto;
}
</style>
