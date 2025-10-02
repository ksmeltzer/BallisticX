import { DragFunction } from "./BallisticX.js";
import logger from "./util/Logger.js";
import type { DragCoefficient } from "./types/DragCoefficient.js"



/**
 * @constant
 * @name dragCoefficientTables
 * @description A lookup table mapping each DragFunction to its ordered set of (threshold, A, M) values.
 * 
 * - The arrays are ordered from highest → lowest velocity threshold.
 * - The lookup rule is: find the first entry where vp > threshold.
 */
const dragCoefficientTables: Record<DragFunction, DragCoefficient[]> = {
    [DragFunction.G1]: [
        { velocityThreshold: 4230, A: 1.477404177730177e-04, M: 1.9565 },
        { velocityThreshold: 3680, A: 1.920339268755614e-04, M: 1.925 },
        { velocityThreshold: 3450, A: 2.894751026819746e-04, M: 1.875 },
        { velocityThreshold: 3295, A: 4.349905111115636e-04, M: 1.825 },
        { velocityThreshold: 3130, A: 6.520421871892662e-04, M: 1.775 },
        { velocityThreshold: 2960, A: 9.748073694078696e-04, M: 1.725 },
        { velocityThreshold: 2830, A: 1.453721560187286e-03, M: 1.675 },
        { velocityThreshold: 2680, A: 2.162887202930376e-03, M: 1.625 },
        { velocityThreshold: 2460, A: 3.209559783129881e-03, M: 1.575 },
        { velocityThreshold: 2225, A: 3.904368218691249e-03, M: 1.55 },
        { velocityThreshold: 2015, A: 3.222942271262336e-03, M: 1.575 },
        { velocityThreshold: 1890, A: 2.203329542297809e-03, M: 1.625 },
        { velocityThreshold: 1810, A: 1.511001028891904e-03, M: 1.675 },
        { velocityThreshold: 1730, A: 8.609957592468259e-04, M: 1.75 },
        { velocityThreshold: 1595, A: 4.086146797305117e-04, M: 1.85 },
        { velocityThreshold: 1520, A: 1.954473210037398e-04, M: 1.95 },
        { velocityThreshold: 1420, A: 5.431896266462351e-05, M: 2.125 },
        { velocityThreshold: 1360, A: 8.847742581674416e-06, M: 2.375 },
        { velocityThreshold: 1315, A: 1.456922328720298e-06, M: 2.625 },
        { velocityThreshold: 1280, A: 2.419485191895565e-07, M: 2.875 },
        { velocityThreshold: 1220, A: 1.657956321067612e-08, M: 3.25 },
        { velocityThreshold: 1185, A: 4.745469537157371e-10, M: 3.75 },
        { velocityThreshold: 1150, A: 1.379746590025088e-11, M: 4.25 },
        { velocityThreshold: 1100, A: 4.070157961147882e-13, M: 4.75 },
        { velocityThreshold: 1060, A: 2.938236954847331e-14, M: 5.125 },
        { velocityThreshold: 1025, A: 1.228597370774746e-14, M: 5.25 },
        { velocityThreshold: 980, A: 2.916938264100495e-14, M: 5.125 },
        { velocityThreshold: 945, A: 3.855099424807451e-13, M: 4.75 },
        { velocityThreshold: 905, A: 1.185097045689854e-11, M: 4.25 },
        { velocityThreshold: 860, A: 3.566129470974951e-10, M: 3.75 },
        { velocityThreshold: 810, A: 1.045513263966272e-08, M: 3.25 },
        { velocityThreshold: 780, A: 1.291159200846216e-07, M: 2.875 },
        { velocityThreshold: 750, A: 6.824429329105383e-07, M: 2.625 },
        { velocityThreshold: 700, A: 3.569169672385163e-06, M: 2.375 },
        { velocityThreshold: 640, A: 1.839015095899579e-05, M: 2.125 },
        { velocityThreshold: 600, A: 5.71117468873424e-05, M: 1.95 },
        { velocityThreshold: 550, A: 9.226557091973427e-05, M: 1.875 },
        { velocityThreshold: 250, A: 9.337991957131389e-05, M: 1.875 },
        { velocityThreshold: 100, A: 7.225247327590413e-05, M: 1.925 },
        { velocityThreshold: 65, A: 5.792684957074546e-05, M: 1.975 },
        { velocityThreshold: 0, A: 5.206214107320588e-05, M: 2.0 },
    ],

    [DragFunction.G2]: [
        { velocityThreshold: 1674, A: 0.0079470052136733, M: 1.36999902851493 },
        { velocityThreshold: 1172, A: 1.00419763721974e-03, M: 1.65392237010294 },
        { velocityThreshold: 1060, A: 7.15571228255369e-23, M: 7.91913562392361 },
        { velocityThreshold: 949, A: 1.39589807205091e-10, M: 3.81439537623717 },
        { velocityThreshold: 670, A: 2.34364342818625e-04, M: 1.71869536324748 },
        { velocityThreshold: 335, A: 1.77962438921838e-04, M: 1.76877550388679 },
        { velocityThreshold: 0, A: 5.18033561289704e-05, M: 1.98160270524632 },
    ],

    [DragFunction.G5]: [
        { velocityThreshold: 1730, A: 7.24854775171929e-03, M: 1.41538574492812 },
        { velocityThreshold: 1228, A: 3.50563361516117e-05, M: 2.13077307854948 },
        { velocityThreshold: 1116, A: 1.84029481181151e-13, M: 4.81927320350395 },
        { velocityThreshold: 1004, A: 1.34713064017409e-22, M: 7.8100555281422 },
        { velocityThreshold: 837, A: 1.03965974081168e-07, M: 2.84204791809926 },
        { velocityThreshold: 335, A: 1.09301593869823e-04, M: 1.81096361579504 },
        { velocityThreshold: 0, A: 3.51963178524273e-05, M: 2.00477856801111 },
    ],

    [DragFunction.G6]: [
        { velocityThreshold: 3236, A: 0.0455384883480781, M: 1.15997674041274 },
        { velocityThreshold: 2065, A: 0.07167261849653769, M: 1.10704436538885 },
        { velocityThreshold: 1311, A: 0.00166676386084348, M: 1.60085100195952 },
        { velocityThreshold: 1144, A: 1.01482730119215e-07, M: 2.9569674731838 },
        { velocityThreshold: 1004, A: 4.31542773103552e-18, M: 6.34106317069757 },
        { velocityThreshold: 670, A: 2.04835650496866e-05, M: 2.11688446325998 },
        { velocityThreshold: 0, A: 7.50912466084823e-05, M: 1.92031057847052 },
    ],

    [DragFunction.G7]: [
        { velocityThreshold: 4200, A: 1.29081656775919e-09, M: 3.24121295355962 },
        { velocityThreshold: 3000, A: 0.0171422231434847, M: 1.27907168025204 },
        { velocityThreshold: 1470, A: 2.33355948302505e-03, M: 1.52693913274526 },
        { velocityThreshold: 1260, A: 7.97592111627665e-04, M: 1.67688974440324 },
        { velocityThreshold: 1110, A: 5.71086414289273e-12, M: 4.3212826264889 },
        { velocityThreshold: 960, A: 3.02865108244904e-17, M: 5.99074203776707 },
        { velocityThreshold: 670, A: 7.52285155782535e-06, M: 2.1738019851075 },
        { velocityThreshold: 540, A: 1.31766281225189e-05, M: 2.08774690257991 },
        { velocityThreshold: 0, A: 1.34504843776525e-05, M: 2.08702306738884 },
    ],

    [DragFunction.G8]: [
        { velocityThreshold: 3571, A: 0.0112263766252305, M: 1.33207346655961 },
        { velocityThreshold: 1841, A: 0.0167252613732636, M: 1.28662041261785 },
        { velocityThreshold: 1120, A: 2.20172456619625e-03, M: 1.55636358091189 },
        { velocityThreshold: 1088, A: 2.0538037167098e-16, M: 5.80410776994789 },
        { velocityThreshold: 976, A: 5.92182174254121e-12, M: 4.29275576134191 },
        { velocityThreshold: 0, A: 4.3917343795117e-05, M: 1.99978116283334 },
    ],

    [DragFunction.I]: [
        { velocityThreshold: 2600, A: 4.0648825e-03, M: 1.55 },
        { velocityThreshold: 1800, A: 1.2479524e-03, M: 1.70 },
        { velocityThreshold: 1370, A: 1.3160125e-04, M: 2.00 },
        { velocityThreshold: 1230, A: 9.5697809e-08, M: 3.00 },
        { velocityThreshold: 970, A: 6.3368148e-14, M: 5.00 },
        { velocityThreshold: 790, A: 5.9353046e-08, M: 3.00 },
        { velocityThreshold: 0, A: 4.6761777e-05, M: 2.00 },
    ],

    [DragFunction.B]: [
        { velocityThreshold: 2600, A: 15366e-07, M: 1.67 },
        { velocityThreshold: 2000, A: 58495e-07, M: 1.50 },
        { velocityThreshold: 1460, A: 59814e-08, M: 1.80 },
        { velocityThreshold: 1190, A: 95408e-12, M: 3.00 },
        { velocityThreshold: 1040, A: 23385e-22, M: 6.45 },
        { velocityThreshold: 840, A: 59939e-12, M: 3.00 },
        { velocityThreshold: 0, A: 74422e-08, M: 1.60 },
    ],
    [DragFunction.G3]: [],
    [DragFunction.G4]: []
};

