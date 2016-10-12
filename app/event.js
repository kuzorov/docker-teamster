import config from './../config.js';
import Docker from 'dockerode';
import timestamp from 'console-timestamp'

/**
 * Map bindings and restart docker containers
 *
 * @param {Array} files
 */
export default function (files) {
    let restartServicesList = [];
    let bindings = {};
    Object.assign(bindings, config.bindings);

    /*
     * Scan bindings and add services that have to be restarted
     * */
    files.forEach(file => {
        for (let serviceName in bindings) {
            var pattern = new RegExp(bindings[serviceName]);

            if (pattern.test(file)) {
                restartServicesList.push(serviceName);
                delete bindings[serviceName];
            }
        }
    });

    if (restartServicesList.length === 0) {
        return;
    }

    restartServices(restartServicesList);
}

/**
 * Restart services
 *
 * @param {Array} services
 */
function restartServices(services) {
    let docker = new Docker({socketPath: '/var/run/docker.sock'});
    services.forEach(serviceName=> {
        docker.listContainers({"filters": {label: [`com.docker.compose.service=${serviceName}`]}},
            (err, containers)=> {
                containers.forEach(container => {
                    let containerInstance = docker.getContainer(container.Id);
                    containerInstance.restart(()=> {
                        console.log(`[${timestamp()}] ${serviceName} service container (${container.Id}) restarted.`);
                    });
                });
            }
        );
    })
}