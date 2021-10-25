(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 33);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("tslib");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("@nestjs/common");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(0);
tslib_1.__exportStar(__webpack_require__(9), exports);
tslib_1.__exportStar(__webpack_require__(36), exports);
tslib_1.__exportStar(__webpack_require__(37), exports);
tslib_1.__exportStar(__webpack_require__(38), exports);
tslib_1.__exportStar(__webpack_require__(88), exports);
tslib_1.__exportStar(__webpack_require__(89), exports);
tslib_1.__exportStar(__webpack_require__(90), exports);


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ReleaseManagerService_1, _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReleaseManagerService = void 0;
const tslib_1 = __webpack_require__(0);
const redis_1 = __webpack_require__(12);
const doghouse_1 = __webpack_require__(5);
const common_1 = __webpack_require__(1);
const class_transformer_1 = __webpack_require__(28);
const class_validator_1 = __webpack_require__(6);
const ioredis_1 = __webpack_require__(14);
const release_instruction_input_dto_1 = __webpack_require__(27);
const deploy_service_1 = __webpack_require__(7);
const RK_SCHEDULED_RELEASE = 'scheduled-release';
let ReleaseManagerService = ReleaseManagerService_1 = class ReleaseManagerService {
    constructor(redis, redisClientHelperService, deployService) {
        this.redis = redis;
        this.redisClientHelperService = redisClientHelperService;
        this.deployService = deployService;
    }
    static getReleaseTimeoutTimeByType(type) {
        return ReleaseManagerService_1.MAX_RELEASE_DURATION_IN_MS_BY_TYPE[type] + ReleaseManagerService_1.STALLED_RELEASE_GRACE_PERIOD;
    }
    async getUpcomingRelease() {
        const instructionRaw = await this.redis.hgetall(RK_SCHEDULED_RELEASE);
        // non-existent data will be returned as empty object. returns noop instruction
        if (Object.keys(instructionRaw).length === 0) {
            return {
                type: null,
                commit: null,
                toBeDeployedAt: -1,
                attemptedAt: -1,
                status: doghouse_1.ReleaseInstructionStatus.SUCCEEDED,
            };
        }
        const instruction = class_transformer_1.plainToClass(release_instruction_input_dto_1.ReleaseInstructionWithStatusDTO, instructionRaw);
        return this.handleRelease(instruction);
    }
    async planUpcomingRelease(instruction) {
        return this.updateReleaseInstructionOnDb({
            ...instruction,
            attemptedAt: -1,
            status: doghouse_1.ReleaseInstructionStatus.PENDING,
        });
    }
    async handleRelease(instruction) {
        instruction = this.validateReleaseInstruction(instruction);
        switch (instruction.status) {
            case doghouse_1.ReleaseInstructionStatus.RELEASE_IN_PROGRESS:
                if (Date.now() > instruction.attemptedAt + ReleaseManagerService_1.getReleaseTimeoutTimeByType(instruction.type)) {
                    instruction = await this.updateReleaseInstructionOnDb({
                        ...instruction,
                        status: doghouse_1.ReleaseInstructionStatus.STALLED,
                    });
                }
                break;
            case doghouse_1.ReleaseInstructionStatus.PENDING:
                if (instruction.toBeDeployedAt <= Date.now()) {
                    const attemptedAt = Date.now();
                    instruction = await this.updateReleaseInstructionOnDb({
                        ...instruction,
                        attemptedAt,
                        status: doghouse_1.ReleaseInstructionStatus.RELEASE_IN_PROGRESS,
                    });
                    void this.deployService.deploy(instruction.commit, ReleaseManagerService_1.getReleaseTimeoutTimeByType(instruction.type))
                        .then(deploymentSuccessful => this.updateReleaseInstructionOnDb({
                        ...instruction,
                        attemptedAt,
                        status: deploymentSuccessful ? doghouse_1.ReleaseInstructionStatus.SUCCEEDED : doghouse_1.ReleaseInstructionStatus.FAILED,
                    }));
                }
                break;
        }
        return instruction;
    }
    validateReleaseInstruction(instruction) {
        instruction = class_transformer_1.plainToClass(release_instruction_input_dto_1.ReleaseInstructionWithStatusDTO, instruction);
        const errors = class_validator_1.validateSync(instruction);
        if (errors.length) {
            common_1.Logger.error('Got invalid ReleaseInstruction value from redis', JSON.stringify(errors), `${ReleaseManagerService_1.name}:getUpcomingRelease`);
            // TODO: report to Github issue
            throw new Error('Invalid ReleaseInstruction');
        }
        return instruction;
    }
    async updateReleaseInstructionOnDb(instruction) {
        instruction = this.validateReleaseInstruction(instruction);
        await this.redisClientHelperService.setHash(RK_SCHEDULED_RELEASE, {
            type: instruction.type,
            commit: instruction.commit,
            toBeDeployedAt: instruction.toBeDeployedAt.toString(),
            attemptedAt: instruction.attemptedAt.toString(),
            status: instruction.status,
        });
        return instruction;
    }
};
ReleaseManagerService.MAX_TO_BE_DEPLOYED_AT_OFFSET_IN_MS = 14 * 24 * 60 * 60 * 1000; // 2 weeks
ReleaseManagerService.MAX_RELEASE_DURATION_IN_MS_BY_TYPE = {
    [doghouse_1.ReleaseType.MAJOR]: 8 * 60 * 1000,
    [doghouse_1.ReleaseType.MINOR]: 4 * 60 * 1000,
    [doghouse_1.ReleaseType.PATCH]: 2 * 60 * 1000, // 2 minutes
};
ReleaseManagerService.STALLED_RELEASE_GRACE_PERIOD = 1.5 * 60 * 1000; // 2 minutes
ReleaseManagerService = ReleaseManagerService_1 = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, common_1.Inject(redis_1.REDIS_CLIENT)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof ioredis_1.Redis !== "undefined" && ioredis_1.Redis) === "function" ? _a : Object, typeof (_b = typeof redis_1.RedisClientHelperService !== "undefined" && redis_1.RedisClientHelperService) === "function" ? _b : Object, typeof (_c = typeof deploy_service_1.DeployService !== "undefined" && deploy_service_1.DeployService) === "function" ? _c : Object])
], ReleaseManagerService);
exports.ReleaseManagerService = ReleaseManagerService;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(0);
tslib_1.__exportStar(__webpack_require__(112), exports);
tslib_1.__exportStar(__webpack_require__(117), exports);


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("class-validator");

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var DeployService_1, _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeployService = void 0;
const tslib_1 = __webpack_require__(0);
const config_1 = __webpack_require__(2);
const common_1 = __webpack_require__(1);
const child_process_1 = __webpack_require__(123);
const lodash_1 = __webpack_require__(3);
const path_1 = __webpack_require__(15);
const util_1 = __webpack_require__(124);
const git_service_1 = __webpack_require__(29);
const k8s_cluster_service_1 = __webpack_require__(30);
const execPromise = util_1.promisify(child_process_1.exec);
let DeployService = DeployService_1 = class DeployService {
    constructor(gitService, k8sClusterService) {
        this.gitService = gitService;
        this.k8sClusterService = k8sClusterService;
        this.maintenanceMode = false;
        this.env = config_1.config.data().debug ? 'staging' : 'productionX';
    }
    getMaintenanceStatus() {
        return this.maintenanceMode;
    }
    setMaintenanceStatus(maintenance) {
        this.maintenanceMode = maintenance;
    }
    async deploy(commitSha, timeoutInMs) {
        // set maintenance mode
        this.setMaintenanceStatus(true);
        commitSha !== null && commitSha !== void 0 ? commitSha : (commitSha = 'latest');
        const logger = new common_1.Logger(`${DeployService_1.name}:deploy:${this.env}:${commitSha}`, true);
        const deploymentSpecPath = path_1.join(config_1.config.data().sandboxDir, 'deployment.yaml');
        let deploymentStatus = false;
        try {
            // clone repo
            logger.log('Retrieving deployment manifest...');
            const repo = await this.gitService.clone('https://github.com/i40mc/platform-deploy.git', commitSha);
            const repoPath = repo.workdir();
            // generate patches
            {
                logger.log('Generating patches...');
                const { stderr } = await execPromise(`node ./scripts/generate-patches/bundle/index.js ./deployments/${this.env}`, {
                    cwd: repoPath,
                });
                if (lodash_1.isNil(stderr)) {
                    logger.error(stderr);
                    throw new Error('DeploymentError: Failed generating manifest patches');
                }
            }
            // generate deployment spec
            {
                logger.log('Generating deployment spec...');
                const { stderr } = await execPromise(`kustomize build ./deployments/${this.env} > ${deploymentSpecPath}`, {
                    cwd: repoPath,
                });
                if (lodash_1.isNil(stderr)) {
                    logger.error(stderr);
                    throw new Error('DeploymentError: Failed generating kubernetes conf');
                }
            }
            logger.log(`Deploying manifests...`);
            // deploying manifest
            const updatedObjects = await this.k8sClusterService.apply(deploymentSpecPath);
            logger.log(`Waiting deployment to complete... ${timeoutInMs}`);
            const updatedDeployments = await this.k8sClusterService.waitUntilDeploymentsComplete(updatedObjects, timeoutInMs);
            deploymentStatus = updatedDeployments.every(s => s.deployed);
            if (deploymentStatus) {
                logger.log(`Deployment succeeded`);
            }
            else {
                logger.error(`Deployment failed`, JSON.stringify(updatedDeployments));
            }
        }
        catch (err) {
            logger.error(`${err.name}:${err.message}`, err.stack);
        }
        finally {
            this.setMaintenanceStatus(false);
            void this.gitService.cleanupCloneDir();
        }
        return deploymentStatus;
    }
};
DeployService = DeployService_1 = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof git_service_1.GitService !== "undefined" && git_service_1.GitService) === "function" ? _a : Object, typeof (_b = typeof k8s_cluster_service_1.K8sClusterService !== "undefined" && k8s_cluster_service_1.K8sClusterService) === "function" ? _b : Object])
], DeployService);
exports.DeployService = DeployService;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceHealthService = void 0;
const tslib_1 = __webpack_require__(0);
const doghouse_1 = __webpack_require__(5);
const common_1 = __webpack_require__(1);
const axios_1 = __webpack_require__(135);
const pLimit = __webpack_require__(31);
const services_const_1 = __webpack_require__(32);
const REQUEST_TIMEOUT_IN_MS = 5000;
const INERT_REQUEST_THRESHOLD_IN_MS = 1000;
const CONCURRENT_REQUEST_LIMIT = 10;
const limit = pLimit(CONCURRENT_REQUEST_LIMIT);
let ServiceHealthService = class ServiceHealthService {
    constructor() {
        this.registry = {};
        this.httpClient = axios_1.default.create({
            timeout: REQUEST_TIMEOUT_IN_MS,
            validateStatus: status => status === 200 || status === 204,
        });
        this.httpClient.interceptors.request.use((config) => {
            config.headers['req-timestamp'] = new Date().getTime();
            return config;
        });
        this.httpClient.interceptors.response.use((response) => {
            const reqTimestamp = response.config.headers['req-timestamp'];
            response.headers['req-duration'] = (new Date().getTime()) - reqTimestamp;
            return response;
        });
    }
    async onModuleInit() {
        await this.updateAllServicesHealth();
    }
    async updateServiceHealth(service) {
        const serviceHealth = {
            status: doghouse_1.ServiceStatus.DOWN,
            responseTime: -1,
        };
        try {
            const req = await this.httpClient.get(service.url);
            serviceHealth.responseTime = req.headers['req-duration'];
            if (serviceHealth.responseTime >= INERT_REQUEST_THRESHOLD_IN_MS) {
                serviceHealth.status = doghouse_1.ServiceStatus.DEGRADATION;
            }
            serviceHealth.status = doghouse_1.ServiceStatus.OPERATIONAL;
        }
        catch (err) {
            serviceHealth.message = err.message;
        }
        this.registry[service.id] = serviceHealth;
    }
    async updateAllServicesHealth() {
        await Promise.all(services_const_1.SERVICES.map(service => limit(() => this.updateServiceHealth(service))));
    }
    getServiceHealth(serviceId) {
        var _a;
        return (_a = this.registry[serviceId]) !== null && _a !== void 0 ? _a : null;
    }
    getAllServicesHealth() {
        return services_const_1.SERVICES.reduce((acc, service) => ({ ...acc, [service.id]: this.registry[service.id] }), {});
    }
};
ServiceHealthService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__metadata("design:paramtypes", [])
], ServiceHealthService);
exports.ServiceHealthService = ServiceHealthService;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const lodash_1 = __webpack_require__(3);
const enumerate_nested_config_helper_1 = __webpack_require__(35);
class Configuration {
    constructor() {
        this._data = {};
        this.requiredEnvs = [];
        this.requiredSecrets = [];
    }
    data() {
        return this._data;
    }
    async loadConfig(newConfig, mergeWithCurrentConfig = true) {
        const config = {};
        lodash_1.merge(config, newConfig);
        await enumerate_nested_config_helper_1.enumerateNestedObject(config, async (dict, key, value) => {
            if (typeof value === 'function') {
                dict[key] = await value();
            }
        });
        if (mergeWithCurrentConfig) {
            lodash_1.merge(this._data, config);
        }
        else {
            this._data = config;
        }
    }
}
exports.config = new Configuration();


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(0);
tslib_1.__exportStar(__webpack_require__(20), exports);
tslib_1.__exportStar(__webpack_require__(55), exports);
tslib_1.__exportStar(__webpack_require__(20), exports);
tslib_1.__exportStar(__webpack_require__(58), exports);
tslib_1.__exportStar(__webpack_require__(62), exports);
tslib_1.__exportStar(__webpack_require__(79), exports);


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.mapObject = exports.isNil = exports.isUndefined = exports.isPlainObject = exports.isObject = exports.mergeDeep = exports.mergeObjects = exports.getKeys = exports.deepCopy = void 0;
const lodash_1 = __webpack_require__(3);
function deepCopy(obj) {
    if (!obj || typeof obj !== 'object') {
        return obj;
    }
    const keys = getKeys(obj);
    const retObj = {};
    for (const attr of keys) {
        const value = obj[attr];
        switch (true) {
            case (value instanceof Date): {
                const dateCopy = new Date();
                dateCopy.setDate(value.getDate());
                retObj[attr] = dateCopy;
                break;
            }
            case (value instanceof RegExp):
                retObj[attr] = new RegExp(value.source, value.flags);
                break;
            case (value instanceof Array): {
                const arrayCopy = [];
                for (const e of value) {
                    arrayCopy.push(deepCopy(e));
                }
                retObj[attr] = arrayCopy;
                break;
            }
            case (value instanceof Object):
                if (!isPlainObject(value)) {
                    retObj[attr] = value;
                }
                else {
                    retObj[attr] = deepCopy(value);
                }
                break;
            default:
                retObj[attr] = obj[attr];
        }
    }
    return retObj;
}
exports.deepCopy = deepCopy;
function getKeys(target) {
    return [
        ...Object.keys(target),
        ...getEnumerableOwnPropertySymbols(target),
    ];
}
exports.getKeys = getKeys;
function getEnumerableOwnPropertySymbols(target) {
    return Object.getOwnPropertySymbols ?
        Object.getOwnPropertySymbols(target).filter((symbol) => target.propertyIsEnumerable(symbol)) :
        [];
}
function mergeObjects(target, source) {
    const keys = getKeys(source);
    for (const key of keys) {
        const oldVal = target[key];
        const newVal = source[key];
        if (isObject(newVal) && isObject(oldVal)) {
            if (!isPlainObject(newVal) || !isPlainObject(oldVal)) {
                target[key] = newVal;
            }
            else {
                target[key] = mergeObjects(oldVal, newVal);
            }
        }
        else if (Array.isArray(newVal)) {
            target[key] = newVal;
        }
        else {
            if (!isPlainObject(newVal)) {
                target[key] = newVal;
            }
            else {
                target[key] = deepCopy(newVal);
            }
        }
    }
    return target;
}
exports.mergeObjects = mergeObjects;
/**
 * Deep merge two objects.
 * https://stackoverflow.com/a/34749873
 */
