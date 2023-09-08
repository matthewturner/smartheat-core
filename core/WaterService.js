const Duration = require('@matthewturner/durationjs');

const Service = require('./Service');

class WaterService extends Service {
    constructor(logger, context, thermostatFactory, thermostatRepository) {
        super(logger, context, thermostatFactory, thermostatRepository);
    }

    async turnOn(duration) {
        this._logger.debug(`Boosting water for ${duration}...`);

        const client = await this.login();
        try {
            await this.verifyOnline(client);
            const device = await client.device();
            this.verifyContactable(device);

            let d = duration;
            if (!d) {
                const thermostat = await this.obtainThermostat();
                d = thermostat.defaultWaterDuration;
            }
            const actualDuration = parseInt(new Duration(d).inHours());

            client.turnWaterOnFor(actualDuration);

            return this.createResponse(
                [`The water is now on for ${this.speakDuration(new Duration(d))}.`],
                client);
        } finally {
            await client.logout();
        }
    }

    async turnOff() {
        this._logger.debug('Turning water off...');

        const client = await this.login();
        try {
            await this.verifyOnline(client);
            const device = await client.device();
            this.verifyContactable(device);

            client.turnWaterOnFor(0);

            return this.createResponse(['The water is now off.'], client);
        } finally {
            await client.logout();
        }
    }
}

module.exports = WaterService;