export default getConfig();

function getConfig() {
    let config = {
        "watch": [],
        "watcherConfig": {
            "ignored": [],
            "followSymlinks": true,
            "awaitWriteFinish": {
                "stabilityThreshold": 2000,
                "pollInterval": 250
            },
            "usePolling": false,
            "interval": 250,
            "binaryInterval": 300
        },
        "callbackDelay": 100,
        "bindings": {}
    };

    if (typeof process.env.DOCKER_TEAMSTER_CONFIG !== 'undefined') {
        let userConfig = JSON.parse(process.env.DOCKER_TEAMSTER_CONFIG);

        config.watch = userConfig.watch || config.watch;
        config.watcherConfig.ignored = userConfig.ignore || config.watcherConfig.ignored;
        config.watcherConfig.usePolling = userConfig.usePolling || config.watcherConfig.usePolling;
        config.callbackDelay = userConfig.restartAwait || config.callbackDelay;
        config.bindings = userConfig.bindings || config.bindings;
    }

    return config
}



