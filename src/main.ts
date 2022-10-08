import { isNode } from "browser-or-node";

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
    (...args: any[]): void;
    (prefix: string, ...args: any[]): void;
};

type ActiveLogVariants = {
    node: Log;
    browser: Log;
};

type ExcludedLogLevels = LogLevels.All | LogLevels.None;
type ActiveLogVariantsCollection = {
    [key in Exclude<LogLevels, ExcludedLogLevels>]: ActiveLogVariants;
};
type LogVariantsCollection = {
    [key in Exclude<LogLevels, ExcludedLogLevels>]: Log;
};

const activeLogVariantsCollection: ActiveLogVariantsCollection = {
    [LogLevels.Error]: {
        node: (one: unknown, two: unknown): void => {
            // todo: implement
        },
        browser: (one: unknown, two: unknown): void => {
            // todo: implement
        },
    },
    [LogLevels.Warn]: {
        node: (one: unknown, two: unknown): void => {
            // todo: implement
        },
        browser: (one: unknown, two: unknown): void => {
            // todo: implement
        },
    },
    [LogLevels.Info]: {
        node: (one: unknown, two: unknown): void => {
            // todo: implement
        },
        browser: (one: unknown, two: unknown): void => {
            // todo: implement
        },
    },
    [LogLevels.Trace]: {
        node: (one: unknown, two: unknown): void => {
            // todo: implement
        },
        browser: (one: unknown, two: unknown): void => {
            // todo: implement
        },
    },
    [LogLevels.Inspect]: {
        node: (one: unknown, two: unknown): void => {
            // todo: implement
        },
        browser: (one: unknown, two: unknown): void => {
            // todo: implement
        },
    },
};

const disabledLog: Log = () => {};

const logVariantsCollection: LogVariantsCollection = {
    [LogLevels.Error]: isNode
        ? activeLogVariantsCollection[LogLevels.Error].node //
        : activeLogVariantsCollection[LogLevels.Error].browser,
    [LogLevels.Warn]: isNode
        ? activeLogVariantsCollection[LogLevels.Warn].node //
        : activeLogVariantsCollection[LogLevels.Warn].browser,
    [LogLevels.Info]: isNode
        ? activeLogVariantsCollection[LogLevels.Info].node //
        : activeLogVariantsCollection[LogLevels.Info].browser,
    [LogLevels.Trace]: isNode
        ? activeLogVariantsCollection[LogLevels.Trace].node //
        : activeLogVariantsCollection[LogLevels.Trace].browser,
    [LogLevels.Inspect]: isNode
        ? activeLogVariantsCollection[LogLevels.Inspect].node //
        : activeLogVariantsCollection[LogLevels.Inspect].browser,
};

export class Scribe {
    private static _level = LogLevels.Info;
    public static get level() {
        return this._level;
    }
    public static configure = (level: LogLevels) => {
        this._level = level;
        if (level >= LogLevels.Error) {
            this._error = logVariantsCollection[LogLevels.Error];
        } else {
            this._error = disabledLog;
        }
        if (level >= LogLevels.Warn) {
            this._warn = logVariantsCollection[LogLevels.Warn];
        } else {
            this._warn = disabledLog;
        }
        if (level >= LogLevels.Info) {
            this._info = logVariantsCollection[LogLevels.Info];
        } else {
            this._info = disabledLog;
        }
        if (level >= LogLevels.Trace) {
            this._trace = logVariantsCollection[LogLevels.Trace];
        } else {
            this._trace = disabledLog;
        }
        if (level >= LogLevels.Inspect) {
            this._inspect = logVariantsCollection[LogLevels.Inspect];
        } else {
            this._inspect = disabledLog;
        }
    };
    private static _error = logVariantsCollection[LogLevels.Error];
    public static get error() {
        return this._error;
    }
    private static _warn = logVariantsCollection[LogLevels.Warn];
    public static get warn() {
        return this._warn;
    }
    private static _info = logVariantsCollection[LogLevels.Info];
    public static get info() {
        return this._info;
    }
    private static _trace = disabledLog;
    public static get trace() {
        return this._trace;
    }
    private static _inspect = disabledLog;
    public static get inspect() {
        return this._inspect;
    }
}
