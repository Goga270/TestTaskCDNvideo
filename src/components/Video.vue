<template>
<div class="container">
  <div class="video">
    <div class="video__overlay">
      <div class="video__controls">
        <div class="video__controls__left">
          <div class="video__controls__item">
            <Svg v-if="!play" v-on:click="playVideo" class="icon__play icon" svg-path="assets/img/play.svg"></Svg>
            <Svg v-else v-on:click="pauseVideo" class="icon__pause icon" svg-path="assets/img/pause.svg"></Svg>
          </div>
          <div class="video__controls__item">
            {{timer}}
          </div>
        </div>
        <div class="video__controls__right">
          <div class="video__controls__item">
            <Svg v-on:click="toggleDropDownMenu('menu')" class="icon__fullscreen icon" svg-path="assets/img/ellipsis-v.svg"></Svg>
            <div class="video__controls__dropDownMenu" v-if="dropDownMenu">
              <div class="video__controls__dropDownMenu__content">
                <div v-on:click="openDopDopMenu('speed')" class="video__controls__dropDownMenu__item">
                  Скорость {{speed}}x
                </div>
                <div v-on:click="openDopDopMenu('quality')" class="video__controls__dropDownMenu__item">
                  Качество {{getCurrentLevel}}
                </div>
              </div>
            </div>
            <div v-if="qualityMenu" class="video__controls__dropDownMenu">
              <div class="video__controls__dropDownMenu__content">
                <div v-on:click="closeDopDopMenu('quality')" class="video__controls__dropDownMenu__item">
                  Назад
                </div>
                <hr>
                <div class="video__controls__dropDownMenu__item" v-for="(item, index) in levels" v-on:click="chgQuality(index)">
                  {{item.attrs['RESOLUTION']}}
                </div>
              </div>
            </div>
            <div v-if="speedMenu" class="video__controls__dropDownMenu">
              <div class="video__controls__dropDownMenu__content">
                <div v-on:click="closeDopDopMenu('speed')" class="video__controls__dropDownMenu__item">
                  Назад
                </div>
                <hr>
                <div v-on:click="chgSpeed(0.25)" class="video__controls__dropDownMenu__item">
                  0.25x
                </div>
                <div v-on:click="chgSpeed(0.5)" class="video__controls__dropDownMenu__item">
                  0.5x
                </div>
                <div v-on:click="chgSpeed(1)" class="video__controls__dropDownMenu__item">
                  1x
                </div>
                <div v-on:click="chgSpeed(1.25)" class="video__controls__dropDownMenu__item">
                  1.25x
                </div>
                <div v-on:click="chgSpeed(1.5)" class="video__controls__dropDownMenu__item">
                  1.5x
                </div>
              </div>
            </div>
          </div>
          <div class="video__controls__item">
            <Svg v-on:click="toggleDropDownMenu('volume')" class="icon__volume icon" svg-path="assets/img/volume.svg"></Svg>
            <div v-if="volumeMenu" class="video__controls__dropDownMenu__volume">
              <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  v-model="volume"
                  @input="updateVolume"
                  class="video__controls__dropDownMenu__volume__slider"
              />
            </div>
          </div>
          <div class="video__controls__item">
            <Svg v-on:click="openFullScreen" class="icon__fullscreen icon" svg-path="assets/img/expand.svg"></Svg>
          </div>
        </div>
      </div>
      <div class="video__progress">
        <input
            type="range"
            ref="progressBar"
            min="0"
            :max="videoDuration"
            step="0.1"
            v-model="currentTime"
            @input="seekToTime"
        />
      </div>
    </div>
    <video ref="videoElement" id="video"></video>
  </div>
  <div class="controls">
    <div class="controls__btn" v-on:click="playVideo">Старт</div>
    <div class="controls__btn" v-on:click="pauseVideo">Пауза</div>
    <div class="controls__btn" v-on:click="chgSpeed(this.speed)">Скорость</div>
    <input class="controls__input" v-model="speed" type="number">
    <div class="controls__btn" v-on:click="chgTime(this.video.currentTime + 5)">+5с</div>
    <div class="controls__btn" v-on:click="chgTime(this.video.currentTime - 5)">-5с</div>
    <div class="controls__btn" v-on:click="chgTime(this.seekTime)">Перейти к</div>
    <input class="controls__input" v-model="seekTime" type="number">
  </div>
</div>
</template>

<script>
import Svg from "@/components/commons/Svg.vue";