function mergeDeep(target, ...sources) {
    if (!sources.length) {
        return target;
    }
    const source = sources.shift();
    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) {
                    Object.assign(target, { [key]: {} });
                }
                mergeDeep(target[key], source[key]);
            }
            else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }
    return mergeDeep(target, ...sources);
}
exports.mergeDeep = mergeDeep;
// from https://github.com/jonschlinkert/isobject
function isObject(val) {
    return !isNil(val) && typeof val === 'object' && Array.isArray(val) === false;
}
exports.isObject = isObject;
// from https://github.com/jonschlinkert/is-plain-object
function isObjectObject(o) {
    return isObject(o) && Object.prototype.toString.call(o) === '[object Object]';
}
function isPlainObject(o) {
    if (isObjectObject(o) === false) {
        return false;
    }
    // If has modified constructor
    const ctor = o.constructor;
    if (typeof ctor !== 'function') {
        return false;
    }
    // If has modified prototype
    const prot = ctor.prototype;
    if (isObjectObject(prot) === false) {
        return false;
    }
    // If constructor does not have an Object-specific method
    if (prot.hasOwnProperty('isPrototypeOf') === false) {
        return false;
    }
    // Most likely a plain Object
    return true;
}
exports.isPlainObject = isPlainObject;
function isUndefined(val) {
    return typeof val === 'undefined'; // undefined can be overwritten in some environments
}
exports.isUndefined = isUndefined;
function isNil(val) {
    return isUndefined(val) || val === null;
}
exports.isNil = isNil;
/**
 * mapObject
 *
 * @param instruction object containing map instruction
 * @param source source object
 * @param stripNull set true to strip object from null properties
 */
function mapObject(instruction, source, stripNull = true) {
    const target = {};
    Object.keys(instruction).forEach((key) => {
        const value = lodash_1.get(source, instruction[key]) || null;
        if (stripNull && value == null) {
            return;
        }
        target[key] = value;
    });
    return target;
}
exports.mapObject = mapObject;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.REDIS_CLIENT = void 0;
const tslib_1 = __webpack_require__(0);
tslib_1.__exportStar(__webpack_require__(93), exports);
tslib_1.__exportStar(__webpack_require__(95), exports);
tslib_1.__exportStar(__webpack_require__(96), exports);
tslib_1.__exportStar(__webpack_require__(97), exports);
tslib_1.__exportStar(__webpack_require__(98), exports);
tslib_1.__exportStar(__webpack_require__(24), exports);
var constants_1 = __webpack_require__(13);
Object.defineProperty(exports, "REDIS_CLIENT", { enumerable: true, get: function () { return constants_1.REDIS_CLIENT; } });


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_REDIS_MODULE_OPTS = exports.REDIS_CLIENT = exports.REDIS_MODULE_OPTIONS = void 0;
/**
 * Provider keys
 */
exports.REDIS_MODULE_OPTIONS = '@i40mp/redis-nestjs:RedisModuleOptions';
exports.REDIS_CLIENT = '@i40mp/redis-nestjs:RedisClient';
/**
 * Module default options
 */
exports.DEFAULT_REDIS_MODULE_OPTS = {
    serviceId: process.env.APP_ID,
    connectionNamePostfix: '',
};


/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("ioredis");

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIKeyGuard = void 0;
const tslib_1 = __webpack_require__(0);
const common_1 = __webpack_require__(1);
const api_key_service_1 = __webpack_require__(17);
let APIKeyGuard = class APIKeyGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const authToken = request.headers.authorization;
        if (typeof authToken !== 'string' || authToken.length === 0) {
            throw new common_1.UnauthorizedException();
        }
        const [tokenType, tokenValue] = authToken.split(' ');
        if (tokenType !== 'Bearer' || typeof tokenValue !== 'string') {
            throw new common_1.UnauthorizedException('Invalid authorization provided');
        }
        if (!this.apiKeyService.validateAPIKey(tokenValue)) {
            throw new common_1.UnauthorizedException();
        }
        return true;
    }
};
tslib_1.__decorate([
    common_1.Inject(api_key_service_1.APIKeyService),
    tslib_1.__metadata("design:type", typeof (_a = typeof api_key_service_1.APIKeyService !== "undefined" && api_key_service_1.APIKeyService) === "function" ? _a : Object)
], APIKeyGuard.prototype, "apiKeyService", void 0);
APIKeyGuard = tslib_1.__decorate([
    common_1.Injectable()
], APIKeyGuard);
exports.APIKeyGuard = APIKeyGuard;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.APIKeyService = void 0;
const tslib_1 = __webpack_require__(0);
const config_1 = __webpack_require__(2);
const common_1 = __webpack_require__(1);
let APIKeyService = class APIKeyService {
    constructor() {
        this.activeAPIKeys = [];
    }
    onModuleInit() {
        const apiKeysSemicolonSeparated = config_1.config.data().secretKeys;
        if (typeof apiKeysSemicolonSeparated !== 'string' || apiKeysSemicolonSeparated.length === 0) {
            throw new Error('Invalid secretKeys loaded!');
        }
        this.activeAPIKeys = apiKeysSemicolonSeparated.split(';');
    }
    validateAPIKey(key) {
        return this.activeAPIKeys.includes(key);
    }
};
APIKeyService = tslib_1.__decorate([
    common_1.Injectable()
], APIKeyService);
exports.APIKeyService = APIKeyService;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemHealthService = void 0;
const tslib_1 = __webpack_require__(0);
const doghouse_1 = __webpack_require__(5);
const common_1 = __webpack_require__(1);
const services_const_1 = __webpack_require__(32);
const deploy_service_1 = __webpack_require__(7);
const release_manager_service_1 = __webpack_require__(4);
const service_health_service_1 = __webpack_require__(8);
let SystemHealthService = class SystemHealthService {
    constructor(serviceStatusService, releaseManagerService, deployService) {
        this.serviceStatusService = serviceStatusService;
        this.releaseManagerService = releaseManagerService;
        this.deployService = deployService;
    }
    async getSystemHealth() {
        let status = doghouse_1.SystemStatus.FULLY_OPERATIONAL;
        for (const service of services_const_1.SERVICES) {
            // skip further check when the overall status already considered to be significantly disrupted
            if (status === doghouse_1.SystemStatus.MAJOR_DISRUPTION) {
                break;
            }
            const serviceHealth = this.serviceStatusService.getServiceHealth(service.id);
            switch (serviceHealth.status) {
                case doghouse_1.ServiceStatus.DEGRADATION:
                    status = doghouse_1.SystemStatus.PARTIAL_DISRUPTION;
                    break;
                case doghouse_1.ServiceStatus.DOWN:
                    status = service.coreService
                        ? doghouse_1.SystemStatus.MAJOR_DISRUPTION
                        : doghouse_1.SystemStatus.PARTIAL_DISRUPTION;
                    break;
            }
        }
        const maintenanceSchedule = await this.releaseManagerService.getUpcomingRelease();
        return {
            status,
            maintenanceMode: this.deployService.getMaintenanceStatus(),
            nextMaintenanceAt: maintenanceSchedule.status === doghouse_1.ReleaseInstructionStatus.PENDING
                ? maintenanceSchedule.toBeDeployedAt
                : null,
        };
    }
};
SystemHealthService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof service_health_service_1.ServiceHealthService !== "undefined" && service_health_service_1.ServiceHealthService) === "function" ? _a : Object, typeof (_b = typeof release_manager_service_1.ReleaseManagerService !== "undefined" && release_manager_service_1.ReleaseManagerService) === "function" ? _b : Object, typeof (_c = typeof deploy_service_1.DeployService !== "undefined" && deploy_service_1.DeployService) === "function" ? _c : Object])
], SystemHealthService);
exports.SystemHealthService = SystemHealthService;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.cast = void 0;
const common_1 = __webpack_require__(10);
function cast(value, targetType = 'string') {
    if (common_1.isNil(value)) {
        return value;
    }
    const valueAsString = typeof value !== 'string' ? JSON.stringify(value) : value;
    switch (targetType) {
        case 'boolean': {
            const lowerCaseValue = valueAsString.toLowerCase();
            return lowerCaseValue === 'true' || lowerCaseValue === 't' || lowerCaseValue === '1' || lowerCaseValue === 'on';
        }
        case 'number':
            return parseFloat(valueAsString);
        case 'string':
        default:
            return valueAsString;
    }
}
exports.cast = cast;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(0);
tslib_1.__exportStar(__webpack_require__(39), exports);
tslib_1.__exportStar(__webpack_require__(40), exports);
tslib_1.__exportStar(__webpack_require__(41), exports);
tslib_1.__exportStar(__webpack_require__(21), exports);
tslib_1.__exportStar(__webpack_require__(42), exports);
tslib_1.__exportStar(__webpack_require__(43), exports);
tslib_1.__exportStar(__webpack_require__(44), exports);
tslib_1.__exportStar(__webpack_require__(45), exports);
tslib_1.__exportStar(__webpack_require__(46), exports);
tslib_1.__exportStar(__webpack_require__(47), exports);
tslib_1.__exportStar(__webpack_require__(48), exports);
tslib_1.__exportStar(__webpack_require__(49), exports);
tslib_1.__exportStar(__webpack_require__(50), exports);
tslib_1.__exportStar(__webpack_require__(51), exports);
tslib_1.__exportStar(__webpack_require__(52), exports);
tslib_1.__exportStar(__webpack_require__(53), exports);
tslib_1.__exportStar(__webpack_require__(22), exports);
tslib_1.__exportStar(__webpack_require__(54), exports);


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.I40MIPrinciple = void 0;
var I40MIPrinciple;
(function (I40MIPrinciple) {
    I40MIPrinciple["INTEGRATION_OF_IT_SYSTEMS"] = "INTEGRATION_OF_IT_SYSTEMS";
    I40MIPrinciple["INFORMATION_PROCESSING"] = "INFORMATION_PROCESSING";
    I40MIPrinciple["DIGITAL_CAPABILITY"] = "DIGITAL_CAPABILITY";
    I40MIPrinciple["STRUCTURED_COMMUNICATION"] = "STRUCTURED_COMMUNICATION";
    I40MIPrinciple["ORGANIC_INTERNAL_ORGANIZATION"] = "ORGANIC_INTERNAL_ORGANIZATION";
    I40MIPrinciple["DYNAMIC_COLLABORATION_IN_VALUE_NETWORKS"] = "DYNAMIC_COLLABORATION_IN_VALUE_NETWORKS";
    I40MIPrinciple["SOCIAL_COLLABORATION"] = "SOCIAL_COLLABORATION";
    I40MIPrinciple["WILLINGNESS_TO_CHANGE"] = "WILLINGNESS_TO_CHANGE";
})(I40MIPrinciple = exports.I40MIPrinciple || (exports.I40MIPrinciple = {}));


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SMIPrinciple = void 0;
var SMIPrinciple;
(function (SMIPrinciple) {
    SMIPrinciple["CUSTOMER"] = "CUSTOMER";
    SMIPrinciple["RESOURCES"] = "RESOURCES";
    SMIPrinciple["PROCESS_DIGITALIZATION"] = "PROCESS_DIGITALIZATION";
    SMIPrinciple["CULTURE"] = "CULTURE";
})(SMIPrinciple = exports.SMIPrinciple || (exports.SMIPrinciple = {}));


/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = require("rxjs/operators");

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisClientHelperService = void 0;
const tslib_1 = __webpack_require__(0);
const common_1 = __webpack_require__(1);
const ioredis_1 = __webpack_require__(14);
const constants_1 = __webpack_require__(13);
let RedisClientHelperService = class RedisClientHelperService {
    constructor(redis) {
        this.redis = redis;
    }
    async setHash(key, data) {
        return this.redis.hmset(key, ...Object.keys(data)
            .map(key => [key, data[key]])
            .reduce((acc, val) => [...acc, ...val]));
    }
};
RedisClientHelperService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, common_1.Inject(constants_1.REDIS_CLIENT)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof ioredis_1.Redis !== "undefined" && ioredis_1.Redis) === "function" ? _a : Object])
], RedisClientHelperService);
exports.RedisClientHelperService = RedisClientHelperService;


/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = require("@nestjs/schedule");

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ReleaseManagerModule = void 0;
const tslib_1 = __webpack_require__(0);
const config_1 = __webpack_require__(2);
const redis_1 = __webpack_require__(12);
const common_1 = __webpack_require__(1);
const controllers_1 = __webpack_require__(110);
const services_1 = __webpack_require__(132);
const deploy_service_1 = __webpack_require__(7);
const release_manager_service_1 = __webpack_require__(4);
let ReleaseManagerModule = class ReleaseManagerModule {
};
ReleaseManagerModule = tslib_1.__decorate([
    common_1.Module({
        imports: [
            redis_1.RedisModule.forRoot({
                serviceId: config_1.config.data().id,
                redis: config_1.config.data().redis,
            }),
        ],
        controllers: [
            ...controllers_1.CONTROLLERS,
        ],
        providers: [
            ...services_1.SERVICES,
        ],
        exports: [
            release_manager_service_1.ReleaseManagerService,
            deploy_service_1.DeployService,
        ],
    })
], ReleaseManagerModule);
exports.ReleaseManagerModule = ReleaseManagerModule;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReleaseInstructionWithStatusDTO = exports.ReleaseInstructionInputDTO = void 0;
const tslib_1 = __webpack_require__(0);
/* eslint-disable max-classes-per-file */
const doghouse_1 = __webpack_require__(5);
const class_transformer_1 = __webpack_require__(28);
const class_validator_1 = __webpack_require__(6);
const release_manager_service_1 = __webpack_require__(4);
const is_commit_ref_validator_1 = __webpack_require__(130);
const is_smaller_than_validator_1 = __webpack_require__(131);
class ReleaseInstructionInputDTO {
}
tslib_1.__decorate([
    class_validator_1.IsIn([
        doghouse_1.ReleaseType.MAJOR,
        doghouse_1.ReleaseType.MINOR,
        doghouse_1.ReleaseType.PATCH,
    ]),
    tslib_1.__metadata("design:type", typeof (_a = typeof doghouse_1.ReleaseType !== "undefined" && doghouse_1.ReleaseType) === "function" ? _a : Object)
], ReleaseInstructionInputDTO.prototype, "type", void 0);
tslib_1.__decorate([
    is_commit_ref_validator_1.IsCommitRef(),
    tslib_1.__metadata("design:type", String)
], ReleaseInstructionInputDTO.prototype, "commit", void 0);
tslib_1.__decorate([
    class_transformer_1.Type(() => Number),
    class_validator_1.IsNumber(),
    class_validator_1.Min(0),
    is_smaller_than_validator_1.IsSmallerThan(() => Date.now() + release_manager_service_1.ReleaseManagerService.MAX_TO_BE_DEPLOYED_AT_OFFSET_IN_MS, {
        message: 'a release can only be scheduled 2 weeks ahead maximum',
    }),
    tslib_1.__metadata("design:type", Number)
], ReleaseInstructionInputDTO.prototype, "toBeDeployedAt", void 0);
exports.ReleaseInstructionInputDTO = ReleaseInstructionInputDTO;
class ReleaseInstructionWithStatusDTO extends ReleaseInstructionInputDTO {
}
tslib_1.__decorate([
    class_transformer_1.Type(() => Number),
    class_validator_1.IsNumber(),
    tslib_1.__metadata("design:type", Number)
], ReleaseInstructionWithStatusDTO.prototype, "attemptedAt", void 0);
tslib_1.__decorate([
    class_validator_1.IsIn([
        doghouse_1.ReleaseInstructionStatus.PENDING,
        doghouse_1.ReleaseInstructionStatus.RELEASE_IN_PROGRESS,
        doghouse_1.ReleaseInstructionStatus.FAILED,
        doghouse_1.ReleaseInstructionStatus.SUCCEEDED,
    ]),
    tslib_1.__metadata("design:type", typeof (_b = typeof doghouse_1.ReleaseInstructionStatus !== "undefined" && doghouse_1.ReleaseInstructionStatus) === "function" ? _b : Object)
], ReleaseInstructionWithStatusDTO.prototype, "status", void 0);
exports.ReleaseInstructionWithStatusDTO = ReleaseInstructionWithStatusDTO;


