// /* global d3 $ */
// import pipeService from '../../service/pipeService'
import DrawText from './drawText.js'

export default {
    name: 'TextView',
    components: {
    },
    props: {
        videoId: String,
        videoData: Object
    },
    data() {
        return {
            containerId: 'textContainer',
            textData : {}
        }
    },
    watch: {
        textData: function (textData) {
            this.drawText.layout(textData)
        }
    },
    mounted: function () {
        this.drawText = new DrawText(this.containerId)

        // dataService.textData('e271af20-cc49-4b8d-b034-bc8448529c67', (data) => {
        //     this.textData = data['data']
        //     pipeService.emitTextData(this.textData)
        //   })
    }

}
