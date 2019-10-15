const sqlite3 = require('sqlite3').verbose();

// open the database
let db = new sqlite3.Database('./sql/login.db');

let sql = `SELECT user_id user_id,
									email email,
									passw passw
						FROM users
						WHERE email = ?`;
let email = jso.email;

// first row only
db.get(sql, [email], (err, row) => {
	if (err) {
		return console.error(err.message);
	} else if (row.passw == jso.passw){
		return console.log('lol');
	}
	//return row ?

		//console.log(`${row.user_id} ${row.email} - ${row.passw}`) :
		//console.log(`No user found with the id ${email}`);
});

// close the database connection
db.close((err) => {
	if (err) {
		return console.error(err.message);
	}
	console.log('Close the database connection.');
});