<template>
  <render />
</template>
<script setup lang="tsx">
import { h } from 'vue';
import dayjs from 'dayjs';
import useFilter from '~/composition/useFilter';
import CopyLabel from '@/components/CopyLabel/index.vue';
import { ElLink } from 'element-plus';

// import { getTagClass } from '@/utils/index'
//   functional: true,
const props = defineProps({
  row: {
    type: Object,
    default: () => {
      return {};
    },
  },
  item: {
    default: null,
  },
});
const render = () => {
  const { formatMoney } = useFilter();

  const { item, row } = props;
  const {
    prop,
    format,
    combo,
    copy,
    link,
    age,
    isHtml,
    multiple,
    open,
    money,
  } = item as any;
  let path: string = '';
  if (link) {
    path = link;
    const reg = /(?<=\$\{).+?(?=\})/g;
    const linkMatch: RegExpMatchArray = link.match(reg);
    if (linkMatch) {
      linkMatch.forEach((element) => {
        path = path.replaceAll('${' + element + '}', row[element]);
      });
    }
  }

  if (money) {
    return <span>{formatMoney(row[prop])}</span>;
  }

  if (copy) {
    const directives = [
      {
        name: 'link',
        value: { path },
        modifiers: { open },
      },
    ];
    return path ? (
      <CopyLabel text={row[prop]}>
        <ElLink style="display: contents;" type="primary" {...{ directives }}>
          {row[prop]}
        </ElLink>
      </CopyLabel>
    ) : (
      <CopyLabel text={row[prop]}></CopyLabel>
    );
  }
  if (isHtml) {
    return <span domPropsInnerHTML={row[prop]}></span>;
  }
  if (path) {
    const directives = [
      {
        name: 'link',
        value: { path },
        modifiers: { open },
      },
    ];

    return (
      <ElLink type="primary" {...{ directives }}>
        {row[prop]}
      </ElLink>
    );
  }
  if (multiple) {
    const categorys = row[multiple]?.map((item, index) => {
      return (
        <el-tag
          title={item.name}
          style="max-width: 100%;"
          class="mb-1 text-ellipsis text-nowrap overflow-hidden"
        >
          {item.name}
        </el-tag>
      );
    });
    return (
      <div class="d-flex align-items-start flex-column template-level">
        {categorys}
      </div>
    );
  }
  if (prop === 'lastModifiedAt' || format) {
    if (age) {
      const title = dayjs(row['lastModifiedAt']).format(format ?? 'MM/DD/YYYY');
      return (
        <span title={title}>
          {row.updatedApproximateAge}
          <span class="text-light">,</span>
          <span class="text-capitalize opacity-4">
            {row.lastModifiedByName}
          </span>
        </span>
      );
    }
    const time = dayjs(row[prop]).format(format ?? 'MM/DD/YYYY');
    const timeNode: Element[] = [];
    timeNode.push(<div>{time}</div>);
    timeNode.push(
      <div class="text-info font-size-xs">{row['lastModifiedByName']}</div>
    );
    if (combo) return <div>{timeNode}</div>;
    return time;
  }
  // if (this.$scopedSlots.default) {
  //   return this.$scopedSlots.default()
  // }
  let temp = row[prop] ?? '--';
  if (typeof temp === 'boolean') {
    temp = temp ? 'Yes' : 'No';
  }
  return temp;
};
</script>
