gsap.registerPlugin(ScrollTrigger, ScrollSmoother, Observer);
gsap.config({ trialWarn: false });

console.clear();

const wrapper = document.querySelector('#wrapper');
const content = document.querySelector('#content');
const sections = document.querySelector('.sections');
const section1 = document.querySelector('.section-1');

let winWidth = window.innerWidth;
let smoother, observer, direction;

// Desktop Only
if (!ScrollTrigger.isTouch !== 1) {
	smoother = ScrollSmoother.create({
		wrapper: wrapper,
		content: content,
		smooth: 0.8,
		effects: true
	}).paused(true);
}

// Observer
function initObserver() {
	observer = Observer.create({
		target: document.body,
		ignore: '[data-ignore]',
		type: 'pointer',
		onToggleY: (self) => {
			updateDirection(self);
		},
		onPress: (self) => {
			gsap.set(content, {
				cursor: 'grabbing'
			});
			
			updateDirection(self, true);

			gsap.to('body', {
				backgroundColor: '#111',
				duration: 0.5
			});
			gsap.to(section1, {
				scale: 0.97,
				duration: 0.5
			});
		},
		onRelease: (self) => {
			gsap.set(content, {
				cursor: 'grab'
			});
			gsap.to(section1, {
				rotateX: '0deg'
			});
			gsap.to('body', {
				backgroundColor: '#222',
				duration: 0.5
			});
			gsap.to(section1, {
				scale: 1,
				duration: 0.5
			});
		},
		tolerance: 10
	});
}

// Update Direction
function updateDirection(theObserver, immediate = false) {
	const perspectiveOriginX = Math.floor(100 - theObserver.startX / winWidth * 100);
	const perspectiveOriginY = Math.floor(smoother.scrollTrigger.animation.progress() * 100);
	
	if (immediate) {
		gsap.set(sections, {
			perspectiveOrigin: `${perspectiveOriginX}% ${perspectiveOriginY}%`
		});
	} else {
		gsap.to(sections, {
			perspectiveOrigin: `${perspectiveOriginX}% ${perspectiveOriginY}%`,
			duration: 0.5
		});
	}
	
	direction = (theObserver.deltaY < 0 ? 'up' : 'down');
	
	if (direction === 'up') {
		gsap.to(section1, {
			rotateX: '3deg',
			duration: 0.5
		});
	} else {
		gsap.to(section1, {
			rotateX: '-3deg',
			duration: 0.5
		});
	}
}

// Section 1 Animations
const introTl = gsap.timeline();

introTl.fromTo(section1, {
	transformOrigin: 'center bottom',
	autoAlpha: 0,
	yPercent: 50
}, {
	autoAlpha: 1,
	yPercent: 0,
	duration: 1,
	delay: 1,
	ease: 'expo'
})
.from('.title-1 .title-text', {
	yPercent: 100,
	duration: 1,
	ease: 'power3'
}, 1.5)
.from('.title-2 .title-text', {
	autoAlpha: 0,
	duration: 1.5
}, 2)
.from('.sub-title-1', {
	autoAlpha: 0,
	x: 30,
	duration: 0.5,
	ease: 'power3'
}, '-=1')
.from('.sub-title-2', {
	autoAlpha: 0,
	x: -30,
	duration: 0.5,
	ease: 'power3'
}, '-=1')
.from('.credit', {
	autoAlpha: 0,
	duration: 0.3,
	onComplete: () => {
		initPage();
	}
}, '-=1');

// Section 2 Animation
gsap.fromTo('.section-2 .info', {
	autoAlpha: 0,
}, {
	autoAlpha: 1,
	duration: 2,
	scrollTrigger: {
		scrub: true,
		trigger: '.section-2 .info',
		start: 'center 80%',
		end: 'center center'
	}
});



// Init Page
function initPage() {
	if (smoother) {
		ScrollTrigger.normalizeScroll({
			ignore: '[data-ignore]',
			type: 'pointer,wheel'
		});
		smoother.paused(false);
		initObserver();
	}

	gsap.set(content, {
		cursor: 'grab'
	});

	gsap.to('.indicator', {
		autoAlpha: 1,
		duration: 1,
		onComplete: () => {
			gsap.fromTo('.indicator', {
				autoAlpha: 1,
			}, {
				autoAlpha: 0,
				duration: 1,
				scrollTrigger: {
					scrub: true,
					trigger: '.indicator',
					start: 'center 80%',
					end: 'center 70%'
				}
			});
		}
	});
}

// Resize
function onResize() {
	winWidth = window.innerWidth;
	ScrollTrigger.refresh();
}
window.addEventListener('resize', onResize);

// Dev Credit
console.log('%c%s', 'border-radius: 6px; padding: 8px; color: #ffffff; background: #4801ff;', '✨ Developed by: Van Holtz Co — https://vanholtz.co');





