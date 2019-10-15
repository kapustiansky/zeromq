const publisher = require(`zeromq`).socket(`pub`);
const subscriber = require(`zeromq`).socket(`sub`);
const readline = require('readline');

publisher.connect(`tcp://127.0.0.1:3000`);
console.log('pub connected to port 3000');

subscriber.connect(`tcp://127.0.0.1:5000`);
console.log('sub connected to port 5000');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

async function readLine(str) {
	return new Promise(resolve => {
		rl.question(str, answer => {
			resolve(answer);
		});
	});
}

(async function main() {
	let email = await readLine("Enter email: ");
	let password = await readLine("Enter password: ");
	sendMess(email, password);
})();

function sendMess(email, password) {

	let dataIn = {
		type: "login",
		email: email,
		pwd: password,
		msg_id: "yyy"
	};

	const api_in = `api_in`;
	const messIn = JSON.stringify(dataIn);

	publisher.send([api_in, messIn]);
	return console.log('pub send');
}

subscriber.subscribe(`api_out`);

subscriber.on(`message`, function (api_out, messOut) {
	let dataOut = JSON.parse(messOut);

	if (dataOut.status == 'error') {
		return console.log(`${api_out} - ${dataOut.error}`);
	} else {
		return console.log(`${api_out} - ${dataOut.status}`);
	}
});