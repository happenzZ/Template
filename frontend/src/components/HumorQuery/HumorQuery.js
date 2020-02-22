// /* global d3 $ */
import DrawHumorQuery from './drawHumorQuery.js'
// import dataService from '../../service/dataService.js'
// import pipeService from '../../service/pipeService'

export default {
    name: 'HumorQuery',
    components: {
    },
    props: {
        videoId: String,
        videoData: Object
    },
    data() {
        return {
            containerId: 'humorqueyGraph',
            humorData: {},
            interval: 5,
            sliding: 1
        }
    },
    watch: {
    },
    mounted: function () {
        this.drawHumorQuery = new DrawHumorQuery(this.containerId)

        // dataService.audioData('e271af20-cc49-4b8d-b034-bc8448529c67', this.interval, this.sliding, (data) => {
        //     this.audioData = data['data']
        //     pipeService.emitAudioData(this.audioData)
        //     this.drawAudio.layout(this.audioData)
        // })
    }
}
