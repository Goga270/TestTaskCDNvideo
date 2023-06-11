<template>
<main>
  <Video :video="this.video" :hls="this.hls" :levels="levels" :video-duration="videoDuration"></Video>
  <div class="stats container">
    <div class="stats__nav"></div>
    <div class="stats__row">
      <div class="stats__row__title font-title">
        Уровни качества.
      </div>
      <div class="stats__row__content">
        <div :class="{stats__row__content__item: true, stats__row__content__item__active: (this.hls.currentLevel == -1)}" v-on:click="switchQualityLevel($event, -1)">
          auto
        </div>
        <div :class="{stats__row__content__item: true, stats__row__content__item__active: (this.hls.currentLevel == index)}" v-for="(item, index) in levels" :key="index" v-on:click="switchQualityLevel($event, index)">
          {{Math.floor(item.bitrate/1024)}}KBps
          {{item.attrs["RESOLUTION"]}}
        </div>
      </div>
    </div>
    <div class="stats__row">
      <div class="stats__row__title font-title">
        Buffer
      </div>
      <div v-html="bufferStats" class="stats__row__content text-background"></div>
    </div>
  </div>
</main>
</template>

<script>
import Video from "@/components/Video.vue";
import Hls from "hls.js";
export default {
  name: "MainVue",
  components: {
    Video,
  },
  data: function () {
    return {
      video: Object,
      levels: [],
      hls: Object,
      videoDuration: 0,
      generalStats: "",
      bufferStats: "",
    }
  },
  methods: {
    switchQualityLevel(e, index) {
      this.hls.currentLevel = index;
      let elements = document.querySelectorAll('.stats__row__content__item');
      elements.forEach(function(element) {
        element.classList.remove('stats__row__content__item__active');
      });
      e.target.classList.add('stats__row__content__item__active');
    },
  },
  mounted() {
    const self = this;
    if (Hls.isSupported()) {
      this.video = document.getElementById('video');
      this.hls = new Hls();
      // MEDIA_ATTACHED event is fired by hls object once MediaSource is ready
      this.hls.on(Hls.Events.MEDIA_ATTACHED, function () {
        console.log('video and hls.js are now bound together !');
        self.hls.on(Hls.Events.BUFFER_APPENDED, function (event, data) {
          const { timeRanges } = data;
          //console.log(event,data);
          const bufferLength = timeRanges.length;
          const bufferStart = timeRanges.start(0);
          const bufferEnd = timeRanges.end(bufferLength - 1);

          console.log('Длина буфера:', bufferLength);
          console.log('Начало буфера:', bufferStart);
          console.log('Конец буфера:', bufferEnd);
        });
      });
      this.hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
        console.log('manifest loaded, found ' + data.levels.length + ' quality level');
        self.levels = data.levels;
      });
      this.video.addEventListener('loadedmetadata', () => {
        this.videoDuration = this.video.duration;
      });
      this.hls.loadSource('https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8');
      this.hls.attachMedia(this.video);
      this.hls.on(Hls.Events.FRAG_LOADED, function(event, data) {
        //const stats = hls.stats;
        //console.log(data);
        // Обновить статистику
      });
      setInterval(function() {
        if (self.hls.media) {
          const duration = self.hls.media.duration;
          const buffered = self.hls.media.buffered;
          const seekable = self.hls.media.seekable;
          const played = self.hls.media.played;
          const audioBuffer = buffered.length > 0 ? buffered.end(0) - buffered.start(0) : 0;
          const videoBuffer = buffered.length > 1 ? buffered.end(1) - buffered.start(1) : 0;
          const droppedFrames = self.hls.media.webkitDecodedFrameCount - self.hls.media.webkitDroppedFrameCount;
          const corruptedFrames = self.hls.media.webkitCorruptedFrameCount;
          self.bufferStats =
              'Duration:' + duration + '<br>' +
              'Buffered:' + '[' + ((buffered.length > 0)?buffered.start(0):0) + ':' +  ((buffered.length > 0)?buffered.end(0):0) + ']<br>' +
              'Seekable:' + '[' + ((seekable.length > 0)?seekable.start(0):0) + ':' +  ((seekable.length > 0)?seekable.start(0):0) + ']<br>' +
              'Played:' + '[' + ((played.length > 0)?played.start(0):0) + ':' +  ((played.length > 0)?played.end(0):0) + ']<br>' +
              'Buffer for audio contains:' + audioBuffer + '<br>' +
              'Buffer for video contains:' + videoBuffer + '<br>' +
              'Dropped frames:' + droppedFrames + '<br>' +
              'Corrupted frames:' + corruptedFrames + '<br>';
          /*console.log('Buffered:', [buffered.start(0), buffered.end(0)]);
          console.log('Seekable:', [seekable.start(0), seekable.end(0)]);
          console.log('Played:', [played.start(0), played.end(0)]);
          console.log('Buffer for audio contains:', [buffered.start(0), buffered.end(0)]);
          console.log('Buffer for video contains:', [buffered.start(1), buffered.end(1)]);
          console.log('Dropped frames:', droppedFrames);
          console.log('Corrupted frames:', corruptedFrames);*/
        }
      }, 1000);
    } else {
      // Обработайте ситуацию, когда HLS не поддерживается в браузере
    }
  },
  computed: {
    currentQualityClasses(){
      console.log(this.hls.currentLevel);
      return {
        stats__row__content__item: true,
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.stats {
  &__nav {}
  &__row {
    margin-top: 50px;
    &__title {
      margin-bottom: 20px;
    }
    &__content {
      display: flex;flex-wrap: wrap;
      &__item {
        display: flex;
        padding: 10px;
        font-weight: 600;
        color: #3A3A3A;
        background: #dcdcdc;
        margin: 0 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        &__active {
          background: #f7b72f;
          color: white;
        }
      }
    }
  }
}
.text-background {
  border: 2px solid #dcdcdc;
  background: black;
  width: 100%;
  padding: 10px;
  color: white;
}
</style>