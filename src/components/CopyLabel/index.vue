<template>
  <span class="copy-label">
    <slot name="prepend" />
    <span class="text" :title="text">
      <slot>{{ text }}</slot>
    </span>
    <el-popover
      v-if="text"
      :open-delay="200"
      :close-delay="0"
      trigger="hover"
      placement="top"
      popper-class="p-1 text-center"
      @show="state = 0"
    >
      <transition :name="state ? '' : 'fade'" mode="out-in">
        <el-text v-if="state === 0" :key="0">Copy to Clipboard</el-text>
        <el-text v-else-if="state === 1" :key="1" type="success"
          >Copy successfully</el-text
        >
        <el-text v-else-if="state === 2" :key="2" type="danger"
          >Copy failed</el-text
        >
      </transition>
      <template #reference>
        <el-icon class="handler" @click="copyText">
          <CopyDocument />
        </el-icon>
      </template>
    </el-popover>
    <slot name="append" />
  </span>
</template>

<script>
import { copyText } from '@/utils';

export default {
  name: 'CopyLabel',
  props: {
    text: {
      type: [String, Number],
      default: null,
    },
  },
  data() {
    return {
      state: 0, // 0:pending 1:success 2:error
    };
  },
  methods: {
    async copyText() {
      clearTimeout(this.resetTimer);
      try {
        await copyText(this.text || '');
        this.state = 1;
      } catch (error) {
        this.state = 2;
      }
      this.resetTimer = setTimeout(() => {
        this.state = 0;
      }, 2000);
    },
  },
};
</script>

<style lang="scss" scoped>
.copy-label {
  display: inline-flex;
  max-width: 100%;

  .text {
    flex: 1 1 auto;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .handler {
    margin-top: 4px;
    margin-left: 4px;
    color: #ccc;
    user-select: none;
    opacity: 0.5;
    transition: 0.2s;
    cursor: pointer;

    &:hover {
      color: var(--primary-color) !important;
    }
  }

  &:hover .handler {
    opacity: 1;
  }
}
</style>
