declare module 'temperature-util' {
    export function celsiusToFahrenheit(celsius: number): number;
    export function celsiusToKelvin(celsius: number): number;
    export function celsiusToRankine(celsius: number): number;
    export function fahrenheitToCelsius(fahrenheit: number): number;
    export function fahrenheitToRankine(fahrenheit: number): number;
    export function fahrenheitToKelvin(fahrenheit: number): number;
    export function kelvinToCelsius(kelvin: number): number;
    export function kelvinToFahrenheit(kelvin: number): number;
    export function kelvinToRankine(kelvin: number): number;
    export function rankineToCelsius(rankine: number): number;
    export function rankineToFahrenheit(rankine: number): number;
    export function rankineToKelvin(rankine: number): number;
}