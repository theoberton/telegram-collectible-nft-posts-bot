declare module "agenda/Job" {
  import { ObjectId } from "mongodb";
  import type { Agenda } from "agenda/index";
  import { IJobParameters } from "agenda/types/JobParameters";
  import { JobPriority } from "agenda/utils/priority";
  /**
   * @class
   */
  export class Job<DATA = unknown | void> {
    readonly agenda: Agenda;
    private readonly byJobProcessor;
    readonly attrs: IJobParameters<DATA>;
    /** this flag is set to true, if a job got canceled (e.g. due to a timeout or other exception),
     * you can use it for long running tasks to periodically check if canceled is true,
     * also touch will check if and throws that the job got canceled
     */
    private canceled?;
    getCanceledMessage(): string | true | Error | undefined;
    private forkedChild?;
    cancel(error?: Error): void;
    /** internal variable to ensure a job does not set unlimited numbers of setTimeouts if the job is not processed
     * immediately */
    gotTimerToExecute: boolean;
    /**
     * creates a new job object
     * @param agenda
     * @param args
     * @param byJobProcessor
     */
    constructor(
      agenda: Agenda,
      args: Partial<IJobParameters<void>> & {
        name: string;
        type: "normal" | "single";
      },
      byJobProcessor?: boolean
    );
    constructor(
      agenda: Agenda,
      args: Partial<IJobParameters<DATA>> & {
        name: string;
        type: "normal" | "single";
        data: DATA;
      },
      byJobProcessor?: boolean
    );
    /**
     * Given a job, turn it into an JobParameters object
     */
    toJson(): IJobParameters;
    /**
     * Sets a job to repeat every X amount of time
     * @param interval
     * @param options
     */
    repeatEvery(
      interval: string | number,
      options?: {
        timezone?: string;
        skipImmediate?: boolean;
        endDate?: Date;
      }
    ): this;
    /**
     * Sets a job to repeat at a specific time
     * @param time
     */
    repeatAt(time: string): this;
    /**
     * if set, a job is forked via node child process and runs in a seperate/own
     * thread
     * @param enableForkMode
     */
    forkMode(enableForkMode: boolean): this;
    /**
     * Prevents the job from running
     */
    disable(): this;
    /**
     * Allows job to run
     */
    enable(): this;
    /**
     * Data to ensure is unique for job to be created
     * @param unique
     * @param opts
     */
    unique(
      unique: Required<IJobParameters<DATA>>["unique"],
      opts?: IJobParameters["uniqueOpts"]
    ): this;
    /**
     * Schedules a job to run at specified time
     * @param time
     */
    schedule(time: string | Date): this;
    /**
     * Sets priority of the job
     * @param priority priority of when job should be queued
     */
    priority(priority: JobPriority): this;
    /**
     * Fails the job with a reason (error) specified
     *
     * @param reason
     */
    fail(reason: Error | string): this;
    private fetchStatus;
    /**
     * A job is running if:
     * (lastRunAt exists AND lastFinishedAt does not exist)
     * OR
     * (lastRunAt exists AND lastFinishedAt exists but the lastRunAt is newer [in time] than lastFinishedAt)
     * @returns Whether or not job is running at the moment (true for running)
     */
    isRunning(): Promise<boolean>;
    /**
     * Saves a job to database
     */
    save(): Promise<Job>;
    /**
     * Remove the job from database
     */
    remove(): Promise<number>;
    isDead(): Promise<boolean>;
    isExpired(): Promise<boolean>;
    /**
     * Updates "lockedAt" time so the job does not get picked up again
     * @param progress 0 to 100
     */
    touch(progress?: number): Promise<void>;
    private computeNextRunAt;
    run(): Promise<void>;
    runJob(): Promise<void>;
    private isPromise;
  }
  export type JobWithId = Job & {
    attrs: IJobParameters & {
      _id: ObjectId;
    };
  };
}
declare module "agenda/JobDbRepository" {
  import { Collection, Filter, ObjectId, Sort } from "mongodb";
  import type { Job, JobWithId } from "agenda/Job";
  import type { Agenda } from "agenda/index";
  import type {
    IDatabaseOptions,
    IDbConfig,
    IMongoOptions,
  } from "agenda/types/DbOptions";
  import type { IJobParameters } from "agenda/types/JobParameters";
  /**
   * @class
   */
  export class JobDbRepository {
    private agenda;
    private connectOptions;
    collection: Collection<IJobParameters>;
    constructor(
      agenda: Agenda,
      connectOptions: (IDatabaseOptions | IMongoOptions) & IDbConfig
    );
    private createConnection;
    private hasMongoConnection;
    private hasDatabaseConfig;
    getJobById(
      id: string
    ): Promise<import("mongodb").WithId<IJobParameters<unknown>> | null>;
    getJobs(
      query: Filter<IJobParameters>,
      sort?: Sort,
      limit?: number,
      skip?: number
    ): Promise<IJobParameters[]>;
    removeJobs(query: Filter<IJobParameters>): Promise<number>;
    getQueueSize(): Promise<number>;
    unlockJob(job: Job): Promise<void>;
    /**
     * Internal method to unlock jobs so that they can be re-run
     */
    unlockJobs(jobIds: ObjectId[]): Promise<void>;
    lockJob(job: JobWithId): Promise<IJobParameters | undefined>;
    getNextJobToRun(
      jobName: string,
      nextScanAt: Date,
      lockDeadline: Date,
      now?: Date
    ): Promise<IJobParameters | undefined>;
    connect(): Promise<void>;
    private database;
    private processDbResult;
    saveJobState(job: Job<any>): Promise<void>;
    /**
     * Save the properties on a job to MongoDB
     * @name Agenda#saveJob
     * @function
     * @param {Job} job job to save into MongoDB
     * @returns {Promise} resolves when job is saved or errors
     */
    saveJob<DATA = unknown | void>(job: Job<DATA>): Promise<Job<DATA>>;
  }
}
declare module "agenda/JobProcessingQueue" {
  import type { Job, JobWithId } from "agenda/Job";
  import type { IJobParameters } from "agenda/types/JobParameters";
  import type { Agenda } from "agenda/index";
  /**
   * @class
   */
  export class JobProcessingQueue {
    private agenda;
    private _queue;
    constructor(agenda: Agenda);
    get length(): number;
    getQueue(): Job[];
    /**
     * Pops and returns last queue element (next job to be processed) without checking concurrency.
     * @returns {Job} Next Job to be processed
     */
    pop(): Job | undefined;
    /**
     * Inserts job in first queue position
     * @param {Job} job job to add to queue
     * @returns {undefined}
     */
    remove(job: Job): void;
    /**
     * Inserts job in queue where it will be order from left to right in decreasing
     * order of nextRunAt and priority (in case of same nextRunAt), if all values
     * are even the first jobs to be introduced will have priority
     * @param {Job} job job to add to queue
     * @returns {undefined}
     */
    insert(job: Job): void;
    /**
     * Returns (does not pop, element remains in queue) first element (always from the right)
     * that can be processed (not blocked by concurrency execution)
     * @param {Object} jobStatus current status of jobs
     * @returns {Job} Next Job to be processed
     */
    returnNextConcurrencyFreeJob(
      jobStatus: {
        [jobName: string]:
          | {
              running: number;
            }
          | undefined;
      },
      handledJobs: IJobParameters["_id"][]
    ):
      | (JobWithId & {
          attrs: IJobParameters & {
            nextRunAt?: Date | null;
          };
        })
      | undefined;
  }
}
declare module "agenda/JobProcessor" {
  import type { IAgendaStatus } from "agenda/types/AgendaStatus";
  import type { Agenda, JobWithId } from "agenda/index";
  /**
   * @class
   * Process methods for jobs
   */
  export class JobProcessor {
    private agenda;
    private maxConcurrency;
    private totalLockLimit;
    private processEvery;
    private jobStatus;
    private localQueueProcessing;
    getStatus(fullDetails?: boolean): Promise<IAgendaStatus>;
    private nextScanAt;
    private jobQueue;
    private runningJobs;
    private lockedJobs;
    private jobsToLock;
    private isLockingOnTheFly;
    private isJobQueueFilling;
    private isRunning;
    private processInterval?;
    constructor(
      agenda: Agenda,
      maxConcurrency: number,
      totalLockLimit: number,
      processEvery: number
    );
    stop(): JobWithId[];
    process(extraJob?: JobWithId): Promise<void>;
    /**
     * Returns true if a job of the specified name can be locked.
     * Considers maximum locked jobs at any time if self._lockLimit is > 0
     * Considers maximum locked jobs of the specified name at any time if jobDefinition.lockLimit is > 0
     * @param {String} name name of job to check if we should lock or not
     * @returns {boolean} whether or not you should lock job
     */
    shouldLock(name: string): boolean;
    /**
     * Internal method that adds jobs to be processed to the local queue
     * @param {*} jobs Jobs to queue
     * @param {boolean} inFront puts the job in front of queue if true
     * @returns {undefined}
     */
    private enqueueJob;
    /**
     * Internal method that will lock a job and store it on MongoDB
     * This method is called when we immediately start to process a job without using the process interval
     * We do this because sometimes jobs are scheduled but will be run before the next process time
     * @returns {undefined}
     */
    lockOnTheFly(): Promise<void>;
    private findAndLockNextJob;
    /**
     * Internal method used to fill a queue with jobs that can be run
     * @param {String} name fill a queue with specific job name
     * @returns {undefined}
     */
    private jobQueueFilling;
    /**
     * Internal method that processes any jobs in the local queue (array)
     * handledJobs keeps list of already processed jobs
     * @returns {undefined}
     */
    private jobProcessing;
    /**
     * Internal method that tries to run a job and if it fails, retries again!
     * @returns {boolean} processed a job or not
     */
    private runOrRetry;
    private updateStatus;
  }
}
declare module "agenda/index" {
  /// <reference types="node" />
  /// <reference types="node" />
  import { EventEmitter } from "events";
  import type { Db, Filter, MongoClientOptions, Sort } from "mongodb";
  import { SortDirection } from "mongodb";
  import { ForkOptions } from "child_process";
  import type { IJobDefinition } from "agenda/types/JobDefinition";
  import type { IAgendaConfig } from "agenda/types/AgendaConfig";
  import type {
    IDatabaseOptions,
    IDbConfig,
    IMongoOptions,
  } from "agenda/types/DbOptions";
  import type { IAgendaStatus } from "agenda/types/AgendaStatus";
  import type { IJobParameters } from "agenda/types/JobParameters";
  import { Job, JobWithId } from "agenda/Job";
  import { JobDbRepository } from "agenda/JobDbRepository";
  import { JobPriority } from "agenda/utils/priority";
  /**
   * @class
   */
  export class Agenda extends EventEmitter {
    readonly attrs: IAgendaConfig & IDbConfig;
    readonly forkedWorker?: boolean;
    readonly forkHelper?: {
      path: string;
      options?: ForkOptions;
    };
    db: JobDbRepository;
    on(event: "processJob", listener: (job: JobWithId) => void): this;
    on(event: "fail", listener: (error: Error, job: JobWithId) => void): this;
    on(event: "success", listener: (job: JobWithId) => void): this;
    on(event: "start", listener: (job: JobWithId) => void): this;
    on(event: "complete", listener: (job: JobWithId) => void): this;
    on(event: string, listener: (job: JobWithId) => void): this;
    on(event: string, listener: (error: Error, job: JobWithId) => void): this;
    on(event: "ready", listener: () => void): this;
    on(event: "error", listener: (error: Error) => void): this;
    readonly definitions: {
      [name: string]: IJobDefinition;
    };
    private jobProcessor?;
    readonly ready: Promise<void>;
    isActiveJobProcessor(): boolean;
    runForkedJob(jobId: string): Promise<void>;
    getRunningStats(fullDetails?: boolean): Promise<IAgendaStatus>;
    /**
     * @param {Object} config - Agenda Config
     * @param {Function} cb - Callback after Agenda has started and connected to mongo
     */
    constructor(
      config?: {
        name?: string;
        defaultConcurrency?: number;
        processEvery?: string | number;
        maxConcurrency?: number;
        defaultLockLimit?: number;
        lockLimit?: number;
        defaultLockLifetime?: number;
      } & (IDatabaseOptions | IMongoOptions | {}) &
        IDbConfig & {
          forkHelper?: {
            path: string;
            options?: ForkOptions;
          };
          forkedWorker?: boolean;
        },
      cb?: (error?: Error) => void
    );
    /**
     * Connect to the spec'd MongoDB server and database.
     */
    database(
      address: string,
      collection?: string,
      options?: MongoClientOptions
    ): Promise<Agenda>;
    /**
     * Use existing mongo connectino to pass into agenda
     * @param mongo
     * @param collection
     */
    mongo(mongo: Db, collection?: string): Promise<Agenda>;
    /**
     * Set the sort query for finding next job
     * Default is { nextRunAt: 1, priority: -1 }
     * @param query
     */
    sort(query: { [key: string]: SortDirection }): Agenda;
    private hasDatabaseConfig;
    /**
     * Cancels any jobs matching the passed MongoDB query, and removes them from the database.
     * @param query
     */
    cancel(query: Filter<IJobParameters>): Promise<number>;
    /**
     * Set name of queue
     * @param name
     */
    name(name: string): Agenda;
    /**
     * Set the time how often the job processor checks for new jobs to process
     * @param time
     */
    processEvery(time: string | number): Agenda;
    /**
     * Set the concurrency for jobs (globally), type does not matter
     * @param num
     */
    maxConcurrency(num: number): Agenda;
    /**
     * Set the default concurrency for each job
     * @param num number of max concurrency
     */
    defaultConcurrency(num: number): Agenda;
    /**
     * Set the default amount jobs that are allowed to be locked at one time (GLOBAL)
     * @param num
     */
    lockLimit(num: number): Agenda;
    /**
     * Set default lock limit per job type
     * @param num
     */
    defaultLockLimit(num: number): Agenda;
    /**
     * Set the default lock time (in ms)
     * Default is 10 * 60 * 1000 ms (10 minutes)
     * @param ms
     */
    defaultLockLifetime(ms: number): Agenda;
    /**
     * Finds all jobs matching 'query'
     * @param query
     * @param sort
     * @param limit
     * @param skip
     */
    jobs(
      query?: Filter<IJobParameters>,
      sort?: Sort,
      limit?: number,
      skip?: number
    ): Promise<Job[]>;
    /**
     * Removes all jobs from queue
     * @note: Only use after defining your jobs
     */
    purge(): Promise<number>;
    /**
     * Setup definition for job
     * Method is used by consumers of lib to setup their functions
     * BREAKING CHANGE in v4: options moved from 2nd to 3rd parameter!
     * @param name
     * @param processor
     * @param options
     */
    define<DATA = any>(
      name: string,
      processor: (agendaJob: Job<DATA>, done: (error?: Error) => void) => void,
      options?: Partial<
        Pick<IJobDefinition, "lockLimit" | "lockLifetime" | "concurrency">
      > & {
        priority?: JobPriority;
      }
    ): void;
    define<DATA = any>(
      name: string,
      processor: (agendaJob: Job<DATA>) => Promise<void>,
      options?: Partial<
        Pick<IJobDefinition, "lockLimit" | "lockLifetime" | "concurrency">
      > & {
        priority?: JobPriority;
      }
    ): void;
    /**
     * Internal helper method that uses createJob to create jobs for an array of names
     * @param {Number} interval run every X interval
     * @param {Array<String>} names Strings of jobs to schedule
     * @param {Object} data data to run for job
     * @param {Object} options options to run job for
     * @returns {Array<Job>} array of jobs created
     */
    private createJobs;
    /**
     * Given a name and some data, create a new job
     * @param name
     */
    create(name: string): Job<void>;
    create<DATA = unknown>(name: string, data: DATA): Job<DATA>;
    /**
     * Creates a scheduled job with given interval and name/names of the job to run
     * @param interval
     * @param names
     * @param data
     * @param options
     */
    every(
      interval: string | number,
      names: string[],
      data?: undefined,
      options?: {
        timezone?: string;
        skipImmediate?: boolean;
        forkMode?: boolean;
      }
    ): Promise<Job<void>[]>;
    every(
      interval: string | number,
      name: string,
      data?: undefined,
      options?: {
        timezone?: string;
        skipImmediate?: boolean;
        forkMode?: boolean;
      }
    ): Promise<Job<void>>;
    every<DATA = unknown>(
      interval: string | number,
      names: string[],
      data: DATA,
      options?: {
        timezone?: string;
        skipImmediate?: boolean;
        forkMode?: boolean;
      }
    ): Promise<Job<DATA>[]>;
    every<DATA = unknown>(
      interval: string | number,
      name: string,
      data: DATA,
      options?: {
        timezone?: string;
        skipImmediate?: boolean;
        forkMode?: boolean;
      }
    ): Promise<Job<DATA>>;
    /**
     * Schedule a job or jobs at a specific time
     * @param when
     * @param names
     */
    schedule<DATA = void>(
      when: string | Date,
      names: string[]
    ): Promise<Job<DATA>[]>;
    schedule<DATA = void>(
      when: string | Date,
      names: string
    ): Promise<Job<DATA>>;
    schedule<DATA = unknown>(
      when: string | Date,
      names: string[],
      data: DATA
    ): Promise<Job<DATA>[]>;
    schedule<DATA = unknown>(
      when: string | Date,
      name: string,
      data: DATA
    ): Promise<Job<DATA>>;
    /**
     * Create a job for this exact moment
     * @param name
     */
    now<DATA = void>(name: string): Promise<Job<DATA>>;
    now<DATA = unknown>(name: string, data: DATA): Promise<Job<DATA>>;
    /**
     * Starts processing jobs using processJobs() methods, storing an interval ID
     * This method will only resolve if a db has been set up beforehand.
     */
    start(): Promise<void>;
    /**
     * Clear the interval that processes the jobs and unlocks all currently locked jobs
     */
    stop(): Promise<void>;
  }
  export * from "agenda/types/AgendaConfig";
  export * from "agenda/types/JobDefinition";
  export * from "agenda/types/JobParameters";
  export * from "agenda/types/DbOptions";
  export * from "agenda/Job";
}
declare module "agenda/types/AgendaConfig" {
  export interface IAgendaConfig {
    name?: string;
    defaultConcurrency: number;
    processEvery: number;
    maxConcurrency: number;
    defaultLockLimit: number;
    lockLimit: number;
    defaultLockLifetime: number;
  }
}
declare module "agenda/types/AgendaStatus" {
  import type { IJobParameters } from "agenda/types/JobParameters";
  import type { IJobDefinition } from "agenda/types/JobDefinition";
  export interface IAgendaJobStatus {
    [name: string]: {
      running: number;
      locked: number;
      config: IJobDefinition;
    };
  }
  export interface IAgendaStatus {
    version: string;
    queueName: string | undefined;
    totalQueueSizeDB: number;
    config: {
      totalLockLimit: number;
      maxConcurrency: number;
      processEvery: string | number;
    };
    internal: {
      localQueueProcessing: number;
    };
    jobStatus?: IAgendaJobStatus;
    queuedJobs: number | IJobParameters[];
    runningJobs: number | IJobParameters[];
    lockedJobs: number | IJobParameters[];
    jobsToLock: number | IJobParameters[];
    isLockingOnTheFly: boolean;
  }
}
declare module "agenda/types/DbOptions" {
  import type { Db, MongoClientOptions, SortDirection } from "mongodb";
  export interface IDatabaseOptions {
    db: {
      collection?: string;
      address: string;
      options?: MongoClientOptions;
    };
  }
  export interface IMongoOptions {
    db?: {
      collection?: string;
    };
    mongo: Db;
  }
  export interface IDbConfig {
    ensureIndex?: boolean;
    sort?: {
      [key: string]: SortDirection;
    };
  }
}
declare module "agenda/types/JobDefinition" {
  import type { Job } from "agenda/Job";
  export interface IJobDefinition<DATA = unknown> {
    /** max number of locked jobs of this kind */
    lockLimit: number;
    /** lock lifetime in milliseconds */
    lockLifetime: number;
    /** Higher priority jobs will run first. */
    priority?: number;
    /** how many jobs of this kind can run in parallel/simultanously per Agenda instance */
    concurrency?: number;
    filePath: string | undefined;
    fn: DefinitionProcessor<DATA, void | ((error?: Error) => void)>;
  }
  export type DefinitionProcessor<DATA, CB> = (
    agendaJob: Job<DATA>,
    done: CB
  ) => CB extends void ? Promise<void> : void;
}
declare module "agenda/types/JobParameters" {
  import { Filter, ObjectId } from "mongodb";
  export interface IJobParameters<DATA = unknown | void> {
    _id?: ObjectId;
    name: string;
    priority: number;
    nextRunAt: Date | null;
    /**
     * normal: job is queued and will be processed (regular case when the user adds a new job)
     * single: job with this name is only queued once, if there is an exisitn gentry in the database, the job is just updated, but not newly inserted (this is used for .every())
     */
    type: "normal" | "single";
    lockedAt?: Date;
    lastFinishedAt?: Date;
    failedAt?: Date;
    failCount?: number;
    failReason?: string;
    repeatTimezone?: string;
    lastRunAt?: Date;
    repeatInterval?: string | number;
    data: DATA;
    repeatAt?: string;
    disabled?: boolean;
    progress?: number;
    unique?: Filter<Omit<IJobParameters<DATA>, "unique">>;
    uniqueOpts?: {
      insertOnly: boolean;
    };
    lastModifiedBy?: string;
    /** forks a new node sub process for executing this job */
    fork?: boolean;
  }
  export type TJobDatefield = keyof Pick<
    IJobParameters,
    "lastRunAt" | "lastFinishedAt" | "nextRunAt" | "failedAt" | "lockedAt"
  >;
  export const datefields: Array<TJobDatefield>;
}
declare module "agenda/utils/hasMongoProtocol" {
  export const hasMongoProtocol: (url: string) => boolean;
}
declare module "agenda/utils/isValidDate" {
  export function isValidDate(date: unknown): date is Date;
}
declare module "agenda/utils/nextRunAt" {
  import type { IJobParameters } from "agenda/types/JobParameters";
  export function isValidHumanInterval(value: unknown): value is string;
  /**
   * Internal method that computes the interval
   */
  export const computeFromInterval: (attrs: IJobParameters<any>) => Date;
  /**
   * Internal method to compute next run time from the repeat string
   * @returns {undefined}
   */
  export function computeFromRepeatAt(attrs: IJobParameters<any>): Date;
}
declare module "agenda/utils/priority" {
  export type JobPriority = number | keyof typeof priorityMap;
  const priorityMap: {
    lowest: number;
    low: number;
    normal: number;
    high: number;
    highest: number;
  };
  /**
   * Internal method to turn priority into a number
   */
  export function parsePriority(priority?: JobPriority): number;
  export {};
}
declare module "agenda/utils/processEvery" {
  export function calculateProcessEvery(input?: number | string): number;
}
declare module "agenda/utils/stack" {
  export function getCallerFilePath(position?: number): string | undefined;
}
declare module "agenda" {
  import main = require("agenda/index");
  export = main;
}
