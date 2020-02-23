import {
    colorPalette,
    mergeOptions,
    Hooks as BaseHooks
} from '@chartisan/chartisan'
import { EChartTitleOption, EChartOption, EChartsOptionConfig } from 'echarts'
import { CC } from './index'

function getLabel(
    axis: EChartOption.XAxis | EChartOption.XAxis[] | undefined,
    index: number
): string {
    if (!axis) return ''
    if (Array.isArray(axis)) return (axis[0].data?.[index] as string) ?? ''
    return (axis.data?.[index] as string) ?? ''
}

export class Hooks extends BaseHooks<CC> {
    /**
     * Sets the title of the chart.
     *
     * @param {(string | EChartTitleOption)} text
     * @returns {this}
     * @memberof Hooks
     */
    title(text: string | EChartTitleOption): this {
        return this.options({
            title: typeof text === 'string' ? { text } : text
        })
    }

    /**
     * Set the axis options for a given chart. If a boolean is given, it determines
     * if the axis should show or not.
     *
     * @param {(boolean
     *             | { xAxis?: EChartOption.XAxis; yAxis: EChartOption.YAxis })} [value=true]
     * @returns {this}
     * @memberof Hooks
     */
    axis(
        value:
            | boolean
            | { xAxis?: EChartOption.XAxis; yAxis: EChartOption.YAxis } = true
    ): this {
        return this.options({
            ...(typeof value === 'boolean'
                ? (value = { xAxis: { show: value }, yAxis: { show: value } })
                : value)
        })
    }

    /**
     * Determines the legend options of the chart.
     *
     * @param {(boolean | EChartOption.Legend)} [value=true]
     * @returns {this}
     * @memberof Hooks
     */
    legend(show: boolean | EChartOption.Legend = true): this {
        return this.options({
            legend: typeof show === 'boolean' ? { show } : show
        })
    }

    /**
     * Set the tooltip options for the chart.
     *
     * @param {(boolean | EChartOption.Tooltip)} [show=true]
     * @returns {this}
     * @memberof Hooks
     */
    tooltip(show: boolean | EChartOption.Tooltip = true): this {
        return this.options({
            tooltip: typeof show === 'boolean' ? { show } : show
        })
    }

    /**
     * Determine the color of the datasets.
     *
     * @param {string[]} [colors=colorPalette]
     * @returns {this}
     * @memberof Hooks
     */
    colors(colors: string[] = colorPalette): this {
        return this.custom(({ data }) => (data.color = colors) && data)
    }

    /**
     * Determines the datasets of the chart and their options.
     *
     * @param {(string | (string | EChartOption.Series)[])} types
     * @returns {this}
     * @memberof Hooks
     */
    datasets(types: string | (string | EChartOption.Series)[]): this {
        return this.custom(({ data, merge }) => {
            const t = Array.isArray(types)
                ? types.map(e => (typeof e === 'string' ? { type: e } : e))
                : [{ type: types }]
            // Modify each dataset.
            if (data.series) {
                for (let i = 0; i < data.series.length; i++) {
                    // Check if it's a special dataset.
                    data.series[i] = merge(
                        // @ts-ignore
                        data.series[i],
                        t[i % t.length]
                    )
                    if (t[i % t.length].type == 'pie') {
                        // Pie datasets require the data to be formated in a different way.
                        // @ts-ignore
                        data.series[i].data = data.series[i]?.data?.map(
                            (value: unknown, i: number) => ({
                                value,
                                name: getLabel(data.xAxis, i)
                            })
                        )
                    }
                }
            }
            return data
        })
    }
}
