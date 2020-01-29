import { Chartisan, ChartisanHooks } from '@chartisan/echarts'

function randomNumber() {
    return Math.floor(Math.random() * 50 + 1)
}

function randomData() {
    return {
        chart: {
            labels: ['a', 'b', 'c'],
            extra: null
        },
        datasets: [
            {
                id: 1,
                name: 'Sample 1',
                values: [randomNumber(), randomNumber(), randomNumber()],
                isDatetime: false,
                extra: null
            },
            {
                id: 2,
                name: 'Sample 2',
                values: [randomNumber(), randomNumber(), randomNumber()],
                isDatetime: false,
                extra: null
            }
        ]
    }
}
const chart1 = new Chartisan({
    el: '#chart1',
    url: 'http://127.0.0.1:9000',
    hooks: new ChartisanHooks()
        .title({
            textAlign: 'center',
            left: '50%',
            text: 'Example chart title to show',
            subtext: 'This is an example subtext'
        })
        .legend({ bottom: 0 })
        .tooltip()
        .colors()
        .axis(false)
        .datasets([
            {
                top: '25%',
                bottom: '25%',
                type: 'pie',
                center: ['25%', '50%'],
                radius: ['50%', '100%']
            },
            {
                top: '25%',
                bottom: '25%',
                type: 'pie',
                center: ['75%', '50%'],
                radius: ['50%', '100%']
            }
        ])
})
const chart2 = new Chartisan({
    el: '#chart2',
    data: randomData(),
    hooks: new ChartisanHooks()
        .title({
            textAlign: 'center',
            left: '50%',
            text: 'Example chart title to show',
            subtext: 'This is an example subtext'
        })
        .legend({ bottom: 0 })
        .tooltip()
        .colors()
        .datasets([
            {
                type: 'line',
                smooth: true,
                lineStyle: { width: 3 },
                symbolSize: 8,
                animationEasing: 'cubicInOut'
            },
            'bar'
        ])
        .options({
            yAxis: {
                axisLine: { show: false },
                axisTick: { show: false },
                splitLine: { lineStyle: { type: 'dashed' } }
            },
            xAxis: {
                axisLine: { show: false },
                axisTick: { show: false },
                axisPointer: { type: 'none' }
            }
        })
})

window.update1 = function() {
    chart1.update({ background: true })
}
window.update2 = function() {
    chart2.update({ data: randomData(), background: true })
}