/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = require("class-transformer");

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.GitService = void 0;
const tslib_1 = __webpack_require__(0);
const common_1 = __webpack_require__(10);
const config_1 = __webpack_require__(2);
const common_2 = __webpack_require__(1);
const fs_extra_1 = __webpack_require__(125);
const git = __webpack_require__(126);
const path_1 = __webpack_require__(15);
let GitService = class GitService {
    constructor() {
        this.cloneDir = path_1.join(config_1.config.data().sandboxDir, 'repo');
        this.cloneOpts = {
            fetchOpts: {
                callbacks: {
                    credentials() {
                        return git.Cred.userpassPlaintextNew(config_1.config.data().githubToken, 'x-oauth-basic');
                    },
                    certificateCheck() {
                        return 0;
                    },
                },
            },
        };
    }
    async clone(repoUrl, commitSha) {
        // cleanup clone dir
        await this.cleanupCloneDir();
        const repo = await git.Clone.clone(repoUrl, this.cloneDir, this.cloneOpts);
        if (!common_1.isNil(commitSha) && commitSha !== 'latest') {
            const commitRef = await repo.getCommit(commitSha);
            await git.Checkout.tree(repo, commitRef);
        }
        return repo;
    }
    async cleanupCloneDir() {
        await fs_extra_1.remove(this.cloneDir);
    }
};
GitService = tslib_1.__decorate([
    common_2.Injectable()
], GitService);
exports.GitService = GitService;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.K8sClusterService = void 0;
const tslib_1 = __webpack_require__(0);
const common_1 = __webpack_require__(10);
const config_1 = __webpack_require__(2);
const k8s = __webpack_require__(127);
const common_2 = __webpack_require__(1);
const promises_1 = __webpack_require__(128);
const yaml = __webpack_require__(129);
const pLimit = __webpack_require__(31);
const CONCURRENT_REQUEST_LIMIT = 12;
const limit = pLimit(CONCURRENT_REQUEST_LIMIT);
let K8sClusterService = class K8sClusterService {
    constructor() {
        // load k8s config
        const k8sConfig = new k8s.KubeConfig();
        k8sConfig.loadFromString(config_1.config.data().k8sClusterConfig);
        // init clients
        this.clientAppsV1Api = k8sConfig.makeApiClient(k8s.AppsV1Api);
        this.clientObjectApi = k8s.KubernetesObjectApi.makeApiClient(k8sConfig);
    }
    async apply(specPath) {
        const specString = await promises_1.readFile(specPath, 'utf8');
        const specs = yaml
            .loadAll(specString)
            .filter((s) => s && s.kind && s.metadata);
        const created = [];
        for (const spec of specs) {
            // this is to convince the old version of TypeScript that metadata exists
            // even though we already filtered specs without metadata out
            spec.metadata = spec.metadata || {};
            spec.metadata.annotations = spec.metadata.annotations || {};
            delete spec.metadata.annotations['kubectl.kubernetes.io/last-applied-configuration'];
            spec.metadata.annotations['kubectl.kubernetes.io/last-applied-configuration'] = JSON.stringify(spec);
            try {
                // patch if exists
                await this.clientObjectApi.read(spec);
                const response = await this.clientObjectApi.patch(spec);
                created.push(response.body);
            }
            catch (e) {
                // create if doesn't exist
                const response = await this.clientObjectApi.create(spec);
                created.push(response.body);
            }
        }
        return created;
    }
    async waitUntilDeploymentsComplete(object, timeoutInMs = 240000) {
        const pollIntervalInMs = 300;
        const timeoutAt = (new Date()).getTime() + timeoutInMs;
        const deployments = object.filter(o => o.kind === 'Deployment');
        let deploymentToBeWatched = deployments.map(d => [d.metadata.namespace, d.metadata.name]);
        while (deploymentToBeWatched.length && Date.now() <= timeoutAt) {
            const deploymentToBeWatchedInTheNextCycle = [];
            await Promise.all(deploymentToBeWatched.map(d => limit(() => this.isDeploymentComplete(d[0], d[1]).then(status => {
                if (!status) {
                    deploymentToBeWatchedInTheNextCycle.push(d);
                }
            }))));
            await common_1.sleep(pollIntervalInMs);
            deploymentToBeWatched = deploymentToBeWatchedInTheNextCycle;
        }
        return deployments.map(d => ({
            namespace: d.metadata.namespace,
            kind: d.kind,
            name: d.metadata.name,
            deployed: deploymentToBeWatched.findIndex(el => el[0] === d.metadata.namespace && el[1] === d.metadata.name) < 0,
        }));
    }
    /**
     * Check if deployment has been successfully rolled out
     * ref: https://github.com/kubernetes/kubernetes/blob/74bcefc8b2bf88a2f5816336999b524cc48cf6c0/pkg/controller/deployment/util/deployment_util.go#L745
     *
     */
    async isDeploymentComplete(namespace, name) {
        const { body: deployment } = await this.clientAppsV1Api.readNamespacedDeploymentStatus(name, namespace);
        return deployment.status.updatedReplicas === deployment.spec.replicas
            && deployment.status.replicas === deployment.spec.replicas
            && deployment.status.availableReplicas === deployment.spec.replicas
            && deployment.status.observedGeneration >= deployment.metadata.generation;
    }
};
K8sClusterService = tslib_1.__decorate([
    common_2.Injectable(),
    tslib_1.__metadata("design:paramtypes", [])
], K8sClusterService);
exports.K8sClusterService = K8sClusterService;


