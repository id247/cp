'use strict';

import 'whatwg-fetch';

export default (function(global, window, document, undefined){
	
	function _form(){
		const forms = document.querySelectorAll('.form');
		const messages = {
			empty: '',
			validationError: 'Заполните все поля!',
			processSubmit: 'Отправка данных...',
			successSubmit: 'Спасибо за оставленную заявку! <br> Мы свяжемся с вами в ближайшее время!',
			errorSubmit: 'Произошла ошибка сервиса! <br> Попробуйте отправить еще раз или свяжитесь с нами по e-mail',
		};

		function showMessage(message, messageId){
			message.innerHTML = messages[messageId];
		}

		function validationMessage(requiredFields, message){
			
			showMessage(message, 'empty');

			requiredFields && [].forEach.call(requiredFields, (field) => {
				if (field.classList.contains('error')){
					showMessage(message, 'validationError');
				}
			});
		}
			
		function isFieldValid(field){
			if (field.value.length > 0){				
				field.classList.remove('error');				
				return true;
			}else{
				field.classList.add('error');
			}
			return false;
		}

		function areFieldsValid(requiredFields){
			let valid = true;			

			requiredFields && [].forEach.call(requiredFields, (field) => {

				if (!isFieldValid(field)){
					valid = false;
				}
				
			});

			return valid;
		}

		function submitForm(form, message){

			const options =	{
				method: 'POST',
				mode: 'cors',
				headers: {
					'Accept': 'application/json'
				},
				body: new FormData(form),
			};

			function getError(response){
				console.error(response.statusText);
				showMessage(message, 'errorSubmit');
			}

			function getResponse(response){
				switch (response.status){
					case 200: 
						showMessage(message, 'successSubmit');
						break;
					default: 
						getError(response);
				}
			}

			showMessage(message, 'processSubmit');

			fetch(form.action, options)
			.then(getResponse)
			.catch(getError);
		}

		forms && [].forEach.call(forms, (form) => {
			const requiredFields = form.querySelectorAll('.required');
			const message = form.querySelector('.form__message');

			form.addEventListener('submit', (e) => {
				e.preventDefault();

				const isValid = areFieldsValid(requiredFields);
				validationMessage(requiredFields, message);

				if ( isValid ){
					console.log('submit');
					submitForm(form, message);
				}else{
					console.error('validation error');
				}
			})

			requiredFields && [].forEach.call(requiredFields, (field) => {

				field.addEventListener('keyup', (e) => {
					isFieldValid(field);
					validationMessage(requiredFields, message);
				})

				field.addEventListener('change', (e) => {
					isFieldValid(field);
					validationMessage(requiredFields, message);
				})
			})
		});
	}

	function init(){
		console.log('run');
		_form();
	}

	return{
		init
	}
})(global, window, document);
