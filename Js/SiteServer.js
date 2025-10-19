document.addEventListener('DOMContentLoaded', function(){
	initScrollAnimations();
	initInteractiveCards();
  initNotifications();
	initServerStatus();
	initCopyIP();
	initDarkTheme();
	initImagePreloader();
	initHeaderAnimation();
})

function initScrollAnimations() {
	const animatedElements = document.querySelectorAll(
		'.feature-card, .info-block, .rule-item, .mod-category'
	);

	const observer = new IntersectionObserver(
		entries => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					entry.target.style.opacity = '1';
					entry.target.style.transform = 'translateY(0)';
				}
			});
		},
		{
			threshold: 0.1,
			rootMargin: '0px 0px -50px 0px',
		}
	);

	animatedElements.forEach(element => {
		element.style.opacity = '0';
		element.style.transform = 'translateY(30px)';
		element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
		observer.observe(element);
	});
}

function initInteractiveCards() {
	const cards = document.querySelectorAll(
		'.feature-card, .info-block, .rule-item'
	);

	cards.forEach(card => {
		card.addEventListener('mouseenter', function () {
			this.style.transform = 'translateY(-10px) scale(1.02)';
			this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
		});

		card.addEventListener('mouseleave', function () {
			this.style.transform = 'translateY(0) scale(1)';
			this.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
		});

		card.addEventListener('click', function () {
			playClickSound();
		});
	});
}

function initNotifications() {
	const notificationContainer = document.createElement('div');
	notificationContainer.className = 'notification-container';
	notificationContainer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        max-width: 300px;
    `;
	document.body.appendChild(notificationContainer);

	window.showNotification = function (message, type = 'info') {
		const notification = document.createElement('div');
		notification.className = `notification notification-${type}`;
		notification.style.cssText = `
            background: ${
							type === 'success'
								? '#4caf50'
								: type === 'error'
								? '#f44336'
								: '#2196f3'
						};
            color: white;
            padding: 15px 20px;
            margin-bottom: 10px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transform: translateX(100%);
            opacity: 0;
            transition: all 0.3s ease;
            cursor: pointer;
        `;
		notification.textContent = message;

		notificationContainer.appendChild(notification);

		setTimeout(() => {
			notification.style.transform = 'translateX(0)';
			notification.style.opacity = '1';
		}, 100);

		setTimeout(() => {
			hideNotification(notification);
		}, 5000);

		notification.addEventListener('click', () =>
			hideNotification(notification)
		);
	};

	function hideNotification(notification) {
		notification.style.transform = 'translateX(100%)';
		notification.style.opacity = '0';
		setTimeout(() => {
			if (notification.parentNode) {
				notification.parentNode.removeChild(notification);
			}
		}, 300);
	}
}

function initServerStatus() {
	const statusElement = document.createElement('div');
	statusElement.id = 'server-status';
	statusElement.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        background: #4caf50;
        color: white;
        padding: 8px 12px;
        border-radius: 20px;
        font-size: 12px;
        z-index: 999;
        display: flex;
        align-items: center;
        gap: 5px;
    `;

	const statusDot = document.createElement('div');
	statusDot.style.cssText = `
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #fff;
        animation: pulse 2s infinite;
    `;

	statusElement.appendChild(statusDot);
	statusElement.appendChild(document.createTextNode('Онлайн'));

	document.body.appendChild(statusElement);

	const style = document.createElement('style');
	style.textContent = `
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
    `;
	document.head.appendChild(style);
}

function initCopyIP() {
	if (document.querySelector('.hero-text')) {
		const ipButton = document.createElement('button');
		ipButton.textContent = '📋 Скопировать IP';
		ipButton.style.cssText = `
            background: var(--accent);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            margin-top: 15px;
            font-size: 14px;
            transition: background 0.3s;
        `;

		ipButton.addEventListener('mouseenter', () => {
			ipButton.style.background = '#f57c00';
		});

		ipButton.addEventListener('mouseleave', () => {
			ipButton.style.background = 'var(--accent)';
		});

		ipButton.addEventListener('click', () => {
			const ip = 'c8.play2go.cloud:20033'; 

			navigator.clipboard
				.writeText(ip)
				.then(() => {
					showNotification('✅ IP-адрес скопирован в буфер обмена!', 'success');
					ipButton.textContent = '✅ Скопировано!';
					setTimeout(() => {
						ipButton.textContent = '📋 Скопировать IP';
					}, 2000);
				})
				.catch(() => {
					showNotification('❌ Не удалось скопировать IP', 'error');
				});
		});

		document.querySelector('.hero-text').appendChild(ipButton);
	}
}