export default {
  name: "Video",
  components: {
    Svg,
  },
  props: {
    video: Object,
    hls: Object,
    levels: Array,
    videoDuration: Number,
  },
  data: function () {
    return {
      speed: 1,
      seekTime: 0,
      levels: [],
      play:false,
      timerInterval: null,
      timer: '00:00:00',
      volumeMenu: false,
      dropDownMenu: false,
      qualityMenu: false,
      speedMenu: false,
      volume: 0,
      currentTime: 0,
    }
  },
  methods: {
    playVideo() {
      this.video.play();
      this.play = true;
      this.startTimer();
    },
    pauseVideo() {
      this.video.pause();
      this.play = false;
      this.stopTimer();
    },
    openFullScreen() {
      if (this.video.requestFullscreen) {
        this.video.requestFullscreen();
      } else if (this.video.mozRequestFullScreen) {
        this.video.mozRequestFullScreen();
      } else if (this.video.webkitRequestFullscreen) {
        this.video.webkitRequestFullscreen();
      } else if (this.video.msRequestFullscreen) {
        this.video.msRequestFullscreen();
      }
    },
    startTimer() {
      clearInterval(this.timerInterval);

      this.timerInterval = setInterval(() => {
        const currentTime = this.video.currentTime;
        console.log(currentTime);
        this.timer = this.formatTime(currentTime);
      }, 1000);
    },
    stopTimer() {
      clearInterval(this.timerInterval);
    },
    formatTime(time) {
      const hours = Math.floor(time / 3600);
      const minutes = Math.floor((time % 3600) / 60);
      const seconds = Math.floor(time % 60);

      return (
          ('0' + hours).slice(-2) +
          ':' +
          ('0' + minutes).slice(-2) +
          ':' +
          ('0' + seconds).slice(-2)
      );
    },
    updateVolume() {
      this.video.volume = this.volume;
    },
    seekToTime() {
      const progressBar = this.$refs.progressBar;

      this.video.currentTime = progressBar.value;
      this.timer = this.formatTime(progressBar.value);
    },
    chgSpeed(newSpeed) {
      this.speed = newSpeed;
      this.video.playbackRate = newSpeed;
    },
    chgTime(newTime) {
      this.timer = this.formatTime(newTime);
      this.video.currentTime = newTime;
      this.currentTime = newTime;
    },
    toggleDropDownMenu(mode) {
      this.speedMenu = false;
      this.qualityMenu = false;
      if (mode === 'volume') {
        this.volumeMenu = !this.volumeMenu;
        this.dropDownMenu = false;
      }else if (mode === 'menu') {
        this.dropDownMenu = !this.dropDownMenu;
        this.volumeMenu = false;
      }
    },
    openDopDopMenu(mode) {
      if ('speed' === mode) {
        this.speedMenu = true;
        this.dropDownMenu = false;
      } else if ('quality' === mode) {
        this.qualityMenu = true;
        this.dropDownMenu = false;
      }
    },
    closeDopDopMenu(mode) {
      if ('speed' === mode) {
        this.speedMenu = false;
        this.dropDownMenu = true;
      } else if ('quality' === mode) {
        this.qualityMenu = false;
        this.dropDownMenu = true;
      }
    },
    chgQuality(index) {
      this.hls.currentLevel = index;
    }
  },
  computed: {
    getCurrentLevel() {
      console.log(this.hls.currentLevel);
      if (this.hls.currentLevel === -1) {
        return 'auto';
      }
      return (this.hls.levels.find((item, index) => {
        if (index === this.hls.currentLevel) {
          return item;
        }
      })).attrs['RESOLUTION'];
    },
  },
  mounted() {
    const videO = this.$refs.videoElement;
    this.volume = videO.volume;
    videO.addEventListener('timeupdate', () => {
      this.currentTime = videO.currentTime;
    });
  }
}
</script>

<style lang="scss" scoped>
.video {
  width: 75%;margin: auto;display: block;
  position: relative;
  &__overlay {
    display: flex;justify-content: flex-end;flex-direction: column;
    position: absolute;
    width: 100%;height: 100%;
    z-index: 100;
    transition: all 0.5s;
    padding: 10px;
    &:hover {
      background: rgba(0,0,0,0.4);
    }

  }
  &__controls {
    display: flex;justify-content: space-between;
    &__left, &__right {
      display: flex;align-items: center;
    }
    &__item {
      position: relative;
      color: white;
      &:not(:first-child) {
        margin-left: 10px;
      }
    }
    &__dropDownMenu {
      position: absolute;
      top: auto;
      left: -100%;
      bottom: calc(100% + 10px);
      &__content {
        background: white;
        padding: 10px;
      }
      &__item {
        cursor: pointer;
        &:not(:first-child) {
          margin-top: 10px;
        }
      }
    }
    &__dropDownMenu__volume {
      position: absolute;
      top: auto;
      bottom: calc(100% + 10px);
      width: 20px;
      height: 100px;
      padding: 0;
      &__slider {
        width: 100px;
        height: 20px;
        margin: 0;
        transform-origin: 50px 50px;
        transform: rotate(-90deg);
      }
    }
  }
  &__progress {
    margin-top: 10px;
    & input {
      width: 100%;
    }
  }
  & video {width: 100%;height: 100%;}
}
.controls {
  display: flex;
  justify-content: center;
  margin-top: 50px;
  &__btn {
    color: #3A3A3A;
    font-weight: 600;
    font-size: 18px;
    padding: 5px 10px;
    background: #dcdcdc;
    border-radius: 10px;border: 2px solid #D9D9D94D;
    cursor: pointer;
    &:not(:first-child) {
      margin-left: 10px;
    }
  }
  &__input {
    display: flex;
    border-radius: 10px;
    padding: 5px 10px;
    margin-left: 10px;
    width: 100px;
    text-align: center;
    outline: none;
  }
}
.icon {
  width: 15px;
  height: 15px;
  fill: white;
  display: block;
  cursor: pointer;
}
</style>