/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports = require("p-limit");

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SERVICES = void 0;
const config_1 = __webpack_require__(2);
// TODO: when deemed necessary, service list should be excluded from source code and loaded on the fly on app start
exports.SERVICES = [
    {
        id: 'instance-service',
        url: `${config_1.config.data().apiBaseUrl}/instance/`,
        coreService: true,
    },
    {
        id: 'assessment-service',
        url: `${config_1.config.data().apiBaseUrl}/assessment`,
        coreService: true,
    },
    {
        id: 'questionnaire-service',
        url: `${config_1.config.data().apiBaseUrl}/questionnaire/`,
        coreService: true,
    },
    {
        id: 'measure-service',
        url: `${config_1.config.data().apiBaseUrl}/measure/`,
        coreService: true,
    },
    {
        id: 'billing-service',
        url: `${config_1.config.data().apiBaseUrl}/billing/`,
    },
    {
        id: 'graphic-service',
        url: `${config_1.config.data().apiBaseUrl}/graphic/`,
    },
    {
        id: 'storage-service',
        url: `${config_1.config.data().apiBaseUrl}/storage/`,
    },
    {
        id: 'ux-service',
        url: `${config_1.config.data().apiBaseUrl}/ux/`,
    },
];


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(34);


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __webpack_require__(2);
const app_config_1 = __webpack_require__(92);
(async () => {
    await config_1.config.loadConfig(app_config_1.CONFIG);
    __webpack_require__(101);
})().catch(err => {
    throw err;
});


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.enumerateNestedObject = void 0;
function isObject(val) {
    return val != null && typeof val === 'object' && !Array.isArray(val);
}
async function enumerateNestedObject(dict, fn) {
    if (!isObject(dict)) {
        throw new Error(`Can't enumerate ${dict}`);
    }
    for (const key in dict) {
        if (Object.prototype.hasOwnProperty.call(dict, key)) {
            const value = dict[key];
            if (isObject(value)) {
                await enumerateNestedObject(value, fn);
            }
            else {
                await fn(dict, key, value);
            }
        }
    }
}
exports.enumerateNestedObject = enumerateNestedObject;


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = void 0;
const lodash_1 = __webpack_require__(3);
const config_1 = __webpack_require__(9);
function getConfig(key, optional) {
    if (!optional && !lodash_1.has(config_1.config.data(), key)) {
        throw new Error(`No config found for: ${key}`);
    }
    return lodash_1.get(config_1.config.data(), key);
}
exports.getConfig = getConfig;


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieveEnv = void 0;
const cast_helper_1 = __webpack_require__(19);
function retrieveEnv(key, opts) {
    const value = process.env[key];
    if (!(opts === null || opts === void 0 ? void 0 : opts.optional)) {
        if (value === undefined) {
            // TODO: enable later
            // throw new Error(`Failed retrieving env: ${key}`);
        }
    }
    return cast_helper_1.cast(value, opts === null || opts === void 0 ? void 0 : opts.castTo);
}
exports.retrieveEnv = retrieveEnv;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentType = void 0;
var AssessmentType;
(function (AssessmentType) {
    AssessmentType["INDUSTRIE_40_MATURITY"] = "INDUSTRIE_40_MATURITY";
    AssessmentType["SERVICE_MATURITY"] = "SERVICE_MATURITY";
})(AssessmentType = exports.AssessmentType || (exports.AssessmentType = {}));


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryCode = void 0;
var CountryCode;
(function (CountryCode) {
    CountryCode["AFGHANISTAN"] = "AF";
    CountryCode["ALAND_ISLANDS"] = "AX";
    CountryCode["ALBANIA"] = "AL";
    CountryCode["ALGERIA"] = "DZ";
    CountryCode["AMERICAN_SAMOA"] = "AS";
    CountryCode["ANDORRA"] = "AD";
    CountryCode["ANGOLA"] = "AO";
    CountryCode["ANGUILLA"] = "AI";
    CountryCode["ANTARCTICA"] = "AQ";
    CountryCode["ANTIGUA_AND_BARBUDA"] = "AG";
    CountryCode["ARGENTINA"] = "AR";
    CountryCode["ARMENIA"] = "AM";
    CountryCode["ARUBA"] = "AW";
    CountryCode["AUSTRALIA"] = "AU";
    CountryCode["AUSTRIA"] = "AT";
    CountryCode["AZERBAIJAN"] = "AZ";
    CountryCode["BAHAMAS"] = "BS";
    CountryCode["BAHRAIN"] = "BH";
    CountryCode["BANGLADESH"] = "BD";
    CountryCode["BARBADOS"] = "BB";
    CountryCode["BELARUS"] = "BY";
    CountryCode["BELGIUM"] = "BE";
    CountryCode["BELIZE"] = "BZ";
    CountryCode["BENIN"] = "BJ";
    CountryCode["BERMUDA"] = "BM";
    CountryCode["BHUTAN"] = "BT";
    CountryCode["BOLIVIA"] = "BO";
    CountryCode["BOSNIA_AND_HERZEGOVINA"] = "BA";
    CountryCode["BOTSWANA"] = "BW";
    CountryCode["BOUVET_ISLAND"] = "BV";
    CountryCode["BRAZIL"] = "BR";
    CountryCode["BRITISH_INDIAN_OCEAN_TERRITORY"] = "IO";
    CountryCode["BRUNEI_DARUSSALAM"] = "BN";
    CountryCode["BULGARIA"] = "BG";
    CountryCode["BURKINA_FASO"] = "BF";
    CountryCode["BURUNDI"] = "BI";
    CountryCode["CAMBODIA"] = "KH";
    CountryCode["CAMEROON"] = "CM";
    CountryCode["CANADA"] = "CA";
    CountryCode["CAPE_VERDE"] = "CV";
    CountryCode["CAYMAN_ISLANDS"] = "KY";
    CountryCode["CENTRAL_AFRICAN_REPUBLIC"] = "CF";
    CountryCode["CHAD"] = "TD";
    CountryCode["CHILE"] = "CL";
    CountryCode["CHINA"] = "CN";
    CountryCode["CHRISTMAS_ISLAND"] = "CX";
    CountryCode["COCOS_KEELING_ISLANDS"] = "CC";
    CountryCode["COLOMBIA"] = "CO";
    CountryCode["COMOROS"] = "KM";
    CountryCode["CONGO"] = "CG";
    CountryCode["CONGO_DEMOCRATIC_REPUBLIC"] = "CD";
    CountryCode["COOK_ISLANDS"] = "CK";
    CountryCode["COSTA_RICA"] = "CR";
    CountryCode["COTE_DIVOIRE"] = "CI";
    CountryCode["CROATIA"] = "HR";
    CountryCode["CUBA"] = "CU";
    CountryCode["CYPRUS"] = "CY";
    CountryCode["CZECH_REPUBLIC"] = "CZ";
    CountryCode["DENMARK"] = "DK";
    CountryCode["DJIBOUTI"] = "DJ";
    CountryCode["DOMINICA"] = "DM";
    CountryCode["DOMINICAN_REPUBLIC"] = "DO";
    CountryCode["ECUADOR"] = "EC";
    CountryCode["EGYPT"] = "EG";
    CountryCode["EL_SALVADOR"] = "SV";
    CountryCode["EQUATORIAL_GUINEA"] = "GQ";
    CountryCode["ERITREA"] = "ER";
    CountryCode["ESTONIA"] = "EE";
    CountryCode["ETHIOPIA"] = "ET";
    CountryCode["FALKLAND_ISLANDS"] = "FK";
    CountryCode["FAROE_ISLANDS"] = "FO";
    CountryCode["FIJI"] = "FJ";
    CountryCode["FINLAND"] = "FI";
    CountryCode["FRANCE"] = "FR";
    CountryCode["FRENCH_GUIANA"] = "GF";
    CountryCode["FRENCH_POLYNESIA"] = "PF";
    CountryCode["FRENCH_SOUTHERN_TERRITORIES"] = "TF";
    CountryCode["GABON"] = "GA";
    CountryCode["GAMBIA"] = "GM";
    CountryCode["GEORGIA"] = "GE";
    CountryCode["GERMANY"] = "DE";
    CountryCode["GHANA"] = "GH";
    CountryCode["GIBRALTAR"] = "GI";
    CountryCode["GREECE"] = "GR";
    CountryCode["GREENLAND"] = "GL";
    CountryCode["GRENADA"] = "GD";
    CountryCode["GUADELOUPE"] = "GP";
    CountryCode["GUAM"] = "GU";
    CountryCode["GUATEMALA"] = "GT";
    CountryCode["GUERNSEY"] = "GG";
    CountryCode["GUINEA"] = "GN";
    CountryCode["GUINEA_BISSAU"] = "GW";
    CountryCode["GUYANA"] = "GY";
    CountryCode["HAITI"] = "HT";
    CountryCode["HEARD_ISLAND_MCDONALD_ISLANDS"] = "HM";
    CountryCode["HOLY_SEE_VATICAN_CITY_STATE"] = "VA";
    CountryCode["HONDURAS"] = "HN";
    CountryCode["HONG_KONG"] = "HK";
    CountryCode["HUNGARY"] = "HU";
    CountryCode["ICELAND"] = "IS";
    CountryCode["INDIA"] = "IN";
    CountryCode["INDONESIA"] = "ID";
    CountryCode["IRAN"] = "IR";
    CountryCode["IRAQ"] = "IQ";
    CountryCode["IRELAND"] = "IE";
    CountryCode["ISLE_OF_MAN"] = "IM";
    CountryCode["ISRAEL"] = "IL";
    CountryCode["ITALY"] = "IT";
    CountryCode["JAMAICA"] = "JM";
    CountryCode["JAPAN"] = "JP";
    CountryCode["JERSEY"] = "JE";
    CountryCode["JORDAN"] = "JO";
    CountryCode["KAZAKHSTAN"] = "KZ";
    CountryCode["KENYA"] = "KE";
    CountryCode["KIRIBATI"] = "KI";
    CountryCode["KOREA"] = "KR";
    CountryCode["KUWAIT"] = "KW";
    CountryCode["KYRGYZSTAN"] = "KG";
    CountryCode["LAO_PEOPLES_DEMOCRATIC_REPUBLIC"] = "LA";
    CountryCode["LATVIA"] = "LV";
    CountryCode["LEBANON"] = "LB";
    CountryCode["LESOTHO"] = "LS";
    CountryCode["LIBERIA"] = "LR";
    CountryCode["LIBYAN_ARAB_JAMAHIRIYA"] = "LY";
    CountryCode["LIECHTENSTEIN"] = "LI";
    CountryCode["LITHUANIA"] = "LT";
    CountryCode["LUXEMBOURG"] = "LU";
    CountryCode["MACAO"] = "MO";
    CountryCode["MACEDONIA"] = "MK";
    CountryCode["MADAGASCAR"] = "MG";
    CountryCode["MALAWI"] = "MW";
    CountryCode["MALAYSIA"] = "MY";
    CountryCode["MALDIVES"] = "MV";
    CountryCode["MALI"] = "ML";
    CountryCode["MALTA"] = "MT";
    CountryCode["MARSHALL_ISLANDS"] = "MH";
    CountryCode["MARTINIQUE"] = "MQ";
    CountryCode["MAURITANIA"] = "MR";
    CountryCode["MAURITIUS"] = "MU";
    CountryCode["MAYOTTE"] = "YT";
    CountryCode["MEXICO"] = "MX";
    CountryCode["MICRONESIA"] = "FM";
    CountryCode["MOLDOVA"] = "MD";
    CountryCode["MONACO"] = "MC";
    CountryCode["MONGOLIA"] = "MN";
    CountryCode["MONTENEGRO"] = "ME";
    CountryCode["MONTSERRAT"] = "MS";
    CountryCode["MOROCCO"] = "MA";
    CountryCode["MOZAMBIQUE"] = "MZ";
    CountryCode["MYANMAR"] = "MM";
    CountryCode["NAMIBIA"] = "NA";
    CountryCode["NAURU"] = "NR";
    CountryCode["NEPAL"] = "NP";
    CountryCode["NETHERLANDS"] = "NL";
    CountryCode["NETHERLANDS_ANTILLES"] = "AN";
    CountryCode["NEW_CALEDONIA"] = "NC";
    CountryCode["NEW_ZEALAND"] = "NZ";
    CountryCode["NICARAGUA"] = "NI";
    CountryCode["NIGER"] = "NE";
    CountryCode["NIGERIA"] = "NG";
    CountryCode["NIUE"] = "NU";
    CountryCode["NORFOLK_ISLAND"] = "NF";
    CountryCode["NORTHERN_MARIANA_ISLANDS"] = "MP";
    CountryCode["NORWAY"] = "NO";
    CountryCode["OMAN"] = "OM";
    CountryCode["PAKISTAN"] = "PK";
    CountryCode["PALAU"] = "PW";
    CountryCode["PALESTINIAN_TERRITORY"] = "PS";
    CountryCode["PANAMA"] = "PA";
    CountryCode["PAPUA_NEW_GUINEA"] = "PG";
    CountryCode["PARAGUAY"] = "PY";
    CountryCode["PERU"] = "PE";
    CountryCode["PHILIPPINES"] = "PH";
    CountryCode["PITCAIRN"] = "PN";
    CountryCode["POLAND"] = "PL";
    CountryCode["PORTUGAL"] = "PT";
    CountryCode["PUERTO_RICO"] = "PR";
    CountryCode["QATAR"] = "QA";
    CountryCode["REUNION"] = "RE";
    CountryCode["ROMANIA"] = "RO";
    CountryCode["RUSSIAN_FEDERATION"] = "RU";
    CountryCode["RWANDA"] = "RW";
    CountryCode["SAINT_BARTHELEMY"] = "BL";
    CountryCode["SAINT_HELENA"] = "SH";
    CountryCode["SAINT_KITTS_AND_NEVIS"] = "KN";
    CountryCode["SAINT_LUCIA"] = "LC";
    CountryCode["SAINT_MARTIN"] = "MF";
    CountryCode["SAINT_PIERRE_AND_MIQUELON"] = "PM";
    CountryCode["SAINT_VINCENT_AND_GRENADINES"] = "VC";
    CountryCode["SAMOA"] = "WS";
    CountryCode["SAN_MARINO"] = "SM";
    CountryCode["SAO_TOME_AND_PRINCIPE"] = "ST";
    CountryCode["SAUDI_ARABIA"] = "SA";
    CountryCode["SENEGAL"] = "SN";
    CountryCode["SERBIA"] = "RS";
    CountryCode["SEYCHELLES"] = "SC";
    CountryCode["SIERRA_LEONE"] = "SL";
    CountryCode["SINGAPORE"] = "SG";
    CountryCode["SLOVAKIA"] = "SK";
    CountryCode["SLOVENIA"] = "SI";
    CountryCode["SOLOMON_ISLANDS"] = "SB";
    CountryCode["SOMALIA"] = "SO";
    CountryCode["SOUTH_AFRICA"] = "ZA";
    CountryCode["SOUTH_GEORGIA_AND_SANDWICH_ISL"] = "GS";
    CountryCode["SPAIN"] = "ES";
    CountryCode["SRI_LANKA"] = "LK";
    CountryCode["SUDAN"] = "SD";
    CountryCode["SURINAME"] = "SR";
    CountryCode["SVALBARD_AND_JAN_MAYEN"] = "SJ";
    CountryCode["SWAZILAND"] = "SZ";
    CountryCode["SWEDEN"] = "SE";
    CountryCode["SWITZERLAND"] = "CH";
    CountryCode["SYRIAN_ARAB_REPUBLIC"] = "SY";
    CountryCode["TAIWAN"] = "TW";
    CountryCode["TAJIKISTAN"] = "TJ";
    CountryCode["TANZANIA"] = "TZ";
    CountryCode["THAILAND"] = "TH";
    CountryCode["TIMOR_LESTE"] = "TL";
    CountryCode["TOGO"] = "TG";
    CountryCode["TOKELAU"] = "TK";
    CountryCode["TONGA"] = "TO";
    CountryCode["TRINIDAD_AND_TOBAGO"] = "TT";
    CountryCode["TUNISIA"] = "TN";
    CountryCode["TURKEY"] = "TR";
    CountryCode["TURKMENISTAN"] = "TM";
    CountryCode["TURKS_AND_CAICOS_ISLANDS"] = "TC";
    CountryCode["TUVALU"] = "TV";
    CountryCode["UGANDA"] = "UG";
    CountryCode["UKRAINE"] = "UA";
    CountryCode["UNITED_ARAB_EMIRATES"] = "AE";
    CountryCode["UNITED_KINGDOM"] = "GB";
    CountryCode["UNITED_STATES"] = "US";
    CountryCode["UNITED_STATES_OUTLYING_ISLANDS"] = "UM";
    CountryCode["URUGUAY"] = "UY";
    CountryCode["UZBEKISTAN"] = "UZ";
    CountryCode["VANUATU"] = "VU";
    CountryCode["VENEZUELA"] = "VE";
    CountryCode["VIET_NAM"] = "VN";
    CountryCode["VIRGIN_ISLANDS_BRITISH"] = "VG";
    CountryCode["VIRGIN_ISLANDS_US"] = "VI";
    CountryCode["WALLIS_AND_FUTUNA"] = "WF";
    CountryCode["WESTERN_SAHARA"] = "EH";
    CountryCode["YEMEN"] = "YE";
    CountryCode["ZAMBIA"] = "ZM";
    CountryCode["ZIMBABW"] = "ZW";
})(CountryCode = exports.CountryCode || (exports.CountryCode = {}));


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeCount = void 0;
var EmployeeCount;
(function (EmployeeCount) {
    EmployeeCount["LT100"] = "LT100";
    EmployeeCount["LT500"] = "LT500";
    EmployeeCount["LT1500"] = "LT1500";
    EmployeeCount["GTE1500"] = "GTE1500";
})(EmployeeCount = exports.EmployeeCount || (exports.EmployeeCount = {}));


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.I40MPService = void 0;
var I40MPService;
(function (I40MPService) {
    I40MPService["INSTANCE"] = "INSTANCE";
    I40MPService["QUESTIONNAIRE"] = "QUESTIONNAIRE";
    I40MPService["ASSESSMENT"] = "ASSESSMENT";
    I40MPService["MEASURE"] = "MEASURE";
    I40MPService["BILLING"] = "BILLING";
    I40MPService["UX"] = "UX";
    I40MPService["GRAPHIC"] = "GRAPHIC";
    I40MPService["MATURITY_SCAN"] = "MATURITY_SCAN";
    I40MPService["SCM_SCAN"] = "SCM_SCAN";
    I40MPService["STORAGE"] = "STORAGE";
})(I40MPService = exports.I40MPService || (exports.I40MPService = {}));


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Industry = void 0;
var Industry;
(function (Industry) {
    Industry["AEROSPACE"] = "AEROSPACE";
    Industry["AUTOMOTIVE"] = "AUTOMOTIVE";
    Industry["CHEMICAL"] = "CHEMICAL";
    Industry["COMPONENT_SUPPLIER"] = "COMPONENT_SUPPLIER";
    Industry["CONSTRUCTION"] = "CONSTRUCTION";
    Industry["ELECTRONICS_SEMICONDUCTOR"] = "ELECTRONICS_SEMICONDUCTOR";
    Industry["ENERGY"] = "ENERGY";
    Industry["FOOD_BEVERAGE"] = "FOOD_BEVERAGE";
    Industry["INDUSTRIAL_SERVICES"] = "INDUSTRIAL_SERVICES";
    Industry["LOGISTICS"] = "LOGISTICS";
    Industry["MEDICAL_DEVICES"] = "MEDICAL_DEVICES";
    Industry["EQUIPMENT_MACHINE_MANUFACTURING"] = "EQUIPMENT_MACHINE_MANUFACTURING";
    Industry["MINING_QUARRYING"] = "MINING_QUARRYING";
    Industry["PHARMACEUTICAL"] = "PHARMACEUTICAL";
    Industry["STEEL_METAL"] = "STEEL_METAL";
    Industry["WHITEGOODS"] = "WHITEGOODS";
    Industry["OTHER"] = "OTHER";
})(Industry = exports.Industry || (exports.Industry = {}));


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.IndustryType = void 0;
var IndustryType;
(function (IndustryType) {
    IndustryType["PROCESS"] = "PROCESS";
    IndustryType["DISCRETE_COMPONENT"] = "DISCRETE_COMPONENT";
    IndustryType["DISCRETE_MODULE_SYSTEM"] = "DISCRETE_MODULE_SYSTEM";
    IndustryType["DISCRETE_OEM"] = "DISCRETE_OEM";
    IndustryType["OTHERS"] = "OTHERS";
})(IndustryType = exports.IndustryType || (exports.IndustryType = {}));


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// taken from https://gist.github.com/msikma/8912e62ed866778ff8cd
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageCode = void 0;
// List of language tags according to RFC 5646.
// See <http://tools.ietf.org/html/rfc5646> for info on how to parse
// these language tags. Some duplicates have been removed.
var LanguageCode;
(function (LanguageCode) {
    LanguageCode["AF"] = "af";
    LanguageCode["AF_ZA"] = "af_ZA";
    LanguageCode["AR"] = "ar";
    LanguageCode["AR_AE"] = "ar_AE";
    LanguageCode["AR_BH"] = "ar_BH";
    LanguageCode["AR_DZ"] = "ar_DZ";
    LanguageCode["AR_EG"] = "ar_EG";
    LanguageCode["AR_IQ"] = "ar_IQ";
    LanguageCode["AR_JO"] = "ar_JO";
    LanguageCode["AR_KW"] = "ar_KW";
    LanguageCode["AR_LB"] = "ar_LB";
    LanguageCode["AR_LY"] = "ar_LY";
    LanguageCode["AR_MA"] = "ar_MA";
    LanguageCode["AR_OM"] = "ar_OM";
    LanguageCode["AR_QA"] = "ar_QA";
    LanguageCode["AR_SA"] = "ar_SA";
    LanguageCode["AR_SY"] = "ar_SY";
    LanguageCode["AR_TN"] = "ar_TN";
    LanguageCode["AR_YE"] = "ar_YE";
    LanguageCode["AZ"] = "az";
    LanguageCode["AZ_AZ"] = "az_AZ";
    LanguageCode["AZ_CYRL_AZ"] = "az_Cyrl_AZ";
    LanguageCode["BE"] = "be";
    LanguageCode["BE_BY"] = "be_BY";
    LanguageCode["BG"] = "bg";
    LanguageCode["BG_BG"] = "bg_BG";
    LanguageCode["BS_BA"] = "bs_BA";
    LanguageCode["CA"] = "ca";
    LanguageCode["CA_ES"] = "ca_ES";
    LanguageCode["CS"] = "cs";
    LanguageCode["CS_CZ"] = "cs_CZ";
    LanguageCode["CY"] = "cy";
    LanguageCode["CY_GB"] = "cy_GB";
    LanguageCode["DA"] = "da";
    LanguageCode["DA_DK"] = "da_DK";
    LanguageCode["DE"] = "de";
    LanguageCode["DE_AT"] = "de_AT";
    LanguageCode["DE_CH"] = "de_CH";
    LanguageCode["DE_DE"] = "de_DE";
    LanguageCode["DE_LI"] = "de_LI";
    LanguageCode["DE_LU"] = "de_LU";
    LanguageCode["DV"] = "dv";
    LanguageCode["DV_MV"] = "dv_MV";
    LanguageCode["EL"] = "el";
    LanguageCode["EL_GR"] = "el_GR";
    LanguageCode["EN"] = "en";
    LanguageCode["EN_AU"] = "en_AU";
    LanguageCode["EN_BZ"] = "en_BZ";
    LanguageCode["EN_CA"] = "en_CA";
    LanguageCode["EN_CB"] = "en_CB";
    LanguageCode["EN_GB"] = "en_GB";
    LanguageCode["EN_IE"] = "en_IE";
    LanguageCode["EN_JM"] = "en_JM";
    LanguageCode["EN_NZ"] = "en_NZ";
    LanguageCode["EN_PH"] = "en_PH";
    LanguageCode["EN_TT"] = "en_TT";
    LanguageCode["EN_US"] = "en_US";
    LanguageCode["EN_ZA"] = "en_ZA";
    LanguageCode["EN_ZW"] = "en_ZW";
    LanguageCode["EO"] = "eo";
    LanguageCode["ES"] = "es";
    LanguageCode["ES_AR"] = "es_AR";
    LanguageCode["ES_BO"] = "es_BO";
    LanguageCode["ES_CL"] = "es_CL";
    LanguageCode["ES_CO"] = "es_CO";
    LanguageCode["ES_CR"] = "es_CR";
    LanguageCode["ES_DO"] = "es_DO";
    LanguageCode["ES_EC"] = "es_EC";
    LanguageCode["ES_ES"] = "es_ES";
    LanguageCode["ES_GT"] = "es_GT";
    LanguageCode["ES_HN"] = "es_HN";
    LanguageCode["ES_MX"] = "es_MX";
    LanguageCode["ES_NI"] = "es_NI";
    LanguageCode["ES_PA"] = "es_PA";
    LanguageCode["ES_PE"] = "es_PE";
    LanguageCode["ES_PR"] = "es_PR";
    LanguageCode["ES_PY"] = "es_PY";
    LanguageCode["ES_SV"] = "es_SV";
    LanguageCode["ES_UY"] = "es_UY";
    LanguageCode["ES_VE"] = "es_VE";
    LanguageCode["ET"] = "et";
    LanguageCode["ET_EE"] = "et_EE";
    LanguageCode["EU"] = "eu";
    LanguageCode["EU_ES"] = "eu_ES";
    LanguageCode["FA"] = "fa";
    LanguageCode["FA_IR"] = "fa_IR";
    LanguageCode["FI"] = "fi";
    LanguageCode["FI_FI"] = "fi_FI";
    LanguageCode["FO"] = "fo";
    LanguageCode["FO_FO"] = "fo_FO";
    LanguageCode["FR"] = "fr";
    LanguageCode["FR_BE"] = "fr_BE";
    LanguageCode["FR_CA"] = "fr_CA";
    LanguageCode["FR_CH"] = "fr_CH";
    LanguageCode["FR_FR"] = "fr_FR";
    LanguageCode["FR_LU"] = "fr_LU";
    LanguageCode["FR_MC"] = "fr_MC";
    LanguageCode["GL"] = "gl";
    LanguageCode["GL_ES"] = "gl_ES";
    LanguageCode["GU"] = "gu";
    LanguageCode["GU_IN"] = "gu_IN";
    LanguageCode["HE"] = "he";
    LanguageCode["HE_IL"] = "he_IL";
    LanguageCode["HI"] = "hi";
    LanguageCode["HI_IN"] = "hi_IN";
    LanguageCode["HR"] = "hr";
    LanguageCode["HR_BA"] = "hr_BA";
    LanguageCode["HR_HR"] = "hr_HR";
    LanguageCode["HU"] = "hu";
    LanguageCode["HU_HU"] = "hu_HU";
    LanguageCode["HY"] = "hy";
    LanguageCode["HY_AM"] = "hy_AM";
    LanguageCode["ID"] = "id";
    LanguageCode["ID_ID"] = "id_ID";
    LanguageCode["IS"] = "is";
    LanguageCode["IS_IS"] = "is_IS";
    LanguageCode["IT"] = "it";
    LanguageCode["IT_CH"] = "it_CH";
    LanguageCode["IT_IT"] = "it_IT";
    LanguageCode["JA"] = "ja";
    LanguageCode["JA_JP"] = "ja_JP";
    LanguageCode["KA"] = "ka";
    LanguageCode["KA_GE"] = "ka_GE";
    LanguageCode["KK"] = "kk";
    LanguageCode["KK_KZ"] = "kk_KZ";
    LanguageCode["KN"] = "kn";
    LanguageCode["KN_IN"] = "kn_IN";
    LanguageCode["KO"] = "ko";
    LanguageCode["KO_KR"] = "ko_KR";
    LanguageCode["KOK"] = "kok";
    LanguageCode["KOK_IN"] = "kok_IN";
    LanguageCode["KY"] = "ky";
    LanguageCode["KY_KG"] = "ky_KG";
    LanguageCode["LT"] = "lt";
    LanguageCode["LT_LT"] = "lt_LT";
    LanguageCode["LV"] = "lv";
    LanguageCode["LV_LV"] = "lv_LV";
    LanguageCode["MI"] = "mi";
    LanguageCode["MI_NZ"] = "mi_NZ";
    LanguageCode["MK"] = "mk";
    LanguageCode["MK_MK"] = "mk_MK";
    LanguageCode["MN"] = "mn";
    LanguageCode["MN_MN"] = "mn_MN";
    LanguageCode["MR"] = "mr";
    LanguageCode["MR_IN"] = "mr_IN";
    LanguageCode["MS"] = "ms";
    LanguageCode["MS_BN"] = "ms_BN";
    LanguageCode["MS_MY"] = "ms_MY";
    LanguageCode["MT"] = "mt";
    LanguageCode["MT_MT"] = "mt_MT";
    LanguageCode["NB"] = "nb";
    LanguageCode["NB_NO"] = "nb_NO";
    LanguageCode["NL"] = "nl";
    LanguageCode["NL_BE"] = "nl_BE";
    LanguageCode["NL_NL"] = "nl_NL";
    LanguageCode["NN_NO"] = "nn_NO";
    LanguageCode["NS"] = "ns";
    LanguageCode["NS_ZA"] = "ns_ZA";
    LanguageCode["PA"] = "pa";
    LanguageCode["PA_IN"] = "pa_IN";
    LanguageCode["PL"] = "pl";
    LanguageCode["PL_PL"] = "pl_PL";
    LanguageCode["PS"] = "ps";
    LanguageCode["PS_AR"] = "ps_AR";
    LanguageCode["PT"] = "pt";
    LanguageCode["PT_BR"] = "pt_BR";
    LanguageCode["PT_PT"] = "pt_PT";
    LanguageCode["QU"] = "qu";
    LanguageCode["QU_BO"] = "qu_BO";
    LanguageCode["QU_EC"] = "qu_EC";
    LanguageCode["QU_PE"] = "qu_PE";
    LanguageCode["RO"] = "ro";
    LanguageCode["RO_RO"] = "ro_RO";
    LanguageCode["RU"] = "ru";
    LanguageCode["RU_RU"] = "ru_RU";
    LanguageCode["SA"] = "sa";
    LanguageCode["SA_IN"] = "sa_IN";
    LanguageCode["SE"] = "se";
    LanguageCode["SE_FI"] = "se_FI";
    LanguageCode["SE_NO"] = "se_NO";
    LanguageCode["SE_SE"] = "se_SE";
    LanguageCode["SK"] = "sk";
    LanguageCode["SK_SK"] = "sk_SK";
    LanguageCode["SL"] = "sl";
    LanguageCode["SL_SI"] = "sl_SI";
    LanguageCode["SQ"] = "sq";
    LanguageCode["SQ_AL"] = "sq_AL";
    LanguageCode["SR_BA"] = "sr_BA";
    LanguageCode["SR_CYRL_BA"] = "sr_Cyrl_BA";
    LanguageCode["SR_SP"] = "sr_SP";
    LanguageCode["SR_CYRL_SP"] = "sr_Cyrl_SP";
    LanguageCode["SV"] = "sv";
    LanguageCode["SV_FI"] = "sv_FI";
    LanguageCode["SV_SE"] = "sv_SE";
    LanguageCode["SW"] = "sw";
    LanguageCode["SW_KE"] = "sw_KE";
    LanguageCode["SYR"] = "syr";
    LanguageCode["SYR_SY"] = "syr_SY";
    LanguageCode["TA"] = "ta";
    LanguageCode["TA_IN"] = "ta_IN";
    LanguageCode["TE"] = "te";
    LanguageCode["TE_IN"] = "te_IN";
    LanguageCode["TH"] = "th";
    LanguageCode["TH_TH"] = "th_TH";
    LanguageCode["TL"] = "tl";
    LanguageCode["TL_PH"] = "tl_PH";
    LanguageCode["TN"] = "tn";
    LanguageCode["TN_ZA"] = "tn_ZA";
    LanguageCode["TR"] = "tr";
    LanguageCode["TR_TR"] = "tr_TR";
    LanguageCode["TT"] = "tt";
    LanguageCode["TT_RU"] = "tt_RU";
    LanguageCode["TS"] = "ts";
    LanguageCode["UK"] = "uk";
    LanguageCode["UK_UA"] = "uk_UA";
    LanguageCode["UR"] = "ur";
    LanguageCode["UR_PK"] = "ur_PK";
    LanguageCode["UZ"] = "uz";
    LanguageCode["UZ_UZ"] = "uz_UZ";
    LanguageCode["UZ_CYRL_UZ"] = "uz_Cyrl_UZ";
    LanguageCode["VI"] = "vi";
    LanguageCode["VI_VN"] = "vi_VN";
    LanguageCode["XH"] = "xh";
    LanguageCode["XH_ZA"] = "xh_ZA";
    LanguageCode["ZH"] = "zh";
    LanguageCode["ZH_CN"] = "zh_CN";
    LanguageCode["ZH_HK"] = "zh_HK";
    LanguageCode["ZH_MO"] = "zh_MO";
    LanguageCode["ZH_SG"] = "zh_SG";
    LanguageCode["ZH_TW"] = "zh_TW";
    LanguageCode["ZU"] = "zu";
    LanguageCode["ZU_ZA"] = "zu_ZA";
})(LanguageCode = exports.LanguageCode || (exports.LanguageCode = {}));


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageName = void 0;
var LanguageName;
(function (LanguageName) {
    LanguageName["AF"] = "Afrikaans";
    LanguageName["AF_ZA"] = "Afrikaans (South Africa)";
    LanguageName["AR"] = "Arabic";
    LanguageName["AR_AE"] = "Arabic (U.A.E.)";
    LanguageName["AR_BH"] = "Arabic (Bahrain)";
    LanguageName["AR_DZ"] = "Arabic (Algeria)";
    LanguageName["AR_EG"] = "Arabic (Egypt)";
    LanguageName["AR_IQ"] = "Arabic (Iraq)";
    LanguageName["AR_JO"] = "Arabic (Jordan)";
    LanguageName["AR_KW"] = "Arabic (Kuwait)";
    LanguageName["AR_LB"] = "Arabic (Lebanon)";
    LanguageName["AR_LY"] = "Arabic (Libya)";
    LanguageName["AR_MA"] = "Arabic (Morocco)";
    LanguageName["AR_OM"] = "Arabic (Oman)";
    LanguageName["AR_QA"] = "Arabic (Qatar)";
    LanguageName["AR_SA"] = "Arabic (Saudi Arabia)";
    LanguageName["AR_SY"] = "Arabic (Syria)";
    LanguageName["AR_TN"] = "Arabic (Tunisia)";
    LanguageName["AR_YE"] = "Arabic (Yemen)";
    LanguageName["AZ"] = "Azeri (Latin)";
    LanguageName["AZ_AZ"] = "Azeri (Latin) (Azerbaijan)";
    LanguageName["AZ_CYRL_AZ"] = "Azeri (Cyrillic) (Azerbaijan)";
    LanguageName["BE"] = "Belarusian";
    LanguageName["BE_BY"] = "Belarusian (Belarus)";
    LanguageName["BG"] = "Bulgarian";
    LanguageName["BG_BG"] = "Bulgarian (Bulgaria)";
    LanguageName["BS_BA"] = "Bosnian (Bosnia and Herzegovina)";
    LanguageName["CA"] = "Catalan";
    LanguageName["CA_ES"] = "Catalan (Spain)";
    LanguageName["CS"] = "Czech";
    LanguageName["CS_CZ"] = "Czech (Czech Republic)";
    LanguageName["CY"] = "Welsh";
    LanguageName["CY_GB"] = "Welsh (United Kingdom)";
    LanguageName["DA"] = "Danish";
    LanguageName["DA_DK"] = "Danish (Denmark)";
    LanguageName["DE"] = "German";
    LanguageName["DE_AT"] = "German (Austria)";
    LanguageName["DE_CH"] = "German (Switzerland)";
    LanguageName["DE_DE"] = "German (Germany)";
    LanguageName["DE_LI"] = "German (Liechtenstein)";
    LanguageName["DE_LU"] = "German (Luxembourg)";
    LanguageName["DV"] = "Divehi";
    LanguageName["DV_MV"] = "Divehi (Maldives)";
    LanguageName["EL"] = "Greek";
    LanguageName["EL_GR"] = "Greek (Greece)";
    LanguageName["EN"] = "English";
    LanguageName["EN_AU"] = "English (Australia)";
    LanguageName["EN_BZ"] = "English (Belize)";
    LanguageName["EN_CA"] = "English (Canada)";
    LanguageName["EN_CB"] = "English (Caribbean)";
    LanguageName["EN_GB"] = "English (United Kingdom)";
    LanguageName["EN_IE"] = "English (Ireland)";
    LanguageName["EN_JM"] = "English (Jamaica)";
    LanguageName["EN_NZ"] = "English (New Zealand)";
    LanguageName["EN_PH"] = "English (Republic of the Philippines)";
    LanguageName["EN_TT"] = "English (Trinidad and Tobago)";
    LanguageName["EN_US"] = "English (United States)";
    LanguageName["EN_ZA"] = "English (South Africa)";
    LanguageName["EN_ZW"] = "English (Zimbabwe)";
    LanguageName["EO"] = "Esperanto";
    LanguageName["ES"] = "Spanish";
    LanguageName["ES_AR"] = "Spanish (Argentina)";
    LanguageName["ES_BO"] = "Spanish (Bolivia)";
    LanguageName["ES_CL"] = "Spanish (Chile)";
    LanguageName["ES_CO"] = "Spanish (Colombia)";
    LanguageName["ES_CR"] = "Spanish (Costa Rica)";
    LanguageName["ES_DO"] = "Spanish (Dominican Republic)";
    LanguageName["ES_EC"] = "Spanish (Ecuador)";
    LanguageName["ES_ES"] = "Spanish (Spain)";
    LanguageName["ES_GT"] = "Spanish (Guatemala)";
    LanguageName["ES_HN"] = "Spanish (Honduras)";
    LanguageName["ES_MX"] = "Spanish (Mexico)";
    LanguageName["ES_NI"] = "Spanish (Nicaragua)";
    LanguageName["ES_PA"] = "Spanish (Panama)";
    LanguageName["ES_PE"] = "Spanish (Peru)";
    LanguageName["ES_PR"] = "Spanish (Puerto Rico)";
    LanguageName["ES_PY"] = "Spanish (Paraguay)";
    LanguageName["ES_SV"] = "Spanish (El Salvador)";
    LanguageName["ES_UY"] = "Spanish (Uruguay)";
    LanguageName["ES_VE"] = "Spanish (Venezuela)";
    LanguageName["ET"] = "Estonian";
    LanguageName["ET_EE"] = "Estonian (Estonia)";
    LanguageName["EU"] = "Basque";
    LanguageName["EU_ES"] = "Basque (Spain)";
    LanguageName["FA"] = "Farsi";
    LanguageName["FA_IR"] = "Farsi (Iran)";
    LanguageName["FI"] = "Finnish";
    LanguageName["FI_FI"] = "Finnish (Finland)";
    LanguageName["FO"] = "Faroese";
    LanguageName["FO_FO"] = "Faroese (Faroe Islands)";
    LanguageName["FR"] = "French";
    LanguageName["FR_BE"] = "French (Belgium)";
    LanguageName["FR_CA"] = "French (Canada)";
    LanguageName["FR_CH"] = "French (Switzerland)";
    LanguageName["FR_FR"] = "French (France)";
    LanguageName["FR_LU"] = "French (Luxembourg)";
    LanguageName["FR_MC"] = "French (Principality of Monaco)";
    LanguageName["GL"] = "Galician";
    LanguageName["GL_ES"] = "Galician (Spain)";
    LanguageName["GU"] = "Gujarati";
    LanguageName["GU_IN"] = "Gujarati (India)";
    LanguageName["HE"] = "Hebrew";
    LanguageName["HE_IL"] = "Hebrew (Israel)";
    LanguageName["HI"] = "Hindi";
    LanguageName["HI_IN"] = "Hindi (India)";
    LanguageName["HR"] = "Croatian";
    LanguageName["HR_BA"] = "Croatian (Bosnia and Herzegovina)";
    LanguageName["HR_HR"] = "Croatian (Croatia)";
    LanguageName["HU"] = "Hungarian";
    LanguageName["HU_HU"] = "Hungarian (Hungary)";
    LanguageName["HY"] = "Armenian";
    LanguageName["HY_AM"] = "Armenian (Armenia)";
    LanguageName["ID"] = "Indonesian";
    LanguageName["ID_ID"] = "Indonesian (Indonesia)";
    LanguageName["IS"] = "Icelandic";
    LanguageName["IS_IS"] = "Icelandic (Iceland)";
    LanguageName["IT"] = "Italian";
    LanguageName["IT_CH"] = "Italian (Switzerland)";
    LanguageName["IT_IT"] = "Italian (Italy)";
    LanguageName["JA"] = "Japanese";
    LanguageName["JA_JP"] = "Japanese (Japan)";
    LanguageName["KA"] = "Georgian";
    LanguageName["KA_GE"] = "Georgian (Georgia)";
    LanguageName["KK"] = "Kazakh";
    LanguageName["KK_KZ"] = "Kazakh (Kazakhstan)";
    LanguageName["KN"] = "Kannada";
    LanguageName["KN_IN"] = "Kannada (India)";
    LanguageName["KO"] = "Korean";
    LanguageName["KO_KR"] = "Korean (Korea)";
    LanguageName["KOK"] = "Konkani";
    LanguageName["KOK_IN"] = "Konkani (India)";
    LanguageName["KY"] = "Kyrgyz";
    LanguageName["KY_KG"] = "Kyrgyz (Kyrgyzstan)";
    LanguageName["LT"] = "Lithuanian";
    LanguageName["LT_LT"] = "Lithuanian (Lithuania)";
    LanguageName["LV"] = "Latvian";
    LanguageName["LV_LV"] = "Latvian (Latvia)";
    LanguageName["MI"] = "Maori";
    LanguageName["MI_NZ"] = "Maori (New Zealand)";
    LanguageName["MK"] = "FYRO Macedonian";
    LanguageName["MK_MK"] = "FYRO Macedonian (Former Yugoslav Republic of Macedonia)";
    LanguageName["MN"] = "Mongolian";
    LanguageName["MN_MN"] = "Mongolian (Mongolia)";
    LanguageName["MR"] = "Marathi";
    LanguageName["MR_IN"] = "Marathi (India)";
    LanguageName["MS"] = "Malay";
    LanguageName["MS_BN"] = "Malay (Brunei Darussalam)";
    LanguageName["MS_MY"] = "Malay (Malaysia)";
    LanguageName["MT"] = "Maltese";
    LanguageName["MT_MT"] = "Maltese (Malta)";
    LanguageName["NB"] = "Norwegian (Bokm?l)";
    LanguageName["NB_NO"] = "Norwegian (Bokm?l) (Norway)";
    LanguageName["NL"] = "Dutch";
    LanguageName["NL_BE"] = "Dutch (Belgium)";
    LanguageName["NL_NL"] = "Dutch (Netherlands)";
    LanguageName["NN_NO"] = "Norwegian (Nynorsk) (Norway)";
    LanguageName["NS"] = "Northern Sotho";
    LanguageName["NS_ZA"] = "Northern Sotho (South Africa)";
    LanguageName["PA"] = "Punjabi";
    LanguageName["PA_IN"] = "Punjabi (India)";
    LanguageName["PL"] = "Polish";
    LanguageName["PL_PL"] = "Polish (Poland)";
    LanguageName["PS"] = "Pashto";
    LanguageName["PS_AR"] = "Pashto (Afghanistan)";
    LanguageName["PT"] = "Portuguese";
    LanguageName["PT_BR"] = "Portuguese (Brazil)";
    LanguageName["PT_PT"] = "Portuguese (Portugal)";
    LanguageName["QU"] = "Quechua";
    LanguageName["QU_BO"] = "Quechua (Bolivia)";
    LanguageName["QU_EC"] = "Quechua (Ecuador)";
    LanguageName["QU_PE"] = "Quechua (Peru)";
    LanguageName["RO"] = "Romanian";
    LanguageName["RO_RO"] = "Romanian (Romania)";
    LanguageName["RU"] = "Russian";
    LanguageName["RU_RU"] = "Russian (Russia)";
    LanguageName["SA"] = "Sanskrit";
    LanguageName["SA_IN"] = "Sanskrit (India)";
    LanguageName["SE"] = "Sami";
    LanguageName["SE_FI"] = "Sami (Finland)";
    LanguageName["SE_NO"] = "Sami (Norway)";
    LanguageName["SE_SE"] = "Sami (Sweden)";
    LanguageName["SK"] = "Slovak";
    LanguageName["SK_SK"] = "Slovak (Slovakia)";
    LanguageName["SL"] = "Slovenian";
    LanguageName["SL_SI"] = "Slovenian (Slovenia)";
    LanguageName["SQ"] = "Albanian";
    LanguageName["SQ_AL"] = "Albanian (Albania)";
    LanguageName["SR_BA"] = "Serbian (Latin) (Bosnia and Herzegovina)";
    LanguageName["SR_CYRL_BA"] = "Serbian (Cyrillic) (Bosnia and Herzegovina)";
    LanguageName["SR_SP"] = "Serbian (Latin) (Serbia and Montenegro)";
    LanguageName["SR_CYRL_SP"] = "Serbian (Cyrillic) (Serbia and Montenegro)";
    LanguageName["SV"] = "Swedish";
    LanguageName["SV_FI"] = "Swedish (Finland)";
    LanguageName["SV_SE"] = "Swedish (Sweden)";
    LanguageName["SW"] = "Swahili";
    LanguageName["SW_KE"] = "Swahili (Kenya)";
    LanguageName["SYR"] = "Syriac";
    LanguageName["SYR_SY"] = "Syriac (Syria)";
    LanguageName["TA"] = "Tamil";
    LanguageName["TA_IN"] = "Tamil (India)";
    LanguageName["TE"] = "Telugu";
    LanguageName["TE_IN"] = "Telugu (India)";
    LanguageName["TH"] = "Thai";
    LanguageName["TH_TH"] = "Thai (Thailand)";
    LanguageName["TL"] = "Tagalog";
    LanguageName["TL_PH"] = "Tagalog (Philippines)";
    LanguageName["TN"] = "Tswana";
    LanguageName["TN_ZA"] = "Tswana (South Africa)";
    LanguageName["TR"] = "Turkish";
    LanguageName["TR_TR"] = "Turkish (Turkey)";
    LanguageName["TT"] = "Tatar";
    LanguageName["TT_RU"] = "Tatar (Russia)";
    LanguageName["TS"] = "Tsonga";
    LanguageName["UK"] = "Ukrainian";
    LanguageName["UK_UA"] = "Ukrainian (Ukraine)";
    LanguageName["UR"] = "Urdu";
    LanguageName["UR_PK"] = "Urdu (Islamic Republic of Pakistan)";
    LanguageName["UZ"] = "Uzbek (Latin)";
    LanguageName["UZ_UZ"] = "Uzbek (Latin) (Uzbekistan)";
    LanguageName["UZ_CYRL_UZ"] = "Uzbek (Cyrillic) (Uzbekistan)";
    LanguageName["VI"] = "Vietnamese";
    LanguageName["VI_VN"] = "Vietnamese (Viet Nam)";
    LanguageName["XH"] = "Xhosa";
    LanguageName["XH_ZA"] = "Xhosa (South Africa)";
    LanguageName["ZH"] = "Chinese";
    LanguageName["ZH_CN"] = "Chinese (S)";
    LanguageName["ZH_HK"] = "Chinese (Hong Kong)";
    LanguageName["ZH_MO"] = "Chinese (Macau)";
    LanguageName["ZH_SG"] = "Chinese (Singapore)";
    LanguageName["ZH_TW"] = "Chinese (T)";
    LanguageName["ZU"] = "Zulu";
    LanguageName["ZU_ZA"] = "Zulu (South Africa)";
})(LanguageName = exports.LanguageName || (exports.LanguageName = {}));


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.MaturityLevelBit = void 0;
var MaturityLevelBit;
(function (MaturityLevelBit) {
    MaturityLevelBit[MaturityLevelBit["COMPUTERIZATION"] = 1] = "COMPUTERIZATION";
    MaturityLevelBit[MaturityLevelBit["CONNECTIVITY"] = 2] = "CONNECTIVITY";
    MaturityLevelBit[MaturityLevelBit["VISIBILITY"] = 4] = "VISIBILITY";
    MaturityLevelBit[MaturityLevelBit["TRANSPARENCY"] = 8] = "TRANSPARENCY";
    MaturityLevelBit[MaturityLevelBit["PREDICTABILITY"] = 16] = "PREDICTABILITY";
    MaturityLevelBit[MaturityLevelBit["ADAPTABILITY"] = 32] = "ADAPTABILITY";
})(MaturityLevelBit = exports.MaturityLevelBit || (exports.MaturityLevelBit = {}));


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.MaturityLevelName = void 0;
var MaturityLevelName;
(function (MaturityLevelName) {
    MaturityLevelName["COMPUTERIZATION"] = "COMPUTERIZATION";
    MaturityLevelName["CONNECTIVITY"] = "CONNECTIVITY";
    MaturityLevelName["VISIBILITY"] = "VISIBILITY";
    MaturityLevelName["TRANSPARENCY"] = "TRANSPARENCY";
    MaturityLevelName["PREDICTABILITY"] = "PREDICTABILITY";
    MaturityLevelName["ADAPTABILITY"] = "ADAPTABILITY";
    MaturityLevelName["NOT_APPLICABLE"] = "NOT_APPLICABLE";
})(MaturityLevelName = exports.MaturityLevelName || (exports.MaturityLevelName = {}));


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.MaturityLevelValue = void 0;
var MaturityLevelValue;
(function (MaturityLevelValue) {
    MaturityLevelValue[MaturityLevelValue["COMPUTERIZATION"] = 1] = "COMPUTERIZATION";
    MaturityLevelValue[MaturityLevelValue["CONNECTIVITY"] = 2] = "CONNECTIVITY";
    MaturityLevelValue[MaturityLevelValue["VISIBILITY"] = 3] = "VISIBILITY";
    MaturityLevelValue[MaturityLevelValue["TRANSPARENCY"] = 4] = "TRANSPARENCY";
    MaturityLevelValue[MaturityLevelValue["PREDICTABILITY"] = 5] = "PREDICTABILITY";
    MaturityLevelValue[MaturityLevelValue["ADAPTABILITY"] = 6] = "ADAPTABILITY";
    MaturityLevelValue[MaturityLevelValue["NOT_APPLICABLE"] = -1] = "NOT_APPLICABLE";
})(MaturityLevelValue = exports.MaturityLevelValue || (exports.MaturityLevelValue = {}));


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Operation = void 0;
var Operation;
(function (Operation) {
    Operation["CREATE"] = "CREATE";
    Operation["UPDATE"] = "UPDATE";
    Operation["DELETE"] = "DELETE";
})(Operation = exports.Operation || (exports.Operation = {}));


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionEntityMetadatumType = void 0;
var QuestionEntityMetadatumType;
(function (QuestionEntityMetadatumType) {
    QuestionEntityMetadatumType["MAIN_PROCESS"] = "MAIN_PROCESS";
    QuestionEntityMetadatumType["CAPABILITY"] = "CAPABILITY";
    QuestionEntityMetadatumType["STRUCTURING_FORCE"] = "STRUCTURING_FORCE";
    QuestionEntityMetadatumType["PRINCIPLE"] = "PRINCIPLE";
    QuestionEntityMetadatumType["PROCESS_OWNER"] = "PROCESS_OWNER";
})(QuestionEntityMetadatumType = exports.QuestionEntityMetadatumType || (exports.QuestionEntityMetadatumType = {}));


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionEntityUpdateType = void 0;
var QuestionEntityUpdateType;
(function (QuestionEntityUpdateType) {
    QuestionEntityUpdateType["MAJOR"] = "MAJOR";
    QuestionEntityUpdateType["MINOR"] = "MINOR";
    QuestionEntityUpdateType["CORRECTION"] = "CORRECTION";
})(QuestionEntityUpdateType = exports.QuestionEntityUpdateType || (exports.QuestionEntityUpdateType = {}));


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
var Role;
(function (Role) {
    Role["ADMIN"] = "ADMIN";
    Role["ACCOUNTING"] = "ACCOUNTING";
    Role["ANALYST"] = "ANALYST";
    Role["EDITOR"] = "EDITOR";
})(Role = exports.Role || (exports.Role = {}));


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplyChainPosition = void 0;
var SupplyChainPosition;
(function (SupplyChainPosition) {
    SupplyChainPosition["OEM"] = "OEM";
    SupplyChainPosition["TIER1"] = "TIER1";
    SupplyChainPosition["TIER2"] = "TIER2";
    SupplyChainPosition["TIER3PLUS"] = "TIER3PLUS";
    SupplyChainPosition["OTHERS"] = "OTHERS";
})(SupplyChainPosition = exports.SupplyChainPosition || (exports.SupplyChainPosition = {}));


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(0);
tslib_1.__exportStar(__webpack_require__(56), exports);
tslib_1.__exportStar(__webpack_require__(57), exports);


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.patchOptions = exports.DefaultOptions = void 0;
const object_helper_1 = __webpack_require__(11);
const defaultOptionsIdSymbol = Symbol('defaultOptionsId');
const defaultOptionsSymbol = Symbol('defaultOptions');
/**
 * Default options decorator
 *
 * Allow provision of partial option object. Any missing properties will be populated by the value
 * of defaultOptions
 */
