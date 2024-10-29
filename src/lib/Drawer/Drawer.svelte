<script lang="ts">
	import { onMount } from 'svelte';
import { pointerStore, cssVarStore  } from 'svelte-legos';

export let snapPoints = ["-60px", "-100% - 20px"]
export let drawerMaxHeight = '-50vh';

const drawerOffset = cssVarStore('--drawer-offset', { initialValue: snapPoints[0] })
const drawerMouseOffset = cssVarStore('--drawer-mouse-offset', { initialValue: "0px" })
cssVarStore('--drawer-max-height', { initialValue: drawerMaxHeight })

const position = pointerStore();

let isMovingDrawer = false;
let startMouseY = 0;
let initialDrawerOffset = ""
let startMoveTime = new Date();
function startMovingDrawer() {
	isMovingDrawer = true;
	startMouseY = $position.y;
	initialDrawerOffset = $drawerOffset;
	startMoveTime = new Date();
}

onMount(() => {
	document.addEventListener("mouseup", stopMovingDrawer);
	document.addEventListener("touchend", stopMovingDrawer);
})

function stopMovingDrawer() {
	if (isMovingDrawer) {
		let newSnapPoint = null;

		var moveTime = new Date().getTime() - startMoveTime.getTime();
		if (moveTime <= 100) {
			console.log("do", $drawerOffset)
			const currentSnapPointIndex = snapPoints.findIndex((x) => x == $drawerOffset)
			newSnapPoint = snapPoints[(currentSnapPointIndex + 1) % snapPoints.length]
		} else {
			const currentOffSet = calculateCSSValue(`max(
			calc(100% + 20px + var(--drawer-offset) + var(--drawer-mouse-offset)), 
			max(var(--drawer-max-height), 0px))`)

			let nearestDistance = Infinity;
			snapPoints.forEach((snapPoint) => {
				const calculatedSnapPoint = calculateCSSValue(`calc(100% + 20px + ${snapPoint})`)
				const calculatedOffsetFromSnapPoint = Math.abs(currentOffSet - calculatedSnapPoint);

				if (calculatedOffsetFromSnapPoint < nearestDistance) {
					newSnapPoint = snapPoint;
					nearestDistance = calculatedOffsetFromSnapPoint;
				}

			})
		}

		isMovingDrawer = false;
		$drawerMouseOffset = "0px";
		$drawerOffset = newSnapPoint;
	}
}

$: isMovingDrawer && updateDrawerPositon($position.y)

function updateDrawerPositon(mouseY: number) {
	$drawerMouseOffset = `${mouseY - startMouseY}px`;
}

function calculateCSSValue(expression: string) {
  // Create a temporary element
  const tempElement = document.createElement('div');
  // Apply the expression to a CSS property
  tempElement.style.position = "absolute";
  tempElement.style.height = expression;
  const drawerElement = document.getElementById("drawer")
  if (!drawerElement) return Infinity;
  // Append it to the document to ensure styles are computed
  drawerElement.appendChild(tempElement);
  // Get the computed style of the element
  const computedValue = window.getComputedStyle(tempElement).height;
  // Clean up by removing the element
  drawerElement.removeChild(tempElement);
  
  // Use parseFloat to remove the "px" and return the numeric value
  return parseFloat(computedValue);
}

</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div id="drawer" class="tw-bg-white tw-inset-x-0 tw-fixed tw-bottom-0 tw-rounded-t-xl tw-pb-4 tw-flex tw-flex-col drop-shadow-lg-reverse translate-y-fully tw-cursor-grab {isMovingDrawer ? 'tw-select-none tw-cursor-grabbing' : ''}" on:mousedown={startMovingDrawer} on:touchstart={startMovingDrawer} aria-roledescription="move drawer" role="dialog" tabindex="-1" aria-modal="true" aria-labelledby="aria-drawer-title">
	<div class="tw-absolute tw--top-[20px] tw--translate-x-1/2 tw-left-1/2 tw-flex tw-flex-row ">
		<svg width="32px" height="20px" viewBox="0 0 16 10" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
			<path d="M15.992,10C15.992,10 -5.878,10 1.533,10C11.598,10 4.712,0 16,0C16,2.508 15.992,10 15.992,10Z" style="fill:#fff;"/>
		</svg>
		<div class="tw-flex tw-flex-col tw-justify-center tw-items-center tw-bg-white tw-h-[20px] tw-w-[50px] tw-gap-[3px]">
			{#each {length: 2} as _}
				<div class="tw-rounded-full tw-py-[1px] tw-w-full tw-bg-gray-200"></div>
			{/each}
		</div>
		<svg class="tw-scale-x-[-1]" width="32px" height="20px" viewBox="0 0 16 10" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
			<path d="M15.992,10C15.992,10 -5.878,10 1.533,10C11.598,10 4.712,0 16,0C16,2.508 15.992,10 15.992,10Z" style="fill:#fff;"/>
		</svg>
	</div>

	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="tw-grid tw-place-items-center tw-justify-center">
		<div class="tw-cursor-default tw-flex tw-flex-col tw-max-h-[70vh]" on:mousedown={(e) => e.stopPropagation()} on:touchstart={(e) => e.stopPropagation()}>
			<span class="tw-font-bold tw-mt-1.5 tw-mb-0.5 tw-text-center tw-px-4" id="aria-drawer-title">
				Drawer title
			</span>
			<div class="tw-flex tw-justify-center tw-overflow-y-auto tw-px-4">
				<ul>
					{#each {length: 15} as _, index}
						<li>Item {index+1}: Lorem ipsum</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
</div>

<style>

.drop-shadow-xl-reverse {
	--tw-drop-shadow: drop-shadow(0 -20px 13px rgb(0 0 0 / 0.03)) drop-shadow(0 -8px 5px rgb(0 0 0 / 0.08)) drop-shadow(0 -1px 1px rgb(229 231 235));
    filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}
.drop-shadow-lg-reverse {
    --tw-drop-shadow: drop-shadow(0 -10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 -4px 3px rgb(0 0 0 / 0.06)) drop-shadow(0 -1px 1px rgb(229 231 235));
    filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.translate-y-fully {
    --tw-translate-y: max(
		calc(100% + 20px + var(--drawer-offset) + var(--drawer-mouse-offset)), 
		max(var(--drawer-max-height), 0px));
    transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
</style>