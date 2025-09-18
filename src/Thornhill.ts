

/**
 * @function
 * @name barrelHeatLoss
 * @description Thornhill's calculation for barrel heat loss.
 *
 * @param {number} barrelDiameter Bore diameter in inches.
 * @param {number} boreArea Area of the bore in inches squared.
 * @param {number} hydrodynamicRoughness Hydrodynamic roughness factor. Between 1.25 and 1.4.
 * @param {number} volumeInInches Total volume of the gun in inches cubed.
 * @param {number} chargeInLbs Total charge in pounds.
 * @param {number} gasTemperature Gas temperature.
 * @return {number} Barrel heat loss.
 * 
 * @see https://digitalrepository.unm.edu/cgi/viewcontent.cgi?article=1067&context=me_etds
 */
export function barrelHeatLoss(
    barrelDiameter: number,
    boreArea: number,
    hydrodynamicRoughness: number,
    volumeInInches: number,
    chargeInLbs: number,
    gasTemperature: number
): number {
    // maximum temperature in the barrel
    const T = (gasTemperature - 300.0) / (1.7 + 0.38 * Math.pow(barrelDiameter, 0.5) * Math.pow(Math.pow(barrelDiameter, 2) / chargeInLbs, 0.86));

    return 0.397 * Math.pow(barrelDiameter, 1.5) * volumeInInches / boreArea * T * hydrodynamicRoughness;
}