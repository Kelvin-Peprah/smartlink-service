document.addEventListener('DOMContentLoaded', () => {
	// Card data with MB values and target percentages
	const cards = [
		{
			current: 10,
			targetPercent: 0.4,
			progressId: 'progressArc1',
			labelId: 'data-used1',
		},
		{
			current: 20,
			targetPercent: 0.6,
			progressId: 'progressArc2',
			labelId: 'data-used2',
		},
		{
			current: 50,
			targetPercent: 0.9,
			progressId: 'progressArc3',
			labelId: 'data-used3',
		},
	];

	const pathLength = 283; // half circle length
	const duration = 1200;
	const fps = 60;
	const totalFrames = duration / (1000 / fps);

	// Initialize animations for all cards
	cards.forEach((card) => {
		const path = document.getElementById(card.progressId);
		const label = document.getElementById(card.labelId);

		path.style.strokeDasharray = pathLength;
		path.style.strokeDashoffset = pathLength;

		let frame = 0;

		function animate() {
			frame++;
			const progress = frame / totalFrames;

			// Calculate progress bar offset based on target percentage
			const progressOffset = pathLength * (1 - progress * card.targetPercent);

			// Calculate MB value to display
			const mbValue = Math.round(progress * card.current);

			path.style.strokeDashoffset = progressOffset;
			label.textContent = `${mbValue} MB`;

			if (frame < totalFrames) {
				requestAnimationFrame(animate);
			} else {
				// Ensure final values are exact
				path.style.strokeDashoffset = pathLength * (1 - card.targetPercent);
				label.textContent = `${card.current} MB`;
			}
		}

		// Start animation after a small delay for staggering effect
		setTimeout(() => {
			requestAnimationFrame(animate);
		}, cards.indexOf(card) * 200);
	});
});
