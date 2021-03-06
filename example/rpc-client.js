#!/usr/bin/env node

const RabbitmqRPC = require('../src');

const client = new RabbitmqRPC();

let totalRequest = 100000000;

let requestPass = 0;
let requestFailed = 0;



async function sum (a, b){
	const start = Date.now();
	const result = await client.request('my.service.rpc', 'sum', {a, b}, {timeout: 2000});
	console.log(result);
	const ms = Date.now() - start;
	console.log(`${a} ${b} - ${ms} ms`);
	return result;

}

async function run (){
	// await sum(1, 1);
	// const start = Date.now();
	// const promisedBuffer = [];
	// for (let i = 0; i < totalRequest; i++){
	// 	console.log('Iteration ', i);
	// 	promisedBuffer.push(
	// 	sum(i, i).then((result) => {
	// 		requestPass++;
	// 		//console.log('sum '+i+'+'+i+'='+result);
	// 	})
	// 	.catch((err) => {
	// 		requestFailed++;
	// 		//console.log(err);
	// 	}));
	// }

	// console.log('######### Start');
	// await Promise.all(promisedBuffer);
	// console.log('######### End');
	// console.log('Request pass= ', requestPass);
	// console.log('Request failed= ', requestFailed);
	// const ms = Date.now() - start;
	// console.log('#### total time '+ms+ 'ms');

	for (let i = 0; i < totalRequest; i++){
		try{
			await sum(i, i);
		} catch(err){
			console.log(err);
		}

	}

	//await client.apply('my.service.rpc', 'sum', {a:10, b:11});
	process.exit(0);

}

run();
