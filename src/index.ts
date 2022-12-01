import { RequireAtLeastOne } from "type-fest";
import is from "@sindresorhus/is";
import chalk, { ChalkInstance } from "chalk";

const PREFIX = "scribe";

export enum LogLevels {
    None,
    Error,
    Warn,
    Info,
    Trace,
    Inspect,
    All,
}

type Log = {
    (...args: unknown[]): void;
    (prefix: string, ...args: unknown[]): void;
};

type UsableLogLevels = Exclude<LogLevels, LogLevels.All | LogLevels.None>;
type LogLevelsNameAndColorCollection = {
    [key in UsableLogLevels]: {
        name: string;
        color: string;
    };
};
type LogVariantsCollection = {
    [key in UsableLogLevels]: Log;
};

const disabledLog: Log = () => {};

type PrefixConstructor = (level: UsableLogLevels, text?: string) => string;

type BaseOptions = {
    level: LogLevels;
    pretty: boolean;
};

export type Options = RequireAtLeastOne<BaseOptions>;

export type ConfigurationOptions = RequireAtLeastOne<BaseOptions>;

const isNode = process?.versions?.node !== undefined;

export class Scribe {
    private _level: LogLevels;
    public get level() {
        return this._level;
    }
    private _pretty: boolean;
    public get pretty() {
        return this._pretty;
    }
    private _logLevelsNameAndColorCollection: LogLevelsNameAndColorCollection;
    private _logVariantsCollection: LogVariantsCollection;
    private _error: Log;
    public get error() {
        return this._error;
    }
    private _warn: Log;
    public get warn() {
        return this._warn;
    }
    private _info: Log;
    public get info() {
        return this._info;
    }
    private _trace: Log;
    public get trace() {
        return this._trace;
    }
    private _inspect: Log;
    public get inspect() {
        return this._inspect;
    }
    constructor(options?: Options) {
        const level = options?.level;
        this._level = is.undefined(level) ? LogLevels.Info : level;
        const pretty = options?.pretty;
        this._pretty = is.undefined(pretty) ? true : pretty;
        this._logLevelsNameAndColorCollection = {
            [LogLevels.Error]: {
                name: " ERR! ",
                color: "#F44336",
            },
            [LogLevels.Warn]: {
                name: " WARN ",
                color: "#FFA000",
            },
            [LogLevels.Info]: {
                name: " INFO ",
                color: "#4CAF50",
            },
            [LogLevels.Trace]: {
                name: " TRC* ",
                color: "#00BCD4",
            },
            [LogLevels.Inspect]: {
                name: " INS* ",
                color: "#9C27B0",
            },
        };
        this._logVariantsCollection = {
            [LogLevels.Error]: (...args: unknown[]) => this._scribe(LogLevels.Error, console.error, ...args),
            [LogLevels.Warn]: (...args: unknown[]) => this._scribe(LogLevels.Warn, console.warn, ...args),
            [LogLevels.Info]: (...args: unknown[]) => this._scribe(LogLevels.Info, console.info, ...args),
            [LogLevels.Trace]: (...args: unknown[]) => this._scribe(LogLevels.Trace, console.log, ...args),
            [LogLevels.Inspect]: (...args: unknown[]) => this._scribe(LogLevels.Inspect, console.log, ...args),
        };
        this._error = disabledLog;
        this._warn = disabledLog;
        this._info = disabledLog;
        this._trace = disabledLog;
        this._inspect = disabledLog;
        this.configure({
            level: this._level,
            pretty: this._pretty,
        });
    }
    private _prefixConstructor: PrefixConstructor = (level: UsableLogLevels, text?: string): string => {
        const llnc = this._logLevelsNameAndColorCollection[level];
        let prefix: string;
        if (this._pretty) {
            let ci: ChalkInstance;
            if (isNode) ci = chalk.hex(llnc.color);
            else if (level === LogLevels.Error || level === LogLevels.Warn) ci = chalk;
            else ci = chalk.hex(llnc.color);
            prefix = ci.bold(llnc.name);
            if (text !== undefined) prefix += ci.italic(` ${text} `);
        } else {
            prefix = llnc.name;
            if (text !== undefined) prefix += ` ${text} `;
        }
        return prefix;
    };
    private _scribe = (level: UsableLogLevels, log: typeof console.log, ...args: unknown[]) => {
        let prefix: string;
        let text: string | undefined = undefined;
        const first = args[0];
        if (typeof first === "string") {
            text = first;
            args.splice(0, 1);
        }
        prefix = this._prefixConstructor(level, text);
        log(prefix, ...args);
    };
    public configure = (options: ConfigurationOptions) => {
        let count = 0;
        if (!is.undefined(options.level)) {
            this._level = options.level;
            if (this._level >= LogLevels.Error) {
                this._error = this._logVariantsCollection[LogLevels.Error];
            } else {
                this._error = disabledLog;
            }
            if (this._level >= LogLevels.Warn) {
                this._warn = this._logVariantsCollection[LogLevels.Warn];
            } else {
                this._warn = disabledLog;
            }
            if (this._level >= LogLevels.Info) {
                this._info = this._logVariantsCollection[LogLevels.Info];
            } else {
                this._info = disabledLog;
            }
            if (this._level >= LogLevels.Trace) {
                this._trace = this._logVariantsCollection[LogLevels.Trace];
            } else {
                this._trace = disabledLog;
            }
            if (this._level >= LogLevels.Inspect) {
                this._inspect = this._logVariantsCollection[LogLevels.Inspect];
            } else {
                this._inspect = disabledLog;
            }
            count++;
        }
        if (!is.undefined(options.pretty)) {
            this._pretty = options.pretty;
            count++;
        }
        if (count === 0) this.error(PREFIX, "received no options during configuration");
    };
}
