import { Hooks } from './hooks'
import {
    isHook,
    ServerData,
    isChartisan,
    Chartisan as Base
} from '@chartisan/chartisan'

export { Hooks as ChartisanHooks }

/**
 * Used as an alias.
 *
 * @type {CC}
 */
export type CC = {}

/**
 * Base chart class for ChartJS.
 *
 * @export
 * @class Chart
 * @extends {Base}
 */
export class Chartisan extends Base<CC> {
    /**
     * Formats the data of the request to match the data that
     * the chart needs (acording to the desired front-end).
     *
     * @protected
     * @param {ServerData} response
     * @returns {ChartConfiguration}
     * @memberof Chartisan
     */
    protected formatData(response: ServerData): CC {
        return {}
    }

    /**
     * Handles a successfull response of the chart data.
     *
     * @protected
     * @param {CC} data
     * @memberof Chartisan
     */
    protected onUpdate(data: CC) {}

    /**
     * Handles a successfull response of the chart data
     * in the background (possibly, updating the values
     * of the chart without creating a new one).
     *
     * @protected
     * @param {CC} data
     * @param {ChartUpdateProps} [options]
     * @memberof Chartisan
     */
    protected onBackgroundUpdate(data: CC, options?: {}) {}
}

declare global {
    /**
     * Extends the Window interface.
     *
     * @interface Window
     */
    interface Window {
        /**
         * The chartisan class to initiate it as a global variable
         * bound to the window var.
         *
         * @type {isChartisan<CC>}
         * @memberof Window
         */
        Chartisan: isChartisan<CC>

        /**
         * Determines the hooks of the chart.
         *
         * @type {isHook<CC>}
         * @memberof Window
         */
        ChartisanHooks: isHook<CC>
    }
}

window.Chartisan = Chartisan
window.ChartisanHooks = Hooks
