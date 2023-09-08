const chai = require('chai');
chai.use(require('chai-as-promised'));
const expect = chai.expect;
const Factory = require('../../core/Factory');
const Logger = require('../../core/Logger');

const Mock = require('@matthewturner/smartheat-clients/clients/Mock');
const Salus = require('@matthewturner/smartheat-clients/clients/Salus');
const SalusApi = require('@matthewturner/smartheat-clients/clients/SalusApi');
const Heatmiser = require('@matthewturner/smartheat-clients/clients/Heatmiser');

const createTarget = () => {
    const logger = new Logger();

    return {
        logger: logger,
        object: () => {
            return new Factory(logger);
        }
    };
};

describe('Factory', () => {
    it('creates the mock client', () => {
        const target = createTarget();
        const client = target.object().create('mock');
        expect(client).to.not.be.null;
        expect(client).to.be.instanceOf(Mock);
    });

    it('creates the salus client', () => {
        const target = createTarget();
        const client = target.object().create('salus');
        expect(client).to.not.be.null;
        expect(client).to.be.instanceOf(Salus);
    });

    it('creates the salus api client', () => {
        const target = createTarget();
        const client = target.object().create('salus-api');
        expect(client).to.not.be.null;
        expect(client).to.be.instanceOf(SalusApi);
    });

    it('creates the heatmiser client', () => {
        const target = createTarget();
        const client = target.object().create('heatmiser');
        expect(client).to.not.be.null;
        expect(client).to.be.instanceOf(Heatmiser);
    });

    it('creates the dynamically specified client', () => {
        const target = createTarget();
        const client = target.object().create('@matthewturner/smartheat-clients/clients/Mock');
        expect(client).to.not.be.null;
        expect(client).to.be.instanceOf(Mock);
    });

    it('raises error when specified client is not included in package.json', () => {
        const target = createTarget();

        expect(() => target.object().create('smartheat-clients/clients/Mockx')).to
            .throw(Error, 'Unknown thermostat type smartheat-clients/clients/Mockx');
    });
});