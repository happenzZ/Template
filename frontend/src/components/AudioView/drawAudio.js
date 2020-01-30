/* global d3 $ */
import pipeService from '../../service/pipeService'

let DrawAudio= function (id) {	
	this.id = id
    this.svgWidth = $('#' + id).width()
    this.svgHeight = $('#' + id).height()
    this.margin = { top: 10, right: 100, bottom: 30, left: 100 }
    this.width = this.svgWidth - this.margin.left - this.margin.right
    this.height = this.svgHeight - this.margin.top - this.margin.bottom

    // draw tooltips when the video pauses
    this.speedTooltip = d3.select('#' + this.id).append('div')
        .attr('class', 'tooltip')
        .attr('width', '60px')
        .attr('height', '30px')
        .attr('position', 'absolute')
        .attr('text-align', 'center')
        .style('padding', '2px')
        .style('font-size', '12px')
        .style('background', 'lightsteelblue')
        .style('border-radius', '5px')
        .style('opacity', 0)

    this.volumeTooltip = d3.select('#' + this.id).append('div')
        .attr('class', 'tooltip')
        .attr('width', '60px')
        .attr('height', '30px')
        .attr('position', 'absolute')
        .attr('text-align', 'center')
        .style('padding', '2px')
        .style('font-size', '12px')
        .style('background', 'lightsteelblue')
        .style('border-radius', '5px')
        .style('opacity', 0)


    this.svg = d3.select('#' + id).append('svg')
        .attr('class', 'statisticSvg')
        .attr('width', this.svgWidth)
		.attr('height', this.svgHeight)
	
	this.graphContainer = this.svg.append('g')
		.attr('class', 'g_main')
        .attr('transform', 'translate(' + this.margin.left + ', ' + this.margin.top + ')')

}

