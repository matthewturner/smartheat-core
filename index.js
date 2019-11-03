const SmartHeat = {
    core: {
        Service: require('./core/Service'),
        DefaultsService: require('./core/DefaultsService'),
        HoldStrategy: require('./core/HoldStrategy'),
        Logger: require('./core/Logger'),
        SetTemperatureStrategy: require('./core/SetTemperatureStrategy'),
        ThermostatRepository: require('./core/ThermostatRepository'),
        ThermostatService: require('./core/ThermostatService'),
        WaterService: require('./core/WaterService'),
    }
};

module.exports = SmartHeat;