const DefaultOptions = (defaultOptions, optionsId) => {
    return (target, propertyKey, descriptor) => {
        optionsId = optionsId || defaultOptionsIdSymbol;
        descriptor.value[defaultOptionsSymbol] = descriptor.value[defaultOptionsSymbol] || {};
        descriptor.value[defaultOptionsSymbol][optionsId] = defaultOptions;
        return descriptor;
    };
};
exports.DefaultOptions = DefaultOptions;
/**
 * Merges options populated by DefaultOption decorator and the options provided via parameter
 */
function patchOptions(func, options, optionsId) {
    var _a;
    optionsId = optionsId || defaultOptionsIdSymbol;
    const defaultOptions = (_a = func[defaultOptionsSymbol]) === null || _a === void 0 ? void 0 : _a[optionsId];
    if (object_helper_1.isObject(defaultOptions)) {
        const defaultCopy = object_helper_1.deepCopy(defaultOptions);
        if (object_helper_1.isObject(options)) {
            object_helper_1.mergeObjects(defaultCopy, options);
        }
        return defaultCopy;
    }
    return object_helper_1.isObject(options) ? object_helper_1.deepCopy(options) : {};
}
exports.patchOptions = patchOptions;


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ReturnsNullInsteadOfEmptyArray = void 0;
const ReturnsNullInsteadOfEmptyArray = () => {
    return function (target, propertyKey, descriptor) {
        const originalFn = descriptor.value;
        descriptor.value = async function (...args) {
            const result = await originalFn.apply(this, args);
            return result.length === 0 ? null : result;
        };
        return descriptor;
    };
};
exports.ReturnsNullInsteadOfEmptyArray = ReturnsNullInsteadOfEmptyArray;


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(0);
tslib_1.__exportStar(__webpack_require__(59), exports);
tslib_1.__exportStar(__webpack_require__(60), exports);
tslib_1.__exportStar(__webpack_require__(61), exports);


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.AggregatedException = void 0;
/**
 * Aggregated Exception
 *
 * Contains a collection of errors
 *
 */
