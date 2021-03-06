import { Hooks } from './hooks'
import { install, ResizeObserver } from 'resize-observer'
import { init, ECharts, EChartOption } from 'echarts'
import { isHook, ServerData, isChartisan, Chartisan as Base } from '@chartisan/chartisan'

export { Hooks as ChartisanHooks }

/**
 * Used as an alias.
 */
export type CC = EChartOption

/**
 * Base chart class for Echarts.
 */
export class Chartisan extends Base<CC> {
  /**
   * The chart canvas.
   */
  div?: HTMLDivElement

  /**
   * Stores the chart instance.
   */
  chart?: ECharts

  /**
   * Stores the resize observer.
   */
  observer?: ResizeObserver

  /**
   * Observes the chart division for changes to resize
   * the chart to the new division dimensions.
   */
  protected observe() {
    // Remove existing observations.
    if (this.observer) this.observer.disconnect()
    // Create a new observer with the given callback.
    this.observer = new ResizeObserver(() => this.chart?.resize())
    // Observe the division in case it exists.
    if (this.div) this.observer.observe(this.div)
  }

  /**
   * Renews the division where the chart lives.
   */
  protected renewDiv() {
    if (this.div) this.body.removeChild(this.div)
    this.div = document.createElement('div')
    this.div.style.width = '100%'
    this.div.style.height = '100%'
    this.body.appendChild(this.div)
    this.observe()
  }

  /**
   * Formats the data of the request to match the data that
   * the chart needs (acording to the desired front-end).
   */
  protected formatData(response: ServerData): CC {
    return {
      xAxis: { data: response.chart.labels },
      yAxis: {},
      series: response.datasets.map(({ name, values }) => ({
        name,
        type: 'bar',
        data: values,
      })),
    }
  }

  /**
   * Handles a successfull response of the chart data.
   */
  protected onUpdate(data: CC) {
    if (this.chart) this.chart.dispose()
    this.renewDiv()
    this.chart = init(this.div!)
    this.chart.setOption(data)
  }

  /**
   * Handles a successfull response of the chart data
   * in the background (possibly, updating the values
   * of the chart without creating a new one).
   */
  protected onBackgroundUpdate(data: CC) {
    if (this.chart) this.chart.setOption(data)
    else this.onUpdate(data)
  }

  /**
   * Destroys the chart instance if any.
   */
  protected onDestroy() {
    if (this.chart) this.chart.dispose()
  }
}

declare global {
  /**
   * Extends the Window interface.
   */
  interface Window {
    /**
     * The chartisan class to initiate it as a global variable
     * bound to the window var.
     */
    Chartisan: isChartisan<CC>

    /**
     * Determines the hooks of the chart.
     */
    ChartisanHooks: isHook<CC>
  }
}

if (typeof window !== 'undefined') {
  // Install the ResizeObserver pollyfill.
  if (!window.hasOwnProperty('ResizeObserver')) install()
  window.Chartisan = Chartisan
  window.ChartisanHooks = Hooks
}
