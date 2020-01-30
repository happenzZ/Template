<template>
  <div id="app" style="width: 1400px">
      <nav class="navbar sticky-top navbar-dark bg-dark" style="padding-top: 1px; padding-bottom: 1px; margin-bottom: 5px;">
          <div style="margin-top:5px; margin-left: 5px;">
              <span style="color:white; font-size:1.25rem; font-weight:500; user-select: none">HumorLens</span>
          </div>
      </nav>
      <div class="container-fluid" style="padding-left: 5px; padding-right: 5px">
          <div class="row" style="margin-left: 10px; margin-right: 10px">
              <div class="col-6 content" style="padding-left: 3px; padding-right: 3px">
                <VideoView :videoList="videoList" :videoId="videoId" :videoData="videoData"></VideoView>
                <AudioView :videoId="videoId" :videoData="videoData"></AudioView>
              </div>
              <div class="col-6 content" style="padding-left: 3px; padding-right: 3px">
                <FaceView :videoId="videoId" :videoData="videoData"></FaceView>
                <TextView :videoId="videoId" :videoData="videoData"></TextView>
              </div>
          </div>
      </div>          
  </div>
</template>

<script>
import dataService from './service/dataService.js'
/* global d3 $ _ */

import VideoView from './components/VideoView/VideoView.vue'
import TextView from './components/TextView/TextView.vue'
import AudioView from './components/AudioView/AudioView.vue'
import FaceView from './components/FaceView/FaceView.vue'

export default {
  name: 'app',
  components: {
    VideoView,
    TextView,
    AudioView,
    FaceView
  },
  data() {
    return {
        videoList: [],
        videoId: 'simon_sinek_why_good_leaders_make_you_feel_safe',
        videoData: {}
    }
  },
  mounted: function () {
    console.log('d3: ', d3) /* eslint-disable-line */
    console.log('$: ', $) /* eslint-disable-line */
    console.log('_', _.partition([1, 2, 3, 4], n => n % 2)) /* eslint-disable-line */

    this.$nextTick(() => {
      dataService.initialization(this.videoId, (data) => {
        console.log('testing: ', data['data']) /* eslint-disable-line */
      })
    })
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  margin: 0 auto;
}

.container {
  width: 100%;
  padding: 5px 5px 5px 5px;
}

.content {
  padding: 2px 2px 2px 2px;
}

footer {
  margin-left: 5px;
}
</style>
