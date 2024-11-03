<div class="tw-grid tw-place-items-center tw-justify-center">
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="tw-cursor-default tw-flex tw-flex-col tw-max-h-[70vh]" on:mousedown={(e) => e.stopPropagation()} on:touchstart={(e) => e.stopPropagation()}>
		<slot/>
	</div>
</div>