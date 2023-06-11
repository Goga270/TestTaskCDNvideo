<template>
  <div v-html="svgContent"></div>
</template>

<script>
export default {
  name: "Svg",
  props: {
    svgPath: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      svgContent: ''
    };
  },
  mounted() {
    this.loadSVG();
  },
  methods: {
    async loadSVG() {
      try {
        const response = await fetch(this.svgPath);
        this.svgContent = await response.text();
      } catch (error) {
        console.error('Failed to load SVG:', error);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
div {
  height: 100%;display: block;
}
</style>