class AggregatedException extends Error {
    constructor(errors, message) {
        super(message);
        this.errors = errors;
        this.name = 'AggregatedException';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.AggregatedException = AggregatedException;


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.CorruptStateException = void 0;
class CorruptStateException extends Error {
    constructor(message) {
        super(message);
        this.name = 'CorruptStateException';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.CorruptStateException = CorruptStateException;


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.UnionMappingException = void 0;
class UnionMappingException extends Error {
    constructor(message) {
        super(message);
        this.name = 'UnionMappingException';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.UnionMappingException = UnionMappingException;


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(0);
tslib_1.__exportStar(__webpack_require__(63), exports);
tslib_1.__exportStar(__webpack_require__(64), exports);
tslib_1.__exportStar(__webpack_require__(65), exports);
tslib_1.__exportStar(__webpack_require__(66), exports);
tslib_1.__exportStar(__webpack_require__(67), exports);
tslib_1.__exportStar(__webpack_require__(11), exports);
tslib_1.__exportStar(__webpack_require__(68), exports);
tslib_1.__exportStar(__webpack_require__(69), exports);
tslib_1.__exportStar(__webpack_require__(70), exports);
tslib_1.__exportStar(__webpack_require__(71), exports);
tslib_1.__exportStar(__webpack_require__(72), exports);
tslib_1.__exportStar(__webpack_require__(74), exports);
tslib_1.__exportStar(__webpack_require__(75), exports);
tslib_1.__exportStar(__webpack_require__(76), exports);
tslib_1.__exportStar(__webpack_require__(77), exports);


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.augmentsBatchFunctionCall = void 0;
/**
 * augmentsBatchFunctionCall
 *
 * Augments batch function call to return faux data from an alternative datasource when provided
 *
 * @param keys keys
 * @param keysSanitizerFn filter function that will be applied to the keys before being passed into the batch function
 * @param batchFn batch function that receives keys as an array and returns the corresponding data in the same order
 * @param alternativeDatasource alternative datasource as dictionary with value of type T. Value found in the alternative datasource will take precedence over the value returned by the batch function.
 */
async function augmentsBatchFunctionCall(keys, keysSanitizerFn, batchFn, alternativeDatasource = {}) {
    const sanitizedIdsIndexDict = {};
    const sanitizedIds = [];
    for (const id of keys) {
        if (keysSanitizerFn(id)) {
            sanitizedIdsIndexDict[id] = sanitizedIds.push(id) - 1;
        }
    }
    const batchFnRes = await batchFn(sanitizedIds);
    return keys.map(id => {
        if (alternativeDatasource[id] !== undefined) {
            return alternativeDatasource[id];
        }
        return isNaN(sanitizedIdsIndexDict[id]) ? null : batchFnRes[sanitizedIdsIndexDict[id]];
    });
}
exports.augmentsBatchFunctionCall = augmentsBatchFunctionCall;


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getYearDiff = void 0;
function getYearDiff(dateA, dateB) {
    const ageDiffInMs = Math.abs(dateA.getTime() - dateB.getTime());
    const ageDiff = new Date(ageDiffInMs);
    return Math.abs(ageDiff.getUTCFullYear() - 1970);
}
exports.getYearDiff = getYearDiff;


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnumKeyByValue = exports.getEnumValues = exports.getEnumKeys = void 0;
function getEnumKeys(enumObject) {
    return Object.keys(enumObject).filter(key => isNaN(parseInt(key, 10)));
}
exports.getEnumKeys = getEnumKeys;
function getEnumValues(enumObject) {
    return getEnumKeys(enumObject).map(key => enumObject[key]);
}
exports.getEnumValues = getEnumValues;
function getEnumKeyByValue(enumObject, enumValue) {
    const key = Object.keys(enumObject).find(x => enumObject[x] === enumValue);
    return key !== null && key !== void 0 ? key : null;
}
exports.getEnumKeyByValue = getEnumKeyByValue;


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Json = void 0;
exports.Json = {
    stringify(o, space) {
        const visited = [];
        return JSON.stringify(o, (k, v) => {
            if (typeof v === 'object') {
                if (!visited.indexOf(v)) {
                    return '__cycle_' + typeof v + '__';
                }
                visited.push(v);
            }
            return v;
        }, space);
    },
};


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isBetween = exports.getRandomInt = exports.modulo = void 0;
function modulo(x, y) {
    return ((x % y) + y) % y;
}
exports.modulo = modulo;
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
exports.getRandomInt = getRandomInt;
/**
 *
 * @param num the number to check
 * @param min including
 * @param max including
 */
function isBetween(num, min, max) {
    return num >= min && num <= max;
}
exports.isBetween = isBetween;
function isNumeric(str) {
    if (typeof str === 'number') {
        return true;
    }
    else if (typeof str !== 'string') {
        return false;
    }
    return !isNaN(parseFloat(str));
}


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.polymorphicKeyFnLoader = void 0;
/**
 * Batch Function Wrapper [WIP]
 *
 * Wrapper to mux and demux several polymorphic keys together as a single argument through a batch function
 *
 * @param keys dataloader keys
 * @param keyLookupPropName property name on the key object used as the lookup id
 * @param batchFn batch function to fetch the data
 * @param mapFn mapping function for data returned from the batch function
 * @param errorOrNullMapFn mapping function for error or null data returned from the batch function
 */
async function polymorphicKeyFnLoader(keys, keyLookupPropName, batchFn, mapFn, errorOrNullMapFn) {
    const ids = [];
    const indexDict = {};
    for (const key of keys) {
        const lookupId = key[keyLookupPropName];
        if (typeof lookupId !== 'string') {
            throw new Error('Lookup ID must be of type string or number');
        }
        const idx = ids.indexOf(lookupId);
        if (idx === -1) {
            ids.push(lookupId);
            indexDict[lookupId] = ids.length - 1;
        }
        else {
            indexDict[lookupId] = idx;
        }
    }
    const dataArray = await batchFn(ids);
    return keys.map(key => {
        const data = dataArray[indexDict[key[keyLookupPropName]]];
        if (data instanceof Error || data == null) {
            return errorOrNullMapFn ? errorOrNullMapFn(key, data) : data;
        }
        return mapFn(key, data);
    });
}
exports.polymorphicKeyFnLoader = polymorphicKeyFnLoader;


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.createQueryablePromise = exports.wait = exports.mapAsync = exports.createDeferredPromise = void 0;
/**
 * @DEPRECATED
 * Creates a promise that can be resolved/rejected from outside the promise
 */
function createDeferredPromise(executor) {
    let _resolve = null;
    let _reject = null;
    let resolved = false;
    let rejected = false;
    const promise = new Promise((resolve, reject) => {
        _resolve = resolve;
        _reject = reject;
        if (executor) {
            executor(resolve, reject);
        }
    });
    promise.resolve = (value) => {
        _resolve(value);
        resolved = true;
    };
    promise.reject = (reason) => {
        _reject(reason);
        rejected = true;
    };
    promise.isResolved = () => resolved;
    promise.isRejected = () => rejected;
    promise.hasFinished = () => rejected || resolved;
    return promise;
}
exports.createDeferredPromise = createDeferredPromise;
function mapAsync(args, mapper) {
    return Promise.all(args.map(mapper));
}
exports.mapAsync = mapAsync;
async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
exports.wait = wait;
/**
 * Creates a promise which has a state that can be checked synchronously
 */
function createQueryablePromise(executorFn) {
    const promise = new Promise((resolve, reject) => {
        executorFn(resolve, reject);
    });
    promise.state = 'PENDING';
    promise.then(() => {
        promise.state = 'FULFILLED';
    });
    promise.catch(() => {
        promise.state = 'REJECTED';
    });
    return promise;
}
exports.createQueryablePromise = createQueryablePromise;


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.queryData = void 0;
const lodash_1 = __webpack_require__(3);
const operators_1 = __webpack_require__(23);
function queryData(query, cloneResult = true, thisArg) {
    return operators_1.map((queryResult) => {
        var _a;
        let result = (_a = queryResult.data) === null || _a === void 0 ? void 0 : _a[query];
        if (cloneResult) {
            result = lodash_1.cloneDeep(result);
        }
        return result;
    }, thisArg);
}
exports.queryData = queryData;


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.retry = void 0;
async function retry(fn, retries = 5, intervalInMs = 1000, exponential = false) {
    try {
        return await fn();
    }
    catch (error) {
        if (retries-- <= 0) {
            throw error;
        }
        await new Promise(resolve => setTimeout(resolve, intervalInMs));
        return retry(fn, retries, exponential ? intervalInMs * 2 : intervalInMs, exponential);
    }
}
exports.retry = retry;


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.tapOnce = exports.doOnSubscribe = exports.mapLatestFrom = exports.skipWhileActive = exports.takeWhileActive = exports.switchFilterMap = exports.filterArray = exports.mapArray = exports.isIn = exports.equals = exports.filterNil = exports.ofFunction = exports.debug = void 0;
const rxjs_1 = __webpack_require__(73);
const operators_1 = __webpack_require__(23);
function debug(tag) {
    return operators_1.tap({
        next(value) {
            console.log(`%c[${tag}: Next]`, 'background: #009688; color: #fff; padding: 3px; font-size: 9px;', value);
        },
        error(error) {
            console.log(`%c[${tag}: Error]`, 'background: #E91E63; color: #fff; padding: 3px; font-size: 9px;', error);
        },
        complete() {
            console.log(`%c[${tag}: Complete]`, 'background: #00BCD4; color: #fff; padding: 3px; font-size: 9px;');
        },
    });
}
exports.debug = debug;
function ofFunction(func) {
    return rxjs_1.of(null).pipe(operators_1.map(func));
}
exports.ofFunction = ofFunction;
function filterNil() {
    return operators_1.filter(value => value !== undefined && value !== null);
}
exports.filterNil = filterNil;
function equals(v1, strict = true) {
    return operators_1.map((v2) => {
        return strict ? v1 === v2 : v1 == v2;
    });
}
exports.equals = equals;
function isIn(...v1) {
    return operators_1.map((v2) => {
        return v1.indexOf(v2) !== -1;
    });
}
exports.isIn = isIn;
function mapArray(callbackfn, thisArg) {
    return operators_1.map((value) => value.map(callbackfn, thisArg));
}
exports.mapArray = mapArray;
function filterArray(predicate, thisArg) {
    return operators_1.map((value) => value.filter(predicate, thisArg));
}
exports.filterArray = filterArray;
function switchFilterMap(filterPredicate, project) {
    return (input) => {
        return new rxjs_1.Observable(subscriber => {
            let count = 0;
            let innerSubscribtion = rxjs_1.Subscription.EMPTY;
            input.subscribe({
                next(value) {
                    innerSubscribtion.unsubscribe();
                    if (filterPredicate(value, count++)) {
                        innerSubscribtion = rxjs_1.from(project(value, count))
                            .subscribe({
                            next(value) {
                                subscriber.next(value);
                            },
                            error(error) {
                                subscriber.error(error);
                            },
                            complete() {
                                subscriber.complete();
                            },
                        });
                    }
                },
                error(error) {
                    subscriber.error(error);
                },
                complete() {
                    innerSubscribtion.unsubscribe();
                    subscriber.complete();
                },
            });
        });
    };
}
exports.switchFilterMap = switchFilterMap;
function takeWhileActive(filterObservable) {
    return (input) => {
        return input.pipe(operators_1.withLatestFrom(filterObservable), operators_1.filter(([, isActive]) => !!isActive), operators_1.map(([value]) => value));
    };
}
exports.takeWhileActive = takeWhileActive;
function skipWhileActive(filterObservable) {
    return (input) => {
        return input.pipe(operators_1.withLatestFrom(filterObservable), operators_1.filter(([, isActive]) => !isActive), operators_1.map(([value]) => value));
    };
}
exports.skipWhileActive = skipWhileActive;
function mapLatestFrom(project) {
    return (input) => {
        return input.pipe(operators_1.withLatestFrom(project), operators_1.map(([, value]) => value));
    };
}
exports.mapLatestFrom = mapLatestFrom;
function doOnSubscribe(onSubscribe) {
    return function inner(source) {
        return rxjs_1.defer(() => {
            onSubscribe();
            return source;
        });
    };
}
exports.doOnSubscribe = doOnSubscribe;
function tapOnce(callback) {
    return (source) => rxjs_1.of({}).pipe(operators_1.tap(callback), operators_1.switchMap(() => source));
}
exports.tapOnce = tapOnce;


/***/ }),
/* 73 */
/***/ (function(module, exports) {

module.exports = require("rxjs");

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = void 0;
async function sleep(timeInMs) {
    return new Promise(res => setTimeout(res, timeInMs));
}
exports.sleep = sleep;


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.sortTopLevelRecordKeys = void 0;
function sortTopLevelRecordKeys(record) {
    return Object.keys(record)
        .sort()
        .reduce((acc, key) => ({
        ...acc,
        [key]: record[key],
    }), {});
}
exports.sortTopLevelRecordKeys = sortTopLevelRecordKeys;


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.stringEmpty = exports.generateRandomString = exports.hashCode = exports.toSnakeCase = void 0;
const object_helper_1 = __webpack_require__(11);
function toSnakeCase(text) {
    return text.replace(/(.+?)([A-Z])/gm, '$1_$2').toLowerCase();
}
exports.toSnakeCase = toSnakeCase;
function hashCode(string) {
    let hash = 0;
    let i = 0;
    const len = string.length;
    while (i < len) {
        hash = ((hash << 5) - hash + string.charCodeAt(i++)) << 0;
    }
    return hash;
}
exports.hashCode = hashCode;
function generateRandomString(length, symbols = false) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' + (symbols ? '#+%$!&?' : '');
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
exports.generateRandomString = generateRandomString;
function stringEmpty(str) {
    return object_helper_1.isNil(str) || str === '';
}
exports.stringEmpty = stringEmpty;


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.uuidv4 = exports.generateUuidV4 = void 0;
const uuid_1 = __webpack_require__(78);
Object.defineProperty(exports, "uuidv4", { enumerable: true, get: function () { return uuid_1.v4; } });
/**
 * Generate UUID v4
 */
function generateUuidV4() {
    return uuid_1.v4();
}
exports.generateUuidV4 = generateUuidV4;


/***/ }),
/* 78 */
/***/ (function(module, exports) {

module.exports = require("uuid");

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(0);
tslib_1.__exportStar(__webpack_require__(80), exports);
tslib_1.__exportStar(__webpack_require__(81), exports);
tslib_1.__exportStar(__webpack_require__(82), exports);
tslib_1.__exportStar(__webpack_require__(83), exports);
tslib_1.__exportStar(__webpack_require__(84), exports);
tslib_1.__exportStar(__webpack_require__(85), exports);
tslib_1.__exportStar(__webpack_require__(86), exports);
tslib_1.__exportStar(__webpack_require__(87), exports);


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Principle = void 0;
const i40mi_principle_enum_1 = __webpack_require__(21);
const smi_principle_enum_1 = __webpack_require__(22);
exports.Principle = { ...i40mi_principle_enum_1.I40MIPrinciple, ...smi_principle_enum_1.SMIPrinciple };


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieveSecret = void 0;
const config_1 = __webpack_require__(9);
const cast_helper_1 = __webpack_require__(19);
function retrieveSecret(key, opts) {
    if (!(opts === null || opts === void 0 ? void 0 : opts.optional) && !config_1.config.requiredSecrets.includes(key)) {
        config_1.config.requiredSecrets.push(key);
    }
    return async () => {
        // TODO: cast secret based on its contentType
        let secret;
        if (false) {}
        else {
            secret = process.env[key];
        }
        if (!(opts === null || opts === void 0 ? void 0 : opts.optional)) {
            if (secret === undefined) {
                throw new Error(`Failed retrieving secret: ${key}`);
            }
        }
        return cast_helper_1.cast(secret, opts === null || opts === void 0 ? void 0 : opts.castTo);
    };
}
exports.retrieveSecret = retrieveSecret;


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(0);
tslib_1.__exportStar(__webpack_require__(91), exports);


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfigPresetProd = exports.AppConfigPresetStaging = exports.AppConfigPresetDev = void 0;
exports.AppConfigPresetDev = {
    env: 'development',
    debug: true,
    apiBaseUrl: 'http://api.localhost/',
};
exports.AppConfigPresetStaging = {
    env: 'staging',
    debug: true,
    port: 4000,
    apiBaseUrl: 'https://api.app.x.i40mc.de/',
};
exports.AppConfigPresetProd = {
    env: 'production',
    debug: false,
    port: 4000,
    apiBaseUrl: 'https://api.app.i40mc.de/',
};


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFIG = void 0;
const config_1 = __webpack_require__(2);
const redis_1 = __webpack_require__(12);
const environment_1 = __webpack_require__(99);
const app_version_1 = __webpack_require__(100);
exports.CONFIG = {
    ...environment_1.environment,
    id: 'doghouse',
    version: app_version_1.APP_VERSION,
    port: 4099,
    secretKeys: config_1.retrieveSecret('doghouse-secret-keys'),
    redis: {
        ...redis_1.RedisConfigPreset,
    },
    sandboxDir: (_a = config_1.retrieveEnv('SANDBOX_DIR', {
        optional: true,
    })) !== null && _a !== void 0 ? _a : '/tmp/sandbox',
    // TODO: load as secret!
    githubToken: config_1.retrieveSecret('github-token'),
};


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var RedisModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisModule = void 0;
const tslib_1 = __webpack_require__(0);
const common_1 = __webpack_require__(1);
const lodash_1 = __webpack_require__(3);
const constants_1 = __webpack_require__(13);
const create_redis_client_provider_1 = __webpack_require__(94);
const redis_client_helper_services_1 = __webpack_require__(24);
let RedisModule = RedisModule_1 = class RedisModule {
    static forRoot(options) {
        options = lodash_1.merge(constants_1.DEFAULT_REDIS_MODULE_OPTS, options);
        if (options.serviceId == null) {
            throw new Error('Invalid RedisModuleOptions provided');
        }
        options.redis.connectionName = options.serviceId + options.connectionNamePostfix;
        if (options.redis.keyPrefix == null) {
            options.redis.keyPrefix = options.serviceId + ':';
        }
        return {
            module: RedisModule_1,
            providers: [
                {
                    provide: constants_1.REDIS_MODULE_OPTIONS,
                    useValue: options,
                },
            ],
            exports: [constants_1.REDIS_MODULE_OPTIONS],
        };
    }
};
RedisModule = RedisModule_1 = tslib_1.__decorate([
    common_1.Global(),
    common_1.Module({
        providers: [
            {
                provide: constants_1.REDIS_CLIENT,
                inject: [constants_1.REDIS_MODULE_OPTIONS],
                useFactory: create_redis_client_provider_1.createRedisClientProvider,
            },
            redis_client_helper_services_1.RedisClientHelperService,
        ],
        exports: [
            constants_1.REDIS_CLIENT,
            redis_client_helper_services_1.RedisClientHelperService,
        ],
    })
], RedisModule);
exports.RedisModule = RedisModule;


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.createRedisClientProvider = void 0;
const Redis = __webpack_require__(14);
function createRedisClientProvider({ redis: options }) {
    return new Redis(options);
}
exports.createRedisClientProvider = createRedisClientProvider;


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisConfigPreset = void 0;
const config_1 = __webpack_require__(2);
exports.RedisConfigPreset = {
    host: config_1.retrieveEnv('REDIS_HOST'),
    port: (_a = config_1.retrieveEnv('REDIS_PORT', { castTo: 'number' })) !== null && _a !== void 0 ? _a : 6379,
};


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = void 0;
const config_1 = __webpack_require__(2);
exports.environment = {
    ...config_1.AppConfigPresetStaging,
    k8sClusterConfig: config_1.retrieveSecret('k8s-ci-experimental-i40mc-de'),
};


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.APP_VERSION = void 0;
exports.APP_VERSION = 'DEV';


/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __webpack_require__(2);
const common_1 = __webpack_require__(1);
const core_1 = __webpack_require__(102);
const debug_1 = __webpack_require__(103);
__webpack_require__(104);
const path_1 = __webpack_require__(15);
const app_module_1 = __webpack_require__(105);
const globalMiddlewares = [];
const globalPipes = [
    new common_1.ValidationPipe({
        always: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }),
];
const enabledDebugOutputs = [
    config_1.config.data().id,
];
async function bootstrap() {
    debug_1.enable(enabledDebugOutputs.join(','));
    const debug = debug_1.debug(config_1.config.data().id);
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.disable('x-powered-by');
    app.enableCors();
    // register global middlewares
    if (globalMiddlewares.length > 0) {
        app.use(globalMiddlewares);
    }
    // register global pipes
    for (const globalPipe of globalPipes) {
        app.useGlobalPipes(globalPipe);
    }
    app.useStaticAssets(path_1.join(__dirname, 'assets'));
    await app.listen(config_1.config.data().port).catch(err => debug(err));
    common_1.Logger.log(`${config_1.config.data().id} listening at port: ${config_1.config.data().port}`);
}
void bootstrap();


/***/ }),
/* 102 */
/***/ (function(module, exports) {

module.exports = require("@nestjs/core");

/***/ }),
/* 103 */
/***/ (function(module, exports) {

module.exports = require("debug");

/***/ }),
/* 104 */
/***/ (function(module, exports) {

module.exports = require("hbs");

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const tslib_1 = __webpack_require__(0);
const common_1 = __webpack_require__(1);
const schedule_1 = __webpack_require__(25);
const app_controller_1 = __webpack_require__(106);
const auth_module_1 = __webpack_require__(107);
const health_module_1 = __webpack_require__(109);
const release_manager_module_1 = __webpack_require__(26);
let AppModule = class AppModule {
};
AppModule = tslib_1.__decorate([
    common_1.Module({
        imports: [
            schedule_1.ScheduleModule.forRoot(),
            auth_module_1.AuthModule,
            health_module_1.HealthModule,
            release_manager_module_1.ReleaseManagerModule,
        ],
        controllers: [
            app_controller_1.AppController,
        ],
        providers: [],
    })
], AppModule);
exports.AppModule = AppModule;


/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const tslib_1 = __webpack_require__(0);
const common_1 = __webpack_require__(1);
let AppController = class AppController {
    getStatus() {
        return {
            status: 'OK!',
        };
    }
};
tslib_1.__decorate([
    common_1.Get(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], AppController.prototype, "getStatus", null);
AppController = tslib_1.__decorate([
    common_1.Controller()
], AppController);
exports.AppController = AppController;


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const tslib_1 = __webpack_require__(0);
const common_1 = __webpack_require__(1);
const api_key_guard_1 = __webpack_require__(16);
const services_1 = __webpack_require__(108);
const api_key_service_1 = __webpack_require__(17);
let AuthModule = class AuthModule {
};
AuthModule = tslib_1.__decorate([
    common_1.Global(),
    common_1.Module({
        providers: [
            ...services_1.SERVICES,
            api_key_guard_1.APIKeyGuard,
        ],
        exports: [
            api_key_guard_1.APIKeyGuard,
            api_key_service_1.APIKeyService,
        ],
    })
], AuthModule);
exports.AuthModule = AuthModule;


/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SERVICES = void 0;
const api_key_service_1 = __webpack_require__(17);
exports.SERVICES = [
    api_key_service_1.APIKeyService,
];


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthModule = void 0;
const tslib_1 = __webpack_require__(0);
const common_1 = __webpack_require__(1);
const release_manager_module_1 = __webpack_require__(26);
const controllers_1 = __webpack_require__(133);
const services_1 = __webpack_require__(136);
const system_health_service_1 = __webpack_require__(18);
let HealthModule = class HealthModule {
};
HealthModule = tslib_1.__decorate([
    common_1.Module({
        imports: [
            release_manager_module_1.ReleaseManagerModule,
        ],
        controllers: [
            ...controllers_1.CONTROLLERS,
        ],
        providers: [
            ...services_1.SERVICES,
        ],
        exports: [
            system_health_service_1.SystemHealthService,
        ],
    })
], HealthModule);
exports.HealthModule = HealthModule;


/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.CONTROLLERS = void 0;
const scheduled_release_controller_1 = __webpack_require__(111);
exports.CONTROLLERS = [
    scheduled_release_controller_1.ScheduledReleaseController,
];


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduledReleaseController = void 0;
const tslib_1 = __webpack_require__(0);
const common_1 = __webpack_require__(1);
const api_key_guard_1 = __webpack_require__(16);
const release_instruction_input_dto_1 = __webpack_require__(27);
const release_manager_service_1 = __webpack_require__(4);
// TODO: refactor route namespace to AppModule using RouterModule available in Nest v8
let ScheduledReleaseController = class ScheduledReleaseController {
    constructor(releaseManagerService) {
        this.releaseManagerService = releaseManagerService;
    }
    async getUpcomingRelease() {
        return this.releaseManagerService.getUpcomingRelease();
    }
    planUpcomingRelease(input) {
        return this.releaseManagerService.planUpcomingRelease(input);
    }
};
tslib_1.__decorate([
    common_1.Get(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ScheduledReleaseController.prototype, "getUpcomingRelease", null);
tslib_1.__decorate([
    common_1.Post(),
    common_1.UseGuards(api_key_guard_1.APIKeyGuard),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof release_instruction_input_dto_1.ReleaseInstructionInputDTO !== "undefined" && release_instruction_input_dto_1.ReleaseInstructionInputDTO) === "function" ? _a : Object]),
    tslib_1.__metadata("design:returntype", void 0)
], ScheduledReleaseController.prototype, "planUpcomingRelease", null);
ScheduledReleaseController = tslib_1.__decorate([
    common_1.Controller('scheduled-release'),
    tslib_1.__metadata("design:paramtypes", [typeof (_b = typeof release_manager_service_1.ReleaseManagerService !== "undefined" && release_manager_service_1.ReleaseManagerService) === "function" ? _b : Object])
], ScheduledReleaseController);
exports.ScheduledReleaseController = ScheduledReleaseController;


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(0);
tslib_1.__exportStar(__webpack_require__(113), exports);
tslib_1.__exportStar(__webpack_require__(114), exports);
tslib_1.__exportStar(__webpack_require__(115), exports);
tslib_1.__exportStar(__webpack_require__(116), exports);


/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ReleaseInstructionStatus = void 0;
var ReleaseInstructionStatus;
(function (ReleaseInstructionStatus) {
    ReleaseInstructionStatus["PENDING"] = "PENDING";
    ReleaseInstructionStatus["STALLED"] = "STALLED";
    ReleaseInstructionStatus["RELEASE_IN_PROGRESS"] = "RELEASE_IN_PROGRESS";
    ReleaseInstructionStatus["FAILED"] = "FAILED";
    ReleaseInstructionStatus["SUCCEEDED"] = "SUCCEEDED";
})(ReleaseInstructionStatus = exports.ReleaseInstructionStatus || (exports.ReleaseInstructionStatus = {}));


/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ReleaseType = void 0;
var ReleaseType;
(function (ReleaseType) {
    ReleaseType["MAJOR"] = "MAJOR";
    ReleaseType["MINOR"] = "MINOR";
    ReleaseType["PATCH"] = "PATCH";
})(ReleaseType = exports.ReleaseType || (exports.ReleaseType = {}));


/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceStatus = void 0;
var ServiceStatus;
(function (ServiceStatus) {
    ServiceStatus["OPERATIONAL"] = "OPERATIONAL";
    ServiceStatus["DEGRADATION"] = "DEGRADATION";
    ServiceStatus["DOWN"] = "DOWN";
})(ServiceStatus = exports.ServiceStatus || (exports.ServiceStatus = {}));


/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemStatus = void 0;
var SystemStatus;
(function (SystemStatus) {
    SystemStatus["FULLY_OPERATIONAL"] = "FULLY_OPERATIONAL";
    SystemStatus["PARTIAL_DISRUPTION"] = "PARTIAL_DISRUPTION";
    SystemStatus["MAJOR_DISRUPTION"] = "MAJOR_DISRUPTION";
})(SystemStatus = exports.SystemStatus || (exports.SystemStatus = {}));


/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(0);
tslib_1.__exportStar(__webpack_require__(118), exports);
tslib_1.__exportStar(__webpack_require__(119), exports);
tslib_1.__exportStar(__webpack_require__(120), exports);
tslib_1.__exportStar(__webpack_require__(121), exports);
tslib_1.__exportStar(__webpack_require__(122), exports);


/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });


/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });


/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });


