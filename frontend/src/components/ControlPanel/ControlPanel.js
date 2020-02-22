// /* global d3 $ */
import DrawControlPanel from './drawControlPanel.js'
// import dataService from '../../service/dataService.js'
// import pipeService from '../../service/pipeService'

export default {
    name: 'ControlPanel',
    components: {
    },
    props: {
        videoId: String,
        videoData: Object
    },
    data() {
        return {
            containerId: 'controlpanelGraph',
            controlpanelData: {},
            interval: 5,
            sliding: 1
        }
    },
    watch: {
    },
    mounted: function () {
        this.drawControlPanel = new DrawControlPanel(this.containerId)

        // dataService.audioData('e271af20-cc49-4b8d-b034-bc8448529c67', this.interval, this.sliding, (data) => {
        //     this.audioData = data['data']
        //     pipeService.emitAudioData(this.audioData)
        //     this.drawAudio.layout(this.audioData)
        // })
    }
}
