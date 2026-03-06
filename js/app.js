/**
 * Smartlink Services Inc. - Main JavaScript
 * Ghana's Most Trusted Wireless ISP
 */

document.addEventListener('DOMContentLoaded', () => {
	// Initialize all modules
	initNavigation();
	initScrollEffects();
	initCounterAnimation();
	initFormValidation();
	initSmoothScroll();
	initHeroSlider();
});

/**
 * Hero Card Price Slider
 */
function initHeroSlider() {
	const slides = document.querySelectorAll('.hero__card-slide');
	const dots = document.querySelectorAll('.hero__card-dots .dot');
	const heroIcon = document.getElementById('hero-icon');

	if (!slides.length) return;

	let currentSlide = 0;
	const totalSlides = slides.length;

	// Icons for each slide
	const icons = [
		'fa-home', // Daily Unlimited
		'fa-building', // Weekly Unlimited
		'fa-database', // Monthly Unlimited
		'fa-network-wired', // Managed Network Support
		'fa-shield-alt', // Guaranteed Uptime
	];

	function showSlide(index) {
		// Remove active from all slides and dots
		slides.forEach((slide) => slide.classList.remove('active'));
		dots.forEach((dot) => dot.classList.remove('active'));

		// Add active to current slide and dot
		slides[index].classList.add('active');
		dots[index].classList.add('active');

		// Change icon
		if (heroIcon) {
			heroIcon.className = 'fas ' + icons[index] + ' wifi-icon';
		}
	}

	function nextSlide() {
		currentSlide = (currentSlide + 1) % totalSlides;
		showSlide(currentSlide);
	}

	// Auto-advance slides every 3 seconds
	let slideInterval = setInterval(nextSlide, 3000);

	// Click on dots to navigate
	dots.forEach((dot, index) => {
		dot.addEventListener('click', () => {
			currentSlide = index;
			showSlide(currentSlide);

			// Reset interval on manual navigation
			clearInterval(slideInterval);
			slideInterval = setInterval(nextSlide, 3000);
		});
	});

	// Pause on hover
	const heroCard = document.querySelector('.hero__card');
	if (heroCard) {
		heroCard.addEventListener('mouseenter', () => {
			clearInterval(slideInterval);
		});

		heroCard.addEventListener('mouseleave', () => {
			slideInterval = setInterval(nextSlide, 3000);
		});
	}
}

/**
 * Navigation Menu
 */
function initNavigation() {
	const navToggle = document.getElementById('nav-toggle');
	const navClose = document.getElementById('nav-close');
	const navMenu = document.getElementById('nav-menu');
	const navLinks = document.querySelectorAll('.nav__link');

	// Open menu
	if (navToggle) {
		navToggle.addEventListener('click', () => {
			navMenu.classList.add('show-menu');
			document.body.style.overflow = 'hidden';
		});
	}

	// Close menu
	if (navClose) {
		navClose.addEventListener('click', () => {
			navMenu.classList.remove('show-menu');
			document.body.style.overflow = '';
		});
	}

	// Close menu when clicking nav links
	navLinks.forEach((link) => {
		link.addEventListener('click', () => {
			navMenu.classList.remove('show-menu');
			document.body.style.overflow = '';

			// Update active link
			navLinks.forEach((l) => l.classList.remove('active'));
			link.classList.add('active');
		});
	});

	// Close menu when clicking outside
	document.addEventListener('click', (e) => {
		if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
			navMenu.classList.remove('show-menu');
			document.body.style.overflow = '';
		}
	});
}

/**
 * Scroll Effects
 */
function initScrollEffects() {
	const header = document.getElementById('header');
	const backToTop = document.getElementById('backToTop');
	const sections = document.querySelectorAll('section[id]');

	// Header scroll effect
	window.addEventListener('scroll', () => {
		const scrollY = window.scrollY;

		// Header background
		if (scrollY > 50) {
			header.classList.add('scrolled');
		} else {
			header.classList.remove('scrolled');
		}

		// Back to top button
		if (scrollY > 500) {
			backToTop.classList.add('show');
		} else {
			backToTop.classList.remove('show');
		}

		// Active navigation link based on scroll position
		updateActiveNavLink(sections);
	});

	// Back to top click
	if (backToTop) {
		backToTop.addEventListener('click', () => {
			window.scrollTo({
				top: 0,
				behavior: 'smooth',
			});
		});
	}
}

