# docker-teamster

Using [chokidar](https://github.com/paulmillr/chokidar) and [dockerode](https://github.com/apocas/dockerode) to watch
 for changes in project files and restart docker containers.
 
# How to use
 
After cloning repo install node modules:

	npm install
	
Or use prepare-codebase.sh script:
	
	sh prepare-codebase.sh
	
To specify configuration for the script you would need to set enviroment variable accross your host system or docker 
container, also you need to mount volumes that you wold watch and docker socket.

Docker compose part example that mounts:
	
	volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - [your_local_project_path_1]:/data/[project_1]
      - [your_local_project_path_2]:/data/[project_2]
      
Example of configuration variable:

	environment:
      - >
        DOCKER_TEAMSTER_CONFIG=
          {
            "watch": [
              "/data/[project_1]",
              "/data/[project_2]"
            ],
            "ignore": [
              "**/node_modules/**",
              "**/vendor/**",
              "**/.git/**",
              "**/.idea/**"
            ],
            "bindings": {
              "[service_type_1]": "[project_1]",
              "[service_type_2]": "[project_2]"
            },
            "usePolling": ${DOCKER_TEAMSTER_LEGACY},
            "restartAwait": 100,
          }
          
## Config explanation

* `watch` (string or array of strings). Paths to files, dirs to be watched recursively, or glob patterns.
* `ignore`  ([anymatch](https://github.com/es128/anymatch)-compatible definition) Defines files/paths to be ignored.
* `bindings` (object of key -> value pairs) keys are docker service names and values are regexps that should be used 
to test paths of files that was changed
* `usePolling` (default: false). Whether to use fs.watchFile (backed by polling), or fs.watch. If polling leads to 
high CPU utilization, consider setting this to false. It is typically necessary to set this to true to successfully 
watch files over a network, and it may be necessary to successfully watch files in other non-standard situations. Use
 environment variable `DOCKER_TEAMSTER_LEGACY` to manage this param inside docker containers.
* `restartAwait` number of milliseconds to collect array of changed files before restart event fire (default 100). 
Used to prevent docker container multiple times restart when lots of files are saved in the same time.