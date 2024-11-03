<script lang="ts">
import { onMount } from 'svelte';
import { pointerStore, cssVarStore  } from 'svelte-legos';

export let snapPoints = ["60px", "100% + 20px"]
export let drawerMinHeight = "20px";

const drawerOffset = cssVarStore('--drawer-offset', { initialValue: snapPoints[0] })
const drawerMouseOffset = cssVarStore('--drawer-mouse-offset', { initialValue: "0px" })
cssVarStore('--drawer-min-height', { initialValue: drawerMinHeight })

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
	positionSamples = [$position.y,$position.y,$position.y,$position.y,$position.y];
}

let showDrawer = false;
onMount(() => {
	document.addEventListener("mouseup", stopMovingDrawer);
	document.addEventListener("touchend", stopMovingDrawer);
	setTimeout(() => {
		// Wait for css variables to be set then show
		showDrawer = true;
	}, 100);
})

function calculateSnapPoint(snapPoint: string = null) {
	
	if (snapPoint == null) {
		return calculateCSSValue(`
			min(
				max(
					calc(100% + 20px - (var(--drawer-offset)) + var(--drawer-mouse-offset)), 
					0px
				), 
				calc(100% - 40px)
			)`)
	}

	return calculateCSSValue(`
		min(
			max(
				calc(100% + 20px - (${snapPoint})), 
				0px
			), 
			calc(100% - 40px)
		)`);
}

function stopMovingDrawer() {
	if (isMovingDrawer) {
		let newSnapPoint = $drawerOffset;
		updateSamples($position.y);
		const didFlick = isFlick();

		var moveTime = new Date().getTime() - startMoveTime.getTime();
		if (didFlick) {
			const currentOffSet = calculateSnapPoint();

			let nearestDistance = Infinity;
			snapPoints.forEach((snapPoint) => {
				const calculatedSnapPoint = calculateSnapPoint(snapPoint);

				if (flickDirection == "up" && calculatedSnapPoint > currentOffSet) {
					return;
				}
				if (flickDirection == "down" && calculatedSnapPoint < currentOffSet) {
					return;
				}

				const calculatedOffsetFromSnapPoint = Math.abs(currentOffSet - calculatedSnapPoint);

				if (calculatedOffsetFromSnapPoint < nearestDistance) {
					newSnapPoint = snapPoint;
					nearestDistance = calculatedOffsetFromSnapPoint;
				}

			})

		}
		else if (moveTime <= 100) {
			const currentSnapPointIndex = snapPoints.findIndex((x) => x == $drawerOffset)
			newSnapPoint = snapPoints[(currentSnapPointIndex + 1) % snapPoints.length]
		} else {
			const currentOffSet = calculateSnapPoint();

			let nearestDistance = Infinity;
			snapPoints.forEach((snapPoint) => {
				const calculatedSnapPoint = calculateSnapPoint(snapPoint)
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

const maxSamples = 5;
let newestSample = 0;
let positionSamples = [0,0,0,0,0];
let lastSampleTime = new Date();

function updateDrawerPositon(mouseY: number) {
	$drawerMouseOffset = `${mouseY - startMouseY}px`;
	if ((new Date()).getTime() - lastSampleTime.getTime() > 50) {
		updateSamples(mouseY)
	}
}

function updateSamples(mouseY) {
	lastSampleTime = new Date();
	newestSample = (newestSample + 1) % maxSamples;
	positionSamples[newestSample] = mouseY;
}

let flickDirection = "up";
function isFlick() {
	const flickVelocity = (positionSamples[newestSample] - positionSamples[(newestSample + (maxSamples - 2)) % maxSamples]) / 2;
	const dragVelocity = (positionSamples[(newestSample + (maxSamples - 3)) % maxSamples] - positionSamples[(newestSample + 1) % maxSamples]) / 2;

	if (flickVelocity > 0) {
		flickDirection = "down";
	} else {
		flickDirection = "up";
	}

	return Math.abs(Math.abs(flickVelocity) - Math.abs(dragVelocity)) > 25
}

function calculateCSSValue(expression: string) {
  const tempElement = document.createElement('div');
  tempElement.style.position = "absolute";
  tempElement.style.height = expression;
  const drawerElement = document.getElementById("drawer")
  if (!drawerElement) return Infinity;
  drawerElement.appendChild(tempElement);
  const computedValue = window.getComputedStyle(tempElement).height;
  drawerElement.removeChild(tempElement);
  
  return parseFloat(computedValue);
}

</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div id="drawer" class="{showDrawer ? '' : 'tw-opacity-0'} tw-bg-white tw-inset-x-0 tw-fixed tw-bottom-0 tw-rounded-t-xl tw-pb-4 tw-flex tw-flex-col drop-shadow-lg-reverse translate-y-fully tw-cursor-grab {isMovingDrawer ? 'tw-select-none tw-cursor-grabbing' : 'tw-transition-all'}" on:mousedown={startMovingDrawer} on:touchstart={startMovingDrawer} aria-roledescription="move drawer" role="dialog" tabindex="-1" aria-modal="true" aria-labelledby="aria-drawer-title">
	<slot/>	
</div>

<style>

.drop-shadow-lg-reverse {
    --drawer-drop-shadow: drop-shadow(0 -10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 -4px 3px rgb(0 0 0 / 0.06)) drop-shadow(0 -1px 1px rgb(229 231 235));
    filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--drawer-drop-shadow);
}

.translate-y-fully {
    --drawer-translate-y: 
		min(
			max(
				calc(100% + 20px - (var(--drawer-offset)) + var(--drawer-mouse-offset)), 
				0px), 
			calc(100% + 20px - var(--drawer-min-height)
		));
    transform: translate(var(--tw-translate-x), var(--drawer-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
</style>