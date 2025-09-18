import type { BallisticComputationUnit } from "./types/BallisticComputationUnit.js";
//TODO: Pull this out into an interface and functions and lose the class semantics.
export class Solution {
    private _df: number;
    private _sln: Array<BallisticComputationUnit>;
    private _name: string;
    private _weight: number;
    private _bc: number;
    private _sightHeight: number;
    private _mv: number;
    private _angle: number;
    private _zeroRange: number;
    private _windSpeed: number;
    private _windAngle: number;
    private _temp: number;
    private _pressure: number;
    private _humidity: number;
    private _altitude: number;

    /**
     * Default constructor.
     * Used to reset the object state and prepare for a new calculation.
     */
    constructor() {
        this._sln = [];
        this._name = "";
        this._bc = -1;
        this._sightHeight = -1;
        this._weight = -1;
        this._mv = -1;
        this._angle = -1;
        this._zeroRange = -1;
        this._windSpeed = -1;
        this._windAngle = -1;
        this._temp = -1;
        this._humidity = -1;
        this._pressure = -1;
        this._altitude = -1;
        this._df = 1;
    }

    /**
     * Full constructor
     */
    static full(
        solution: Array<BallisticComputationUnit>,
        name: string,
        bc: number,
        sh: number,
        w: number,
        mv: number,
        angle: number,
        zr: number,
        ws: number,
        wa: number,
        t: number,
        h: number,
        p: number,
        a: number,
        df: number
    ): Solution {
        const sol = new Solution();
        sol._sln = solution;
        sol._name = name;
        sol._bc = bc;
        sol._sightHeight = sh;
        sol._weight = w;
        sol._mv = mv;
        sol._angle = angle;
        sol._zeroRange = zr;
        sol._windSpeed = ws;
        sol._windAngle = wa;
        sol._temp = t;
        sol._humidity = h;
        sol._pressure = p;
        sol._altitude = a;
        sol._df = df;
        return sol;
    }

    /** Getters for all properties */
    public getSolution(): Array<BallisticComputationUnit> {
        return this._sln;
    }

    public getName(): string {
        return this._name;
    }

    public getWeight(): number {
        return this._weight;
    }

    public getBc(): number {
        return this._bc;
    }

    public getSightHeight(): number {
        return this._sightHeight;
    }

    public getMv(): number {
        return this._mv;
    }

    public getAngle(): number {
        return this._angle;
    }

    public getZeroRange(): number {
        return this._zeroRange;
    }

    public getWindSpeed(): number {
        return this._windSpeed;
    }

    public getWindAngle(): number {
        return this._windAngle;
    }

    public getTemp(): number {
        return this._temp;
    }

    public getPressure(): number {
        return this._pressure;
    }

    public getHumidity(): number {
        return this._humidity;
    }

    public getAltitude(): number {
        return this._altitude;
    }

    public getSolutionSize(): number {
        return this._sln.length;
    }

    /** Helper to get CompUnit at position, with bounds check */
    private getCompUnit(position: number): BallisticComputationUnit {
        if (position >= this._sln.length) {
            return this._sln[this._sln.length - 1] as BallisticComputationUnit;
        } else {
            return this._sln[position] as BallisticComputationUnit;
        }
    }

    public getRange(position: number): number {
        return this.getCompUnit(position).range;
    }

    public getDrop(position: number): number {
        return this.getCompUnit(position).drop;
    }

    public getMOA(position: number): number {
        return this.getCompUnit(position).correction;
    }

    public getTime(position: number): number {
        return this.getCompUnit(position).time;
    }

    public getWindage(position: number): number {
        return this.getCompUnit(position).windageInches;
    }

    public getWindageMOA(position: number): number {
        return this.getCompUnit(position).windageMOA;
    }

    public getVelocity(position: number): number {
        return this.getCompUnit(position).velocityCompensated;
    }

    public getVx(position: number): number {
        return this.getCompUnit(position).verticalVelocity;
    }

    public getVy(position: number): number {
        return this.getCompUnit(position).horizontalVelocity;
    }

    /**
     * @param yardage
     * @return Calculated kinetic energy (ft/lbs) at specified yard downrange.
     */
    public getKineticEnergy(yardage: number): number {
        // The 450436 is (2 x 7000 x 32.174)
        // - 7000 converts grains to pounds
        // - 32.174 converts pounds to slugs (unit of mass in the English system)
        // 2 is from the formula for kinetic energy (1/2 x Mass x Velocity^2)
        return this._weight * Math.pow(this.getVelocity(yardage), 2) / 450436;
    }
}