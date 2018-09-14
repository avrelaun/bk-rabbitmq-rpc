const Logger = require('./logger');
const Service = require('./service');

const uuid = require('uuid/v1');
const { ServiceBroker } = require('moleculer');

class RabbitmqRPC {
	constructor (opts) {
		const {
			url = 'amqp://guest:guest@localhost:5672/',
			logLevel = 'info',
			logName = 'RabbitmqRPC',
			exchangeName = 'RabbitmqRPC',
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
			url,
			log: this._log,
			exchangeName
		};

		this._broker = new ServiceBroker(this._brokerOptions, 'requestConnection');
	}

	request (serviceName, method, data, options) {
		const requestId = uuid();
		const content = JSON.stringify(data);
		let { timeout = this._timeout } = options || {};

		this._broker.call(`${serviceName}.${method}`, content, {
			expiration: timeout,
			correlationId: requestId,
			type: method
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
}

module.exports = RabbitmqRPC;
