const ThermostatService = require('../core/ThermostatService');
const DefaultsService = require('../core/DefaultsService');
const HoldStrategy = require('../core/HoldStrategy');
const Logger = require('../core/Logger');
const ThermostatRepository = require('../core/ThermostatRepository');
const Factory = require('smartheat-clients/clients/Factory');
const SetTemperatureStrategy = require('../core/SetTemperatureStrategy');

const logger = new Logger(Logger.DEBUG);

const report = (messages, logger) => {
    if (messages instanceof Array) {
        for (const message of messages) {
            logger.debug(message);
        }
    } else {
        logger.debug(messages);
    }
};

const reportOn = async (action) => {
    try {
        const {
            messages,
        } = await action();
        report(messages, logger);
    } catch (e) {
        report(e, logger);
    }
};

const createHoldStrategy = (context) => {
    return new HoldStrategy(logger, context);
};

const createRepository = () => {
    return new ThermostatRepository(logger);
};

const createContext = () => {
    return {
        userId: process.env.ALEXA_USER_ID,
        source: 'user'
    };
};

const main = async () => {
    const duration = process.env.DURATION;
    const context = createContext();
    let holdStrategy = createHoldStrategy(context);
    let repository = createRepository();
    let setTemperatureStrategy = new SetTemperatureStrategy();

    const factory = new Factory(logger);
    const thermostatService = new ThermostatService(logger, context, factory, repository, holdStrategy, setTemperatureStrategy);
    const defaultsService = new DefaultsService(logger, context, factory, repository);

    await reportOn(() => defaultsService.defaults());

    await reportOn(() => defaultsService.setDefault('defaultOnTemp', 22));

    await reportOn(() => defaultsService.defaults());

    await reportOn(() => thermostatService.turnOn(duration));

    await reportOn(() => thermostatService.status());

    await reportOn(() => thermostatService.turnOff());
};

main();