/**
 * Update active navigation link based on scroll position
 */
function updateActiveNavLink(sections) {
	const scrollY = window.scrollY;
	const navLinks = document.querySelectorAll('.nav__link');

	sections.forEach((section) => {
		const sectionHeight = section.offsetHeight;
		const sectionTop = section.offsetTop - 100;
		const sectionId = section.getAttribute('id');

		if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
			navLinks.forEach((link) => {
				link.classList.remove('active');
				if (link.getAttribute('href') === `#${sectionId}`) {
					link.classList.add('active');
				}
			});
		}
	});
}

/**
 * Counter Animation
 */
function initCounterAnimation() {
	const counters = document.querySelectorAll('[data-count]');

	const observerOptions = {
		root: null,
		rootMargin: '0px',
		threshold: 0.5,
	};

	const counterObserver = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				const counter = entry.target;
				const target = parseInt(counter.getAttribute('data-count'));
				animateCounter(counter, target);
				counterObserver.unobserve(counter);
			}
		});
	}, observerOptions);

	counters.forEach((counter) => {
		counterObserver.observe(counter);
	});
}

/**
 * Animate counter from 0 to target
 */
function animateCounter(element, target) {
	const duration = 2000;
	const increment = target / (duration / 16);
	let current = 0;

	const timer = setInterval(() => {
		current += increment;
		if (current >= target) {
			element.textContent = target;
			clearInterval(timer);
		} else {
			element.textContent = Math.floor(current);
		}
	}, 16);
}

/**
 * Form Validation and Submission
 */
function initFormValidation() {
	const form = document.getElementById('contact-form');

	if (form) {
		form.addEventListener('submit', async (e) => {
			e.preventDefault();

			// Get form data
			const formData = new FormData(form);
			const data = Object.fromEntries(formData.entries());

			// Basic validation
			if (!validateForm(data)) {
				return;
			}

			// Get submit button and show loading state
			const submitBtn = form.querySelector('button[type="submit"]');
			const originalText = submitBtn.innerHTML;
			submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
			submitBtn.disabled = true;

			try {
				// Option 1: Send to PHP backend
				const response = await fetch('send-message.php', {
					method: 'POST',
					body: formData,
				});

				const result = await response.json();

				if (result.success) {
					showFormMessage(result.message, 'success');
					form.reset();
				} else {
					showFormMessage(
						result.message || 'An error occurred. Please try again.',
						'error',
					);
				}

				// Option 2: If using Formspree, uncomment below and comment out Option 1
				/*
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    showFormMessage('Thank you! Your message has been sent successfully.', 'success');
                    form.reset();
                } else {
                    showFormMessage('Oops! There was a problem. Please try again or call us directly.', 'error');
                }
                */
			} catch (error) {
				console.error('Form submission error:', error);
				showFormMessage(
					'Network error. Please try calling us at 0202699110.',
					'error',
				);
			} finally {
				submitBtn.innerHTML = originalText;
				submitBtn.disabled = false;
			}
		});
	}
}

/**
 * Validate form fields
 */
function validateForm(data) {
	const { name, email, phone, service, message } = data;

	// Check required fields
	if (!name || !email || !phone || !service || !message) {
		showFormMessage('Please fill in all required fields.', 'error');
		return false;
	}

	// Validate email
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		showFormMessage('Please enter a valid email address.', 'error');
		return false;
	}

	// Validate phone (Ghana format)
	const phoneRegex = /^(\+233|0)[0-9]{9,10}$/;
	if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
		showFormMessage('Please enter a valid Ghana phone number.', 'error');
		return false;
	}

	return true;
}