/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });


/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });


/***/ }),
/* 123 */
/***/ (function(module, exports) {

module.exports = require("child_process");

/***/ }),
/* 124 */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),
/* 125 */
/***/ (function(module, exports) {

module.exports = require("fs-extra");

/***/ }),
/* 126 */
/***/ (function(module, exports) {

module.exports = require("nodegit");

/***/ }),
/* 127 */
/***/ (function(module, exports) {

module.exports = require("@kubernetes/client-node");

/***/ }),
/* 128 */
/***/ (function(module, exports) {

module.exports = require("fs/promises");

/***/ }),
/* 129 */
/***/ (function(module, exports) {

module.exports = require("js-yaml");

/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.IsCommitRef = void 0;
const class_validator_1 = __webpack_require__(6);
function IsCommitRef(validationOptions) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (object, propertyName) {
        class_validator_1.registerDecorator({
            name: 'IsCommitRef',
            target: object.constructor,
            propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value) {
                    return value === 'latest' || class_validator_1.isHash(value, 'sha1');
                },
            },
        });
    };
}
exports.IsCommitRef = IsCommitRef;


/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.IsSmallerThan = void 0;
const class_validator_1 = __webpack_require__(6);
function IsSmallerThan(fn, validationOptions) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (object, propertyName) {
        class_validator_1.registerDecorator({
            name: 'IsSmallerThan',
            target: object.constructor,
            propertyName,
            constraints: [fn],
            options: validationOptions,
            validator: {
                validate(value, args) {
                    const maxValue = args.constraints[0]();
                    if (typeof maxValue !== 'number') {
                        throw new Error('Invalid value provided for IsSmallerThan-validator');
                    }
                    return typeof value === 'number' && value < maxValue;
                },
            },
        });
    };
}
exports.IsSmallerThan = IsSmallerThan;