function initDarkTheme() {
	const themeToggle = document.createElement('button');
	themeToggle.textContent = '🌙';
	themeToggle.title = 'Переключить тему';
	themeToggle.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--primary);
        color: white;
        border: none;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
        z-index: 999;
        font-size: 20px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: all 0.3s;
    `;

	document.body.appendChild(themeToggle);

	const savedTheme = localStorage.getItem('theme');
	if (savedTheme === 'dark') {
		enableDarkTheme();
		themeToggle.textContent = '☀️';
	}

	themeToggle.addEventListener('click', () => {
		if (document.body.classList.contains('dark-theme')) {
			disableDarkTheme();
			themeToggle.textContent = '🌙';
		} else {
			enableDarkTheme();
			themeToggle.textContent = '☀️';
		}
	});
}

function enableDarkTheme() {
	document.body.classList.add('dark-theme');
	localStorage.setItem('theme', 'dark');

	if (!document.getElementById('dark-theme-styles')) {
		const style = document.createElement('style');
		style.id = 'dark-theme-styles';
		style.textContent = `
            .dark-theme {
                --background: #1a1a1a;
                --surface: #2d2d2d;
                --text: #ffffff;
                --text-light: #b0b0b0;
            }
            
            .dark-theme .feature-card,
            .dark-theme .info-block,
            .dark-theme .rule-item,
            .dark-theme .mod-category {
                border: 1px solid #404040;
            }
        `;
		document.head.appendChild(style);
	}
}

function disableDarkTheme() {
	document.body.classList.remove('dark-theme');
	localStorage.setItem('theme', 'light');
}

function initImagePreloader() {
	const images = document.querySelectorAll('img');

	images.forEach(img => {

		img.style.opacity = '0';
		img.style.transition = 'opacity 0.3s ease';

		img.addEventListener('load', function () {
			this.style.opacity = '1';
		});

		img.addEventListener('error', function () {
			this.style.opacity = '1';
			console.warn('Не удалось загрузить изображение:', this.src);
		});
	});
}

function initHeaderAnimation() {
	const header = document.querySelector('.header');
	let lastScrollY = window.scrollY;

	window.addEventListener('scroll', () => {
		if (window.scrollY > 100) {
			header.style.background = 'rgba(46, 125, 50, 0.95)';
			header.style.backdropFilter = 'blur(10px)';
		} else {
			header.style.background = 'var(--primary)';
			header.style.backdropFilter = 'none';
		}

		if (window.scrollY > lastScrollY && window.scrollY > 200) {
			header.style.transform = 'translateY(-100%)';
		} else {
			header.style.transform = 'translateY(0)';
		}

		lastScrollY = window.scrollY;
	});
}

function playClickSound() {
	const audioContext = new (window.AudioContext || window.webkitAudioContext)();
	const oscillator = audioContext.createOscillator();
	const gainNode = audioContext.createGain();

	oscillator.connect(gainNode);
	gainNode.connect(audioContext.destination);

	oscillator.frequency.value = 800;
	oscillator.type = 'sine';

	gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
	gainNode.gain.exponentialRampToValueAtTime(
		0.01,
		audioContext.currentTime + 0.1
	);

	oscillator.start(audioContext.currentTime);
	oscillator.stop(audioContext.currentTime + 0.1);
}

window.showModal = function (title, content) {
	const modal = document.createElement('div');
	modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s;
    `;

	const modalContent = document.createElement('div');
	modalContent.style.cssText = `
        background: var(--surface);
        padding: 30px;
        border-radius: 12px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        transform: scale(0.9);
        transition: transform 0.3s;
    `;

	modalContent.innerHTML = `
        <h2 style="margin-bottom: 15px; color: var(--primary);">${title}</h2>
        <div>${content}</div>
        <button onclick="this.closest('.modal').remove()" 
                style="margin-top: 20px; padding: 8px 16px; background: var(--primary); color: white; border: none; border-radius: 6px; cursor: pointer;">
            Закрыть
        </button>
    `;

	modal.appendChild(modalContent);
	modal.className = 'modal';
	document.body.appendChild(modal);

	setTimeout(() => {
		modal.style.opacity = '1';
		modalContent.style.transform = 'scale(1)';
	}, 10);

	modal.addEventListener('click', e => {
		if (e.target === modal) {
			modal.remove();
		}
	});
};

document.addEventListener('keydown', function (e) {
	if (e.ctrlKey && e.key === 'd') {
		e.preventDefault();
		document.querySelector('button[title="Переключить тему"]').click();
	}

	if (e.key === 'Escape') {
		const modals = document.querySelectorAll('.modal');
		modals.forEach(modal => modal.remove());

		const notifications = document.querySelectorAll('.notification');
		notifications.forEach(notification => notification.remove());
	}
});
