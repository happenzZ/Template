/* global d3 $ */

let DrawFace= function (id) {	
	this.id = id
    this.svgWidth = $('#' + id).width()
    this.svgHeight = $('#' + id).height()
    this.margin = { top: 50, right: 100, bottom: 10, left: 100 }
    this.width = this.svgWidth - this.margin.left - this.margin.right
    this.height = this.svgHeight - this.margin.top - this.margin.bottom

    this.svg = d3.select('#' + id).append('svg')
        .attr('class', 'statisticSvg')
        .attr('width', this.svgWidth)
		.attr('height', this.svgHeight)
	
	this.graphContainer = this.svg.append('g')
		.attr('class', 'g_main')
        .attr('transform', 'translate(' + this.margin.left + ', ' + this.margin.top + ')')

    this.emotionList = ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral']
    this.emotionListAll = ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral', 'empty']

    // origin happy <=> angry
    this.emotionColorRange = {
        'angry': '#fe6271',
        'disgust': '#aa81f3',
        'fear': '#45b0e2',
        'happy': '#fbca35',
        'neutral': '#bdbdbd',
        'sad': '#4667cc',
        'surprise': '#3ec845'
    }

    this.poseList = ['closePostures', 'openArms', 'openPostures']
    this.poseListAll = ['closePostures', 'openArms', 'openPostures', 'empty']

    this.poseColorRange = {
        'closePostures': '#1967A1',
        'openArms': '#B31515',
        'openPostures': '#F49445'
    }
    
    // Close postures owing to overlapping hand key points. 
    // Open arms since both the elbow points cross the torso region and wrist points go outermost.
    // Open postures as the hands fall in the torso region.
    
}

DrawFace.prototype.layout = function (data) {
    console.log('draw Face data: ', data)  /* eslint-disable-line */
    let faceInfo = data['face_info'].map((frameFaceInfo) => {
        if (frameFaceInfo['face_info'].length > 0) {
            return frameFaceInfo['face_info'][0]['emotion']
        } else {
            return 'empty'
        }
    })
    // console.log('faceInfo: ', faceInfo)

    function judgePose (cocoPart) {
        // console.log('cocoPart: ', cocoPart)
        const distance = (x0, y0, x1, y1) => Math.hypot(x1 - x0, y1 - y0)

        let Rwrist = cocoPart[4]
        let LWrist = cocoPart[7]
        let RElbow = cocoPart[3]
        let LElbow = cocoPart[6]
        let RShoulder = cocoPart[2]
        let LShoulder = cocoPart[5]

        let wristDistance = 0
        let elbowDistance = 0
        let shoulderDistance = 0
        try {
            wristDistance = distance(Rwrist[0], Rwrist[1], LWrist[0], LWrist[1])
            elbowDistance = distance(RElbow[0], RElbow[1], LElbow[0], LElbow[1])
            shoulderDistance = distance(RShoulder[0], RShoulder[1], LShoulder[0], LShoulder[1])
        } catch {
            return 'empty'
        }
        
        if (wristDistance < 0.2) {
            return 'closePostures'
        } else if (elbowDistance > elbowDistance && elbowDistance > shoulderDistance) {
            return 'openArms'
        } else if (wristDistance < elbowDistance) {
            return 'openPostures'
        } else {
            return 'empty'
        }
    }
 
    let poseInfo = data['pose_info'].map((framePoseInfo) => {
        if (framePoseInfo['pose_info'].length > 0) {
            return judgePose(framePoseInfo['pose_info'][0])
        } else {
            return 'empty'
        }
    })

    // console.log('poseInfo: ', poseInfo)

    // emotion
    let emotionCount = this.emotionListAll.reduce(function(accumulator, currentValue) {
        accumulator[currentValue] = 0
        return accumulator
    }, {})

    for (let i=0; i<faceInfo.length; i++) {
        emotionCount[faceInfo[i]] += 1
    }
    
    // let maxEmotionKey = 'empty'
    let maxEmotionValue = 0
    for (let emotionKey in emotionCount) {
        if (emotionCount[emotionKey] > maxEmotionValue) {
            maxEmotionValue = emotionCount[emotionKey]
            // maxEmotionKey = emotionKey
        }
    }

    let widthEmotion = this.width / 3
    let heightEmotion = this.height

    let xScaleEmotion = d3.scaleLinear()
            .domain([0, maxEmotionValue])
            .range([0, widthEmotion])

    let yScaleEmotion = d3.scaleBand()
        .domain(this.emotionListAll)
        .range([0, heightEmotion])
        .padding(0.1)

    let emotionContainer = this.graphContainer.append('g').attr('class', 'emotion')
    emotionContainer.append('g').attr('class', 'barchart')
        .selectAll()
        .data(this.emotionListAll)
        .enter()
        .append('rect')
        .attr('x', 0)
        .attr('y', (emotion) => yScaleEmotion(emotion))
        .attr('width', (emotion) => xScaleEmotion(emotionCount[emotion]))
        .attr('height', yScaleEmotion.bandwidth())
        .style('fill', (emotion) => this.emotionColorRange[emotion])


    emotionContainer.append('g').attr('class', 'x-axis')
        .attr('transform', 'translate(' + 0 + ',0)')
        .call(d3.axisTop(xScaleEmotion).ticks(5))

    emotionContainer.append('g').attr('class', 'y-axis')
        .attr('transform', 'translate(' + 0 + ',0)')
        .call(d3.axisLeft(yScaleEmotion))


    // pose
    let poseCount = this.poseListAll.reduce(function(accumulator, currentValue) {
        accumulator[currentValue] = 0
        return accumulator
    }, {})

    for (let i=0; i<poseInfo.length; i++) {
        poseCount[poseInfo[i]] += 1
    }
    // let poseCount = {
    //     'closePostures': 20,
    //     'openArms': 30,
    //     'openPostures':10,
    //     'empty': 0
    // }

    // let maxPoseKey = 'empty'
    let maxPoseValue = 0
    for (let poseKey in poseCount) {
        if (poseCount[poseKey] > maxPoseValue) {
            maxPoseValue = poseCount[poseKey]
            // maxPoseKey = poseKey
        }
    }

    let widthPose = this.width / 3
    let heightPose = this.height

    let xScalePose = d3.scaleLinear()
            .domain([0, maxPoseValue])
            .range([0, widthPose])

    let yScalePose = d3.scaleBand()
        .domain(this.poseListAll)
        .range([0, heightPose])
        .padding(0.1)

    let poseContainer = this.graphContainer.append('g').attr('class', 'pose')
        .attr('transform', 'translate(' + (2 * this.width / 3) + ', ' + 0 + ')')
    poseContainer.append('g').attr('class', 'barchart')
        .selectAll()
        .data(this.poseListAll)
        .enter()
        .append('rect')
        .attr('x', 0)
        .attr('y', (pose) => yScalePose(pose))
        .attr('width', (pose) => xScalePose(poseCount[pose]))
        .attr('height', yScalePose.bandwidth())
        .style('fill', (pose) => this.poseColorRange[pose])


    poseContainer.append('g').attr('class', 'x-axis')
        .attr('transform', 'translate(' + 0 + ',0)')
        .call(d3.axisTop(xScalePose).ticks(5))

    poseContainer.append('g').attr('class', 'y-axis')
        .attr('transform', 'translate(' + 0 + ',0)')
        .call(d3.axisLeft(yScalePose))


}

export default DrawFace