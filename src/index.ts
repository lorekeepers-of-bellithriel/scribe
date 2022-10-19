import { RequireAtLeastOne } from "type-fest";
import { isNode } from "browser-or-node";
import is from "@sindresorhus/is";
import chalk from "chalk";

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

type ActiveLogVariants = {
    node: Log;
    browser: Log;
};

type UsableLogLevels = Exclude<LogLevels, LogLevels.All | LogLevels.None>;
type LogLevelsNameAndColorCollection = {
    [key in UsableLogLevels]: {
        name: string;
        color: string;
    };
};
type ActiveLogVariantsCollection = {
    [key in UsableLogLevels]: ActiveLogVariants;
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
    private _activeLogVariantsCollection: ActiveLogVariantsCollection;
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
                name: " ERR  ",
                color: "#F44336",
            },
            [LogLevels.Warn]: {
                name: " WARN ",
                color: "#FFC107",
            },
            [LogLevels.Info]: {
                name: " INFO ",
                color: "#4CAF50",
            },
            [LogLevels.Trace]: {
                name: " TRC  ",
                color: "#00BCD4",
            },
            [LogLevels.Inspect]: {
                name: " INS  ",
                color: "#9C27B0",
            },
        };
        this._activeLogVariantsCollection = {
            [LogLevels.Error]: {
                node: (...args: unknown[]) => this._scribe(LogLevels.Error, this._nodePrefixConstructor, console.error, ...args),
                browser: (...args: unknown[]) => this._scribe(LogLevels.Error, this._browserPrefixConstructor, console.error, ...args),
            },
            [LogLevels.Warn]: {
                node: (...args: unknown[]) => this._scribe(LogLevels.Warn, this._nodePrefixConstructor, console.warn, ...args),
                browser: (...args: unknown[]) => this._scribe(LogLevels.Warn, this._browserPrefixConstructor, console.warn, ...args),
            },
            [LogLevels.Info]: {
                node: (...args: unknown[]) => this._scribe(LogLevels.Info, this._nodePrefixConstructor, console.info, ...args),
                browser: (...args: unknown[]) => this._scribe(LogLevels.Info, this._browserPrefixConstructor, console.info, ...args),
            },
            [LogLevels.Trace]: {
                node: (...args: unknown[]) => this._scribe(LogLevels.Trace, this._nodePrefixConstructor, console.log, ...args),
                browser: (...args: unknown[]) => this._scribe(LogLevels.Trace, this._browserPrefixConstructor, console.log, ...args),
            },
            [LogLevels.Inspect]: {
                node: (...args: unknown[]) => this._scribe(LogLevels.Inspect, this._nodePrefixConstructor, console.log, ...args),
                browser: (...args: unknown[]) => this._scribe(LogLevels.Inspect, this._browserPrefixConstructor, console.log, ...args),
            },
        };
        this._logVariantsCollection = {
            [LogLevels.Error]: isNode
                ? this._activeLogVariantsCollection[LogLevels.Error].node //
                : this._activeLogVariantsCollection[LogLevels.Error].browser,
            [LogLevels.Warn]: isNode
                ? this._activeLogVariantsCollection[LogLevels.Warn].node //
                : this._activeLogVariantsCollection[LogLevels.Warn].browser,
            [LogLevels.Info]: isNode
                ? this._activeLogVariantsCollection[LogLevels.Info].node //
                : this._activeLogVariantsCollection[LogLevels.Info].browser,
            [LogLevels.Trace]: isNode
                ? this._activeLogVariantsCollection[LogLevels.Trace].node //
                : this._activeLogVariantsCollection[LogLevels.Trace].browser,
            [LogLevels.Inspect]: isNode
                ? this._activeLogVariantsCollection[LogLevels.Inspect].node //
                : this._activeLogVariantsCollection[LogLevels.Inspect].browser,
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
    private _nodePrefixConstructor: PrefixConstructor = (level: UsableLogLevels, text?: string): string => {
        const llnc = this._logLevelsNameAndColorCollection[level];
        let prefix = this._pretty ? chalk.bgHex(llnc.color).bold(llnc.name) : llnc.name;
        if (text !== undefined) prefix += ` ${text} `;
        return prefix;
    };
    private _browserPrefixConstructor: PrefixConstructor = (level: UsableLogLevels, text?: string): string => {
        const llnc = this._logLevelsNameAndColorCollection[level];
        let prefix = this._pretty ? `implement` : llnc.name;
        if (text !== undefined) prefix += ` ${text} `;
        return prefix;
    };
    private _scribe = (level: UsableLogLevels, prefixConstructor: PrefixConstructor, log: typeof console.log, ...args: unknown[]) => {
        let prefix: string;
        let text: string | undefined = undefined;
        const first = args[0];
        if (typeof first === "string") {
            text = first;
            args.splice(0, 1);
        }
        prefix = prefixConstructor(level, text);
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