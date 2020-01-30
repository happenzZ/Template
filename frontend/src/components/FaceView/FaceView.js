// /* global d3 $ */
import DrawFace from './drawFace.js'
// import dataService from '../../service/dataService.js'
// import pipeService from '../../service/pipeService.js'

export default {
    name: 'FaceView',
    components: {
    },
    props: {
        videoId: String,
        videoData: Object
    },
    data() {
        return {
            containerId: 'faceContainer',
            visionData: {}
        }
    },
    watch: {
        visionData: function (visionData) {
            this.drawFace.layout(visionData)
        }
    },
    mounted: function () {
        this.drawFace = new DrawFace(this.containerId)

        // dataService.visionData('e271af20-cc49-4b8d-b034-bc8448529c67', (data) => {
        //     this.visionData = data['data']
        //     pipeService.emitVisionData(this.visionData)
        //   })
    }
}