/**
 * @function
 * @name getCoefficients
 * @description A helper function that looks up a DragCoefficient from the dragCoefficientTables. It Iterates the table for the drag function, and returns the first (A, M) pair where velocity > threshold.
 * 
 * @param dragFunction the particular G model drag function
 * @param vp the velocity of the bullet.
 */
function getCoefficients(dragFunction: DragFunction, vp: number): { A: number; M: number } | null {
    const table = dragCoefficientTables[dragFunction];
    if (!table) return null; //will never happen but you know TypeScript gonna Typescript.

    for (const entry of table) {
        if (vp > entry.velocityThreshold) {
            return { A: entry.A, M: entry.M };
        }
    }

    return null //escape hatch if we do  not find one we want to come back as a definitive null;
}

/**
 * @function calculateRetard
 * @description Calculates ballistic retardation values based on standard drag functions.
 *
 * @param {DragFunction} dragFunction - The standard drag function model (G1–G8, etc.).
 * @param {number} dragCoefficient - The projectile’s drag coefficient for the chosen model.
 * @param {number} velocity - The projectile’s current velocity in ft/s.
 *
 * @returns {number} The projectile drag retardation velocity, in ft/s². Returns -1 if invalid.
 * 
 * @see {@link https://en.wikipedia.org/wiki/Ballistic_coefficient | Ballistic Coefficient}
 */
export function calculateRetard(
    dragFunction: DragFunction,
    dragCoefficient: number,
    velocity: number
): number {
    const vp = velocity;
    const coeffs = getCoefficients(dragFunction, vp);

    if (!coeffs || vp <= 0 || vp >= 10000) {
        return -1;
    }

    const { A, M } = coeffs;

    logger.debug(`A: ${A}, M: ${M}, vp: ${vp}`);

    const val = (A * Math.pow(vp, M)) / dragCoefficient;
    logger.debug(`val: ${val}`);

    return val;
}
