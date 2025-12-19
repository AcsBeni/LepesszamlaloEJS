
document.addEventListener('DOMContentLoaded', function () {
	function safeParse(str) {
		try { return JSON.parse(str); } catch (e) { return null; }
	}

	function getUserFromStorage() {
		return safeParse(sessionStorage.getItem('user'));
	}

	async function serverLogout() {
		try {
			await fetch('/users/logout', { method: 'POST', headers: { 'Accept': 'application/json' } });
		} catch (e) {
			console.warn('Server logout failed', e);
		}
	}

	window.Auth = {
		getUser() { return getUserFromStorage(); },
		setUser(u) { sessionStorage.setItem('user', JSON.stringify(u)); },
		async logout() {
			await serverLogout();
			sessionStorage.removeItem('user');
			window.location.href = '/login';
		}
	};
	const logoutEls = document.querySelectorAll('[data-auth="logout"], .auth-logout');
	logoutEls.forEach(el => el.addEventListener('click', function (e) {
		e.preventDefault();
		Auth.logout();
	}));
});

