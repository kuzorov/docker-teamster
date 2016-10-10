import config from './../config.js';
import Docker from 'dockerode';
import timestamp from 'console-timestamp'

/**
 * Map bindings and restart docker containers
 *
 * @param {Array} files
 */
export default function (files) {
    let restartContainersList = [];
    let bindings = {};
    Object.assign(bindings, config.bindings);

    /*
     * Scan bindings and add containers that have to be restarted
     * */
    files.forEach(file => {
        for (let key in bindings) {
            var pattern = new RegExp(bindings[key]);

            if (pattern.test(file)) {
                restartContainersList.push(key);
                delete bindings[key];
            }
        }
    });

    if (restartContainersList.length === 0) {
        return;
    }

    restartContainers(restartContainersList);
}

/**
 * Restart containers
 *
 * @param {Array} containers
 */
function restartContainers(containers) {
    let docker = new Docker({socketPath: '/var/run/docker.sock'});
    containers.forEach(containerName=> {
        docker.listContainers({"filters": {label: [`com.docker.compose.service=${containerName}`]}},
            (err, containers)=> {
                containers.forEach(container => {
                    let containerInstance = docker.getContainer(container.Id);
                    containerInstance.restart(()=> {
                        console.log(`[${timestamp()}] Container ${containerName} with id ${container.Id} restarted.`);
                    });
                });
            }
        );
    })
}