import {nextTick} from 'vue'
import { DirectiveBinding } from '@vue/runtime-core'

import router from '@/router/index'

export default async function bind(el: HTMLElement, binding: DirectiveBinding) {
  await nextTick()
  // console.log('==', binding)
  const { href } = router.resolve(binding.value)
  //  console.log('==', href)
  if (el instanceof HTMLAnchorElement) {
    el.href = href
    el.onclick = e => {
      if (!e.ctrlKey && !e.shiftKey && !e.metaKey) {
        e.preventDefault()
        if (binding.modifiers.open) {
          open(href)
        } else if (binding.value.action) {
          binding.value.action()
        } else {
          router.push(binding.value)
        }
      }
    }
  } else {
    console.error('The element is not an anchor element and does not support the href attribute.')
  }
}