DrawAudio.prototype.layout = function (data) {
    d3.select('#' + this.id).select('.g_main').selectAll('g').remove()
    console.log('data: ', data)  /* eslint-disable-line */

    // legend
    const legend = [
        { 'name': 'spm', 'color': 'green'},
        { 'name': 'wpm', 'color': 'steelblue'},
        { 'name': 'volume', 'color': 'red' },
    ]
    const silenceLegend = [
        {'name': 'micro', 'color': 'gray', 'opacity': 0.2},
        { 'name': 'master', 'color': 'gray', 'opacity': 0.4},
        { 'name': 'long', 'color': 'gray', 'opacity': 0.6}
    ]
    let legendGraph = this.svg.append('g').attr('class', 'legend')
        .attr('transform', 'translate(' + this.margin.left / 10 + ',' + this.svgHeight / 3 + ')')
    legendGraph.selectAll('.legendLine')
        .data(legend)
        .enter()
        .append('line')
        .attr('x1', 0)
        .attr('x2', 10)
        .attr('y1', function (d, i) { return 16 * i})
        .attr('y2', function (d, i) { return 16 * i })
        .attr('stroke', function (d) { return d.color})
    
    legendGraph.selectAll('.lengendLable')
        .data(legend)
        .enter()
        .append('text')
        .attr('x', 15)
        .attr('y', function (d, i) { return 16 * i })
        .text(function (d) { return d.name })
        .attr('font-size', '12px')
        .attr('text-anchor', 'left')
        .style('alignment-baseline', 'middle')
    
    legendGraph.selectAll('.legendRect')
        .data(silenceLegend)
        .enter()
        .append('rect')
        .attr('x', 0)
        .attr('width', 8)
        .attr('y', function (d, i) { return 16 * (i + 3)})
        .attr('height', 8)
        .attr('stroke', function (d) { return d.color })
        .style('opacity', function(d) { return d.opacity})
    
    legendGraph.selectAll('.lengendLable')
        .data(silenceLegend)
        .enter()
        .append('text')
        .attr('x', 15)
        .attr('y', function (d, i) { return 16 * i + 52 })
        .text(function (d) { return d.name })
        .attr('font-size', '12px')
        .attr('text-anchor', 'left')
        .style('alignment-baseline', 'middle')

    // tooltip
    // let tooltip = d3.select("g_main").append("div")
    //     .attr("class", "tooltip")
    //     .style("opacity", 0);


    // line graph
    let timestamps = data['timestamps']
    console.log('output:', timestamps)
    let endTime = timestamps[timestamps.length - 1]['end_time']
    let maxWPM = d3.max(timestamps.map(t => t['wpm']))
    // let minWPM = d3.min(timestamps.map(t => t['wpm']))
    let maxSPM = d3.max(timestamps.map(t => t['spm']))
    // let minSPM = d3.min(timestamps.map(t => t['spm']))
    let maxSpeed = maxSPM > maxWPM ? maxSPM : maxWPM
    // let minSpeed = minSPM < minWPM ? minSPM : minWPM
    let maxVolume = d3.max(timestamps.map(t => t['volume']))
    let minVolume = d3.min(timestamps.map(t => t['volume']))
    
    let xScaleLen = this.width / 3
    let yScaleLen = this.height

    let xScale = d3.scaleLinear()
        .domain([0, endTime])
        .range([0, xScaleLen])

    // draw speed graph
    let yScaleSpeed = d3.scaleLinear()
        .domain([0, maxSpeed])
        .range([yScaleLen, 0])
    
    let speedWPM = d3.line()
        .x(d => xScale((d['begin_time'] + d['end_time']) / 2))
        .y(d => yScaleSpeed(d['wpm']))
    
    let speedSPM = d3.line()
        .x(d => xScale((d['begin_time'] + d['end_time']) / 2))
        .y(d => yScaleSpeed(d['spm']))

    let speedContainer = this.graphContainer.append('g').attr('class', 'speed')
    speedContainer.append('path')
        .data([timestamps])
        .attr('class', 'speedWPM')
        .attr('d', speedWPM)
        .style('fill', 'none')
        .style('stroke', 'steelblue')
    
    speedContainer.append('path')
        .data([timestamps])
        .attr('class', 'speedSPM')
        .attr('d', speedSPM)
        .style('fill', 'none')
        .style('stroke', 'green')
    
    speedContainer.append('g').attr('class', 'x-axis')
        .attr('transform', 'translate(0, ' + this.height + ')')
        .call(d3.axisBottom(xScale).ticks(5))

    speedContainer.append('g').attr('class', 'y-axis')
        .attr('transform', 'translate(0, 0)')
        .call(d3.axisLeft(yScaleSpeed))
    
    // draw volume graph
    let yScaleVolume = d3.scaleLinear()
        .domain([minVolume - 1, maxVolume + 1])
        .range([yScaleLen, 0])

    let volumeLine = d3.line()
        .x(d => xScale((d['begin_time'] + d['end_time']) / 2))
        .y(d => yScaleVolume(d['volume']))

    let volumeContainer = this.graphContainer.append('g').attr('class', 'volume')
        .attr('transform', 'translate(' + (2 * this.width / 3) + ', ' + 0 + ')')
    volumeContainer.append('path')
        .data([timestamps])
        .attr('class', 'volumeLine')
        .attr('d', volumeLine)
        .style('fill', 'none')
        .style('stroke', 'red')

    volumeContainer.append('g').attr('class', 'x-axis')
        .attr('transform', 'translate(0, ' + this.height + ')')
        .call(d3.axisBottom(xScale).ticks(5))

    volumeContainer.append('g').attr('class', 'y-axis')
        .attr('transform', 'translate(0, 0)')
        .call(d3.axisLeft(yScaleVolume))

    // draw silence
    let microPauses = data['silence']['micro_pauses']
    let masterPauses = data['silence']['master_pauses']
    let longSilence = data['silence']['long_silence']

    speedContainer.selectAll('.microPauses')
        .data(microPauses)
        .enter()
        .append('rect')
        .style("fill", "gray")
        .style('opacity', 0.2)
        .attr("x", function (d) {
            return xScale(d.begin_time)
        })
        .attr("width", function (d) {
            return xScale(d.end_time) - xScale(d.begin_time)
        })
        .attr("y", 0)
        .attr("height", this.height)
        .attr('class', 'microPauses')
    speedContainer.selectAll('.masterPauses')
        .data(masterPauses)
        .enter()
        .append('rect')
        .style("fill", "gray")
        .style('opacity', 0.4)
        .attr("x", function (d) {
            return xScale(d.begin_time)
        })
        .attr("width", function (d) {
            return xScale(d.end_time) - xScale(d.begin_time)
        })
        .attr("y", 0)
        .attr("height", this.height)
        .attr('class', 'masterPauses')
    speedContainer.selectAll('.longSilence')
        .data(longSilence)
        .enter()
        .append('rect')
        .style("fill", "gray")
        .style('opacity', 0.6)
        .attr("x", function (d) {
            return xScale(d.begin_time)
        })
        .attr("width", function (d) {
            return xScale(d.end_time) - xScale(d.begin_time)
        })
        .attr("y", 0)
        .attr("height", this.height)
        .attr('class', 'longSilence')
    
    volumeContainer.selectAll('.microPauses')
        .data(microPauses)
        .enter()
        .append('rect')
        .style("fill", "gray")
        .style('opacity', 0.2)
        .attr("x", function (d) {
            return xScale(d.begin_time) 
        })
        .attr("width", function (d) {
            return xScale(d.end_time) - xScale(d.begin_time) 
        })
        .attr("y", 0)
        .attr("height", this.height)
        .attr('class', 'microPauses')
    volumeContainer.selectAll('.masterPauses')
        .data(masterPauses)
        .enter()
        .append('rect')
        .style("fill", "gray")
        .style('opacity', 0.4)
        .attr("x", function (d) {
            return xScale(d.begin_time)
        })
        .attr("width", function (d) {
            return xScale(d.end_time) - xScale(d.begin_time)
        })
        .attr("y", 0)
        .attr("height", this.height)
        .attr('class', 'masterPauses')
    volumeContainer.selectAll('.longSilence')
        .data(longSilence)
        .enter()
        .append('rect')
        .style("fill", "gray")
        .style('opacity', 0.6)
        .attr("x", function (d) {
            return xScale(d.begin_time)
        })
        .attr("width", function (d) {
            return xScale(d.end_time) - xScale(d.begin_time)
        })
        .attr("y", 0)
        .attr("height", this.height)
        .attr('class', 'longSilence')
    
    // draw frame line which corresponds to the play time of video
    let speedFrameLine = speedContainer.append('line')
        .attr('class', 'selected-frame')
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', 0)
        .attr('y2', this.height)
        .style('stroke', 'black')
    let volumeFrameLine = volumeContainer.append('line')
        .attr('class', 'selected-frame')
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', 0)
        .attr('y2', this.height)
        .style('stroke', 'black')
    
    pipeService.onFrameTime(curTime => {
        speedFrameLine.transition()
            .duration(500)
            .attr('x1', xScale(curTime))
            .attr('x2', xScale(curTime))
            .attr('y1', 0)
            .attr('y2', this.height)

        let window_size = timestamps[0]['end_time'] - timestamps[0]['begin_time']
        let curIndex = -1
        let speedContent = ''
        let volumeContent = ''
        if (curTime > (timestamps[0]['end_time'] + timestamps[0]['begin_time']) / 2) {
            curIndex = Math.floor((curTime - timestamps[0]['begin_time']) / window_size + 0.5)
        }
        if (curIndex > -1) {
            speedContent = 'wpm:' + timestamps[curIndex]['comment']['wpm'] + '</br>' + 'spm:' + timestamps[curIndex]['comment']['spm']
            volumeContent = 'volume:' + timestamps[curIndex]['comment']['volume']
        }

        this.speedTooltip.transition()		
            .duration(500)		
            .style('opacity', 0.9)
        this.speedTooltip.html(speedContent)
            .style('left', this.margin.left + xScale(curTime) + 3 + 'px')
            .style('top', this.margin.top + this.height / 2 + 'px')
        
        volumeFrameLine.transition()
            .duration(500)
            .attr('x1', xScale(curTime))
            .attr('x2', xScale(curTime))
            .attr('y1', 0)
            .attr('y2', this.height)
        
        this.volumeTooltip.transition()		
            .duration(500)		
            .style('opacity', 0.9)
        this.volumeTooltip.html(volumeContent)
            .style('left', this.margin.left + (2 * this.width / 3) + xScale(curTime) + 3 + 'px')
            .style('top', this.margin.top + this.height / 2 + 'px')
    })
}

export default DrawAudio