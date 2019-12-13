class Factory {
    constructor(logger) {
        this._logger = logger;
    }

    create(type, options) {
        switch (type) {
            case 'mock': {
                const Mock = require('smartheat-clients/clients/Mock');
                return new Mock(this._logger, options);
            }
            case 'salus': {
                const Salus = require('smartheat-clients/clients/Salus');
                return new Salus(this._logger, options);
            }
            case 'salus-api': {
                const SalusApi = require('smartheat-clients/clients/SalusApi');
                return new SalusApi(this._logger, options);
            }
            case 'heatmiser': {
                const Heatmiser = require('smartheat-clients/clients/Heatmiser');
                return new Heatmiser(this._logger, options);
            }
            default: {
                try {
                    const Type = require(type);
                    return new Type(this._logger, options);
                } catch (e) {
                    throw new Error(`Unknown thermostat type ${type}`);
                }
            }
        }
    }
}

module.exports = Factory;