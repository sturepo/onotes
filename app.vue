<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>

<style>

.font-op {
	-webkit-font-smoothing: antialiased;
	text-rendering: optimizelegibility;
}

@font-face {
	font-family: "InterVar";
	font-weight: 100 900;
	font-display: swap;
	font-style: normal;
	src: url("/fonts/Inter/Inter.var.woff2?v=3.19") format("woff2-variations"),
		url("/fonts/Inter/Inter.var.woff2?v=3.19") format("woff2");
	src: url("/fonts/Inter/Inter.var.woff2?v=3.19") format("woff2")
		tech("variations");
}
@font-face {
	font-family: "InterVar";
	font-weight: 100 900;
	font-display: swap;
	font-style: italic;
	src: url("/fonts/Inter/Inter-Italic.var.woff2?v=3.19")
			format("woff2-variations"),
		url("/fonts/Inter/Inter-Italic.var.woff2?v=3.19") format("woff2");
	src: url("/fonts/Inter/Inter-Italic.var.woff2?v=3.19") format("woff2")
		tech("variations");
}

@media (orientation: landscape) {
    ::-webkit-scrollbar {
		width: 12px;
		height: 12px;
		background-color: #fff;
	}
	::-webkit-scrollbar-thumb {
		border-radius: 5px;
		background-color: #0f172a;
		border: 2px solid #475569;
	}
	::-webkit-scrollbar-track {
		border-radius: 3px;
		background-color: #fff;
	}

	.dark ::-webkit-scrollbar {
		background-color: #1d2a47;
	}
	.dark ::-webkit-scrollbar-thumb {
		background-color: #283e6e;
		border-color: #8692b0;
	}
	.dark ::-webkit-scrollbar-track {
		background-color: #1d2a47;
	}
}
</style>
