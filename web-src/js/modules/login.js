(function ($, App, window) {
	'use strict';

	var form = null, //chpassMenuItem = null,

	formSubmit = function () {
		App.Post('login', form.formParams(), function (resp) {
			if (resp.result === 'success') location.href = './';
		});
		return false;
	},

	// changeMyPassword = function () {
	// 	var user = chpassMenuItem.data(), currentPass = window.prompt('What is your current password?', ''), newPass;
	// 	if (currentPass === null) return;
	// 	App.Post('login', { username: user.login, password: currentPass, remember: true }, function (res) {
	// 		if (res.result !== 'success') return;
	// 		newPass = window.prompt('What is your new password?', '');
	// 		if (newPass === null) return;
	// 		App.Put('users/' + user.id, { password: newPass }, function (res) {
	// 			if (res.result === 'success') App.Msg('Your password has been updated');
	// 		});
	// 	});
	// },

	init = function () {
		if (window.document.body.parentNode.className === 'login') {
			form = $('form:first');
			if (!form.length) return;
			form.on('submit', formSubmit);
		}
		// else {
		// 	chpassMenuItem = $('#menubar #btnChangePassword');
		// 	if (!chpassMenuItem.length) return;
		// 	chpassMenuItem.on('click', changeMyPassword);
		// }
	};

	App.Subscribe('app/ready', init);

}(jQuery, window.App, this));