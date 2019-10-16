//server//
const publisher = require(`zeromq`).socket(`pub`);
const subscriber = require(`zeromq`).socket(`sub`);
const sqlite3 = require('sqlite3').verbose();

publisher.bindSync(`tcp://127.0.0.1:5000`);
console.log('pub bound to port 5000');

subscriber.bindSync(`tcp://127.0.0.1:3000`);
console.log('sub bound to port 3000');

subscriber.subscribe(`api_in`);

subscriber.on(`message`, function (api_in, messIn) {
	let dataIn = JSON.parse(messIn);

	if (dataIn.type == 'login') {
		//require('./db');
		if (dataIn.email == '' || dataIn.pwd == '') {

			let errorData = {
				msg_id: dataIn.msg_id,
				status: "error",
				error: "WRONG_FORMAT - нет одного из полей или поля пустые"
			}

			const api_out = `api_out`;
			const messErr = JSON.stringify(errorData);

			publisher.send([api_out, messErr]);
			console.log('pub send');
			return console.log(new Error('WRONG_FORMAT` - нет одного из полей или поля пустые'));

		} else {
		let db = new sqlite3.Database('./sql/login.db');

		let sql = `SELECT 	user_id user_id,
							email email,
							passw passw
							FROM users
							WHERE email = ?`;
		let email = dataIn.email;

		db.get(sql, [email], (err, row) => {
			if (err) {
				return console.error(err.message);

			} else if (row == null) {

				let errorData = {
					msg_id: dataIn.msg_id,
					status: "error",
					error: "WRONG_PWD - неправильный логин"
				}

				const api_out = `api_out`;
				const messErr = JSON.stringify(errorData);

				publisher.send([api_out, messErr]);
				console.log('pub send');
				return console.log(new Error('WRONG_PWD - неправильный логин'));

			} else if (dataIn.pwd !== row.passw) {

				let errorData = {
					msg_id: dataIn.msg_id,
					status: "error",
					error: "WRONG_PWD - неправильный пароль"
				}

				const api_out = `api_out`;
				const messErr = JSON.stringify(errorData);

				publisher.send([api_out, messErr]);
				console.log('pub send');
				return console.log(new Error('WRONG_PWD - неправильный пароль'));

			} else {

				let succData = {
					msg_id: dataIn.msg_id,
					user_id: row.user_id,
					status: "ok"
				}

				const api_out = `api_out`;
				const messOut = JSON.stringify(succData);

				publisher.send([api_out, messOut]);
				return console.log('pub send');
			}
		});

		db.close((err) => {
			if (err) {
				return console.error(err.message);
			}
			return console.log('Close the database connection.');
		});
	}
}
});