const Logger = require('./logger');
const Service = require('./service');

const uuid = require('uuid/v1');
const { ServiceBroker } = require('moleculer');

class RabbitmqRPC {
	constructor (opts) {
		const {
			url = 'nats://localhost:4222',
			logLevel = 'info',
			logName = 'RabbitmqRPC',
			timeout = 10000,
			log
		} =
			opts || {};

		this._log =
			log ||
			Logger({
				level: logLevel,
				name: logName
			});

		this._timeout = timeout;
		this._url = url;

		this._brokerOptions = {
			transporter: url,
			logLevel,
			timeout
		};

		this._broker = new ServiceBroker(this._brokerOptions);
	}

	request (serviceName, method, data, options) {
		console.log(`------------------------ request service ${serviceName} with method ${method}`);
		// const requestId = uuid();
		let { timeout = this._timeout } = options || {};

		return this._broker.call(`${serviceName}.${method}`, data, {
			timeout
		});
	}

	apply (serviceName, method, data, options) {
		const content = JSON.stringify(data);
		const { timeout } = options || {};

		const messageOptions = {
			type: method
		};
		if (timeout) {
			messageOptions.expiration = timeout;
		}
		this._broker.call(`${serviceName}.${method}`, content, messageOptions);
	}

	createService (name, opts) {
		return new Service(this._broker, name, opts, this._connectionOptions, this._log);
	}

	start () {
		this._broker.start();
	}
}

module.exports = RabbitmqRPC;
