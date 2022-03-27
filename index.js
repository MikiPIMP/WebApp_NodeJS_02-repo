const http = require('http');

const server = http.createServer(requestHandler);

async function requestHandler(request, response) {

	let data = {};

	if(request.method === 'GET' && request.url === '/getRandomNumber/'){
		data = sendRandomNumber();
		 
	}else if(request.method === 'POST' && request.url === '/checkStudentInfo/'){
		let studentInformation = await exrtactBodyData(request);
		data = checkStudentInformation(studentInformation);
	}

	response.writeHead(200, {
		'Content-type': 'application/json'
	});

	response.write(JSON.stringify(data));
	response.end();
}

function exrtactBodyData(request){

	return new Promise((resolve, reject) => {
		let parts = [];
		request.on('data', part => parts.push(part));
		request.on('end', () => {
			resolve((Buffer.concat(parts)).toString());
		});
	});
}

function sendRandomNumber(){
	const num = Number(Math.random() * 10000).toFixed(0);
	return {
		randomNumber: num
	};
}

function checkStudentInformation(studentInformation){
	const student = JSON.parse(studentInformation);
	if(student.forename.length < 3){
		return {
			status: false,
			reason: 'Forename'
		};
	}
	if(student.surename.length < 3){
		return {
			status: false,
			reason: 'Surename'
		};
	}
	if(student.index.length != 10){
		return {
			status: false,
			reason: 'Index'
		};
	}

	return{
		status: true
	};
}
server.listen(4000);