/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SERVICES = void 0;
const deploy_service_1 = __webpack_require__(7);
const git_service_1 = __webpack_require__(29);
const k8s_cluster_service_1 = __webpack_require__(30);
const release_manager_service_1 = __webpack_require__(4);
exports.SERVICES = [
    release_manager_service_1.ReleaseManagerService,
    k8s_cluster_service_1.K8sClusterService,
    git_service_1.GitService,
    deploy_service_1.DeployService,
];


/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.CONTROLLERS = void 0;
const health_controller_1 = __webpack_require__(134);
exports.CONTROLLERS = [
    health_controller_1.HealthController,
];


/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
const tslib_1 = __webpack_require__(0);
const common_1 = __webpack_require__(1);
const api_key_guard_1 = __webpack_require__(16);
const service_health_service_1 = __webpack_require__(8);
const system_health_service_1 = __webpack_require__(18);
let HealthController = class HealthController {
    constructor(systemHealthService, serviceHealthService) {
        this.systemHealthService = systemHealthService;
        this.serviceHealthService = serviceHealthService;
    }
    getSystemHealth() {
        return this.systemHealthService.getSystemHealth();
    }
    getServiceHealth() {
        return this.serviceHealthService.getAllServicesHealth();
    }
};
tslib_1.__decorate([
    common_1.Get('health'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], HealthController.prototype, "getSystemHealth", null);
tslib_1.__decorate([
    common_1.Get('service-status'),
    common_1.UseGuards(api_key_guard_1.APIKeyGuard),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], HealthController.prototype, "getServiceHealth", null);
HealthController = tslib_1.__decorate([
    common_1.Controller(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof system_health_service_1.SystemHealthService !== "undefined" && system_health_service_1.SystemHealthService) === "function" ? _a : Object, typeof (_b = typeof service_health_service_1.ServiceHealthService !== "undefined" && service_health_service_1.ServiceHealthService) === "function" ? _b : Object])
], HealthController);
exports.HealthController = HealthController;


/***/ }),
/* 135 */
/***/ (function(module, exports) {

module.exports = require("axios");

/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SERVICES = void 0;
const cron_service_1 = __webpack_require__(137);
const service_health_service_1 = __webpack_require__(8);
const system_health_service_1 = __webpack_require__(18);
exports.SERVICES = [
    cron_service_1.CronService,
    service_health_service_1.ServiceHealthService,
    system_health_service_1.SystemHealthService,
];


/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronService = void 0;
const tslib_1 = __webpack_require__(0);
const common_1 = __webpack_require__(1);
const schedule_1 = __webpack_require__(25);
const service_health_service_1 = __webpack_require__(8);
let CronService = class CronService {
    constructor(serviceStatusService) {
        this.serviceStatusService = serviceStatusService;
    }
    async heartbeatCheck() {
        await this.serviceStatusService.updateAllServicesHealth();
    }
};
tslib_1.__decorate([
    schedule_1.Cron('*/30 * * * * *', {
        name: 'heartbeatCheck',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], CronService.prototype, "heartbeatCheck", null);
CronService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof service_health_service_1.ServiceHealthService !== "undefined" && service_health_service_1.ServiceHealthService) === "function" ? _a : Object])
], CronService);
exports.CronService = CronService;


/***/ })
/******/ ])));
//# sourceMappingURL=main.js.map