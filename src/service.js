class Service {
	constructor (broker, serviceName, opts, connectionOptions, log) {
		const { limit = false } = opts || {};

		this._handler = {};
		this.isConsumerStarted = false;
		this._log = log;
		this.limit = limit;
		this._broker = broker;

		if (!serviceName) {
			throw new Error('you must provide a service name');
		}
		this.serviceName = serviceName;
	}

	handle (method, callback) {
		if (this._handler[method]) {
			throw new Error('handler already define');
		}
		this._handler[method] = callback;
	}

	startConsume () {
		this._broker.loadService(this._handler);
	}
}

module.exports = Service;
