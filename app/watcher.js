import config from './../config';
import chokidar from 'chokidar';


/**
 * Class that provides file watching functionality
 */
export default class Watcher {
    constructor() {
        /**
         * Is emitter timer started?
         *
         * @type {boolean}
         * @private
         */
        this._nowEmitting = false;

        /**
         * Array of files that caused emit
         *
         * @type {Array}
         * @private
         */
        this._filesEmitters = [];

        /**
         * Callback that would be called on files change
         *
         * @param {Array} files
         * @private
         */
        this._callback = (files)=> {
            console.log('Please specify your custom callback.');
        };

        /**
         * Instance of chokidar watcherConfig
         * @type {FSWatcher}
         */
        this.instance = chokidar.watch(config.watch, config.watcherConfig);
    }

    /**
     *
     *
     * @param {function} callback
     */
    onChange(callback) {
        if (typeof callback === 'function') {
            this._callback = callback;
        }

        this._listenChanges();
    }

    /**
     * Start listening changes
     *
     * @private
     */
    _listenChanges() {
        this.instance
            .on('add', path => this._addEvent(path))
            .on('change', path => this._addEvent(path))
            .on('unlink', path => this._addEvent(path))
            .on('addDir', path => this._addEvent(path))
            .on('unlinkDir', path => this._addEvent(path));
    }

    /**
     * Save change file event and start emit timer
     *
     * @param {string} path
     * @private
     */
    _addEvent(path) {
        this._filesEmitters.push(path);

        if (!this._nowEmitting) {
            this._emitEvent()
        }
    }

    /**
     * Start emit timer and execute callback
     *
     * @private
     */
    _emitEvent() {
        this._nowEmitting = true;
        setTimeout(()=> {
            this._callback(this._filesEmitters);
            this._filesEmitters = [];
            this._nowEmitting = false;
        }, config.callbackDelay)
    }
};
