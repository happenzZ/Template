import DrawVideo from './drawVideo.js'
import dataService from '../../service/dataService.js'

export default {
    name: 'VideoView',
    components: {
    },
    props: {
        videoList: Array,
        videoId: String,
        videoData: Object
    },
    data() {
        return {
            // videoUrl: `${dataService.dataServerUrl}/video/video_test1`,
            // videoUrl: `${dataService.dataServerUrl}/video/e271af20-cc49-4b8d-b034-bc8448529c67`,
            videoUrl: `${dataService.dataServerUrl}/video/${this.videoId}`,
            videoUrlList: [],
            selectedVideo: '',
            poseData: {}
        }
    },
    watch: {
    },
    methods: {
    },
    mounted: function () {
        this.drawVideo = new DrawVideo('#labelsContainer')
        // console.log('this.videoId: ', this.videoId)
        // dataService.visionData(this.videoId, visionData => {
        //     this.drawVideo.layout('#labelsContainer', visionData['data'], this.videoUrl)
        //     // console.log('videojs: ', videojs);
        // })

        // dataService.poseData(this.videoId, poseData => {
        //     this.poseData = poseData['data']
        //     console.log('this.poseData: ', this.poseData)
        // })
    }
}
