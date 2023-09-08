const chai = require('chai');
chai.use(require('chai-as-promised'));
const expect = chai.expect;
const sinon = require('sinon');
const Duration = require('@matthewturner/durationjs');
const DefaultsService = require('../../core/DefaultsService');
const Mock = require('@matthewturner/smartheat-clients/clients/Mock');
const HoldStrategy = require('../../core/HoldStrategy');
const Logger = require('../../core/Logger');

const createTarget = () => {
    const logger = new Logger();
    const context = {
        userId: 'user123',
        source: 'user'
    };
    const thermostatRepository = sinon.fake();
    thermostatRepository.find = sinon.stub();
    const thermostat = {
        type: 'mock',
        defaultOnTemp: 22,
        defaultOffTemp: 14,
        defaultDuration: 'PT1H',
        options: {}
    };
    thermostatRepository.find.withArgs('user123').returns(thermostat);

    thermostatRepository.save = sinon.stub();

    const thermostatFactory = sinon.fake();
    thermostatFactory.create = sinon.stub();
    const client = new Mock(logger);
    thermostatFactory.create.withArgs(thermostat.type, {}).returns(client);

    return {
        logger: logger,
        context: context,
        client: client,
        thermostatFactory: thermostatFactory,
        thermostatRepository: thermostatRepository,
        object: () => {
            return new DefaultsService(logger, context,
                thermostatFactory, thermostatRepository);
        }
    };
};

describe('DefaultsService', async () => {
    describe('SetDefault', async () => {
        it('updates the default on temperature', async () => {
            const target = createTarget();

            const {
                messages,
            } = await target.object().setDefault('on', 25);

            expect(messages[0]).to.equal('The default on temperature has been set to 25 degrees.');
        });

        it('updates the default off temperature', async () => {
            const target = createTarget();

            const {
                messages,
            } = await target.object().setDefault('off', 10);

            expect(messages[0]).to.equal('The default off temperature has been set to 10 degrees.');
        });

        it('updates the default duration temperature', async () => {
            const target = createTarget();

            const {
                messages,
            } = await target.object().setDefault('duration', 'PT2H');

            expect(messages[0]).to.equal('The default duration has been set to 2 hours.');
        });
    });

    describe('Speak duration', async () => {
        it('handles between 1 and 2 hours correctly', async () => {
            const target = createTarget();

            const {
                messages,
            } = await target.object().setDefault('duration', 'PT1H30M');

            expect(messages[0]).to.equal('The default duration has been set to 1 hour and 30 minutes.');
        });
    });
});