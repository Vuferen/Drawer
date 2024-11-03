<script lang="ts">
	import * as Drawer from './../lib/Drawer';
</script>

<h1>Welcome to your library project</h1>
<p>Create your package using @sveltejs/package and preview/showcase your work with SvelteKit</p>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<Drawer.Base>
	<Drawer.Tab/>
	<Drawer.Content>
		<span class="tw-font-bold tw-mt-1.5 tw-mb-0.5 tw-text-center tw-px-4" id="aria-drawer-title">
			Drawer title
		</span>
		<div class="tw-flex tw-justify-center tw-overflow-y-auto tw-px-4">
			<ul>
				{#each {length: 35} as _, index}
					<li>Item {index+1}: Lorem ipsum</li>
				{/each}
			</ul>
		</div>
	</Drawer.Content>
</Drawer.Base>