/**
 * Show form message
 */
function showFormMessage(text, type) {
	// Remove existing message
	const existingMessage = document.querySelector('.form-message');
	if (existingMessage) {
		existingMessage.remove();
	}

	// Create message element
	const message = document.createElement('div');
	message.className = `form-message form-message--${type}`;
	message.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${text}</span>
    `;

	// Add styles
	message.style.cssText = `
        padding: 16px 20px;
        border-radius: 8px;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 500;
        animation: slideIn 0.3s ease;
        ${
					type === 'success'
						? 'background: #d1fae5; color: #065f46; border: 1px solid #34d399;'
						: 'background: #fee2e2; color: #991b1b; border: 1px solid #f87171;'
				}
    `;

	// Insert message
	const form = document.getElementById('contact-form');
	form.insertBefore(message, form.firstChild.nextSibling);

	// Auto remove after 5 seconds
	setTimeout(() => {
		message.style.animation = 'slideOut 0.3s ease forwards';
		setTimeout(() => message.remove(), 300);
	}, 5000);
}

/**
 * Smooth Scroll for anchor links
 */
function initSmoothScroll() {
	document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
		anchor.addEventListener('click', function (e) {
			const targetId = this.getAttribute('href');
			if (targetId === '#') return;

			const targetElement = document.querySelector(targetId);
			if (targetElement) {
				e.preventDefault();
				const headerOffset = 80;
				const elementPosition = targetElement.getBoundingClientRect().top;
				const offsetPosition = elementPosition + window.scrollY - headerOffset;

				window.scrollTo({
					top: offsetPosition,
					behavior: 'smooth',
				});
			}
		});
	});
}

/**
 * Intersection Observer for animations
 */
function initScrollAnimations() {
	const animatedElements = document.querySelectorAll(
		'.service-card, .pricing-card, .advantage-item, .feature-box',
	);

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add('animate-in');
					observer.unobserve(entry.target);
				}
			});
		},
		{
			threshold: 0.1,
			rootMargin: '0px 0px -50px 0px',
		},
	);

	animatedElements.forEach((el) => {
		el.style.opacity = '0';
		el.style.transform = 'translateY(30px)';
		el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
		observer.observe(el);
	});
}

// Add animation styles
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-10px);
        }
    }
`;
document.head.appendChild(animationStyles);

// Initialize scroll animations after page load
window.addEventListener('load', initScrollAnimations);

/**
 * Lazy load images
 */
function initLazyLoad() {
	const images = document.querySelectorAll('img[loading="lazy"]');

	if ('IntersectionObserver' in window) {
		const imageObserver = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const img = entry.target;
					img.src = img.dataset.src || img.src;
					img.classList.add('loaded');
					imageObserver.unobserve(img);
				}
			});
		});

		images.forEach((img) => imageObserver.observe(img));
	}
}

// Initialize lazy loading
initLazyLoad();

/**
 * Service Worker Registration (for PWA support)
 */
if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		// Service worker registration can be added here for PWA
		// navigator.serviceWorker.register('/sw.js');
	});
}

/**
 * Analytics tracking helper (placeholder for Google Analytics)
 */
function trackEvent(category, action, label) {
	if (typeof gtag !== 'undefined') {
		gtag('event', action, {
			event_category: category,
			event_label: label,
		});
	}
}

// Track CTA clicks
document.querySelectorAll('.btn').forEach((btn) => {
	btn.addEventListener('click', () => {
		const label = btn.textContent.trim();
		trackEvent('CTA', 'click', label);
	});
});

// Track phone calls
document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
	link.addEventListener('click', () => {
		trackEvent('Contact', 'phone_call', link.href);
	});
});

// Track WhatsApp clicks
document.querySelectorAll('a[href*="wa.me"]').forEach((link) => {
	link.addEventListener('click', () => {
		trackEvent('Contact', 'whatsapp_click', 'WhatsApp Contact');
	});
});

console.log('The Cloud Network Limited - Website Loaded Successfully');
