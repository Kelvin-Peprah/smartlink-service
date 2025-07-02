// Animation for package cards
document.addEventListener('DOMContentLoaded', function () {
	const packages = document.querySelectorAll('.package');

	// Add animate class after a short delay
	setTimeout(() => {
		packages.forEach((pkg) => {
			pkg.classList.add('animate');
		});
	}, 300);

	// Tab switching functionality
	const tabs = document.querySelectorAll('.tab');
	tabs.forEach((tab) => {
		tab.addEventListener('click', function () {
			tabs.forEach((t) => t.classList.remove('active'));
			this.classList.add('active');
		});
	});

	// Button hover effect enhancement
	const buttons = document.querySelectorAll('.btn');
	buttons.forEach((button) => {
		button.addEventListener('mouseenter', function () {
			this.style.background = 'linear-gradient(to right, #7c3aed, #3b82f6)';
		});

		button.addEventListener('mouseleave', function () {
			this.style.background = 'linear-gradient(to right, #3b82f6, #7c3aed)';
		});

		button.addEventListener('click', function () {
			const packageTitle =
				this.closest('.package').querySelector('.package-title').textContent;
			this.innerHTML = '<i class="fas fa-check"></i> SELECTED';
			this.style.background = 'linear-gradient(to right, #10b981, #06b6d4)';

			// Reset other buttons after a delay
			setTimeout(() => {
				buttons.forEach((btn) => {
					if (btn !== this) {
						btn.innerHTML = 'GET STARTED';
						btn.style.background =
							'linear-gradient(to right, #3b82f6, #7c3aed)';
					}
				});
			}, 2000);
		});
	});

	// Package hover effect
	packages.forEach((pkg) => {
		pkg.addEventListener('mouseenter', function () {
			const highlight = this.querySelector('.package-highlight');
			highlight.style.opacity = '1';
			highlight.style.transform = 'scale(1)';
		});

		pkg.addEventListener('mouseleave', function () {
			const highlight = this.querySelector('.package-highlight');
			highlight.style.opacity = '0';
			highlight.style.transform = 'scale(0.5)';
		});
	});
});
