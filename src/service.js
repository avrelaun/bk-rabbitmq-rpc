class Service {
	constructor (broker, serviceName, opts, connectionOptions, log) {
		const { limit = false } = opts || {};

		this.isConsumerStarted = false;
		this._log = log;
		this.limit = limit;
		this._broker = broker;

		if (!serviceName) {
			throw new Error('you must provide a service name');
		}
		this._schema = {
			name: serviceName,
			action: {
			}
		};
	}

	handle (method, callback) {
		if (this._schema.action[method]) {
			throw new Error('handler already define');
		}
		this._schema.action[method] = callback;
	}

	startConsume () {
		console.log('-------- SCHEMA', this._schema);
		this._broker.createService(this._schema);
	}
}

module.exports = Service;
