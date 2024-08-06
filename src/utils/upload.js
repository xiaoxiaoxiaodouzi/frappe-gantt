const pictureExt = ['gif', 'png', 'jpeg', 'jpg'];
const videoExt = ['mp4', 'webm', 'ogg'];
const officeExt = ['doc', 'xls', 'ppt', 'docx', 'xlss', 'xlsx', 'pptx'];
const emlExt = ['eml'];
const pdfExt = ['pdf'];
const mdExt = ['md'];

import DocumentService from '@/service/DocumentService';
import { saveAs } from 'file-saver';

export const ISDOC = /(\.|\/)(docx|doc)$/i;
export const ISEXCEL = /(\.|\/)(xlsx|xls)$/i;
export const ISPDF = /(\.|\/)(pdf)$/i;
export const ISIMG = /(\.|\/)(png|jpe?g|gif|tif|bmp)$/i;
export const ISVIDEO = /(\.|\/)(mp4|flv|avi|mov|wmv|mpeg|mpg|rmvb|rm|ram|swf)$/i;
export const ISOTHERFILE = /(\.|\/)(txt|rtf|rtx|zip|rar|csv|html)$/i;

export function isDoc(fileName) {
  return this.ISDOC.test(fileName);
}

export function isExcel(fileName) {
  return this.ISEXCEL.test(fileName);
}
export function isPdf(fileName) {
  return this.ISPDF.test(fileName);
}
export function isVideo(fileName) {
  return this.ISVIDEO.test(fileName);
}
export function isImg(fileName) {
  return this.ISIMG.test(fileName);
}
export function isOtherFile(fileName) {
  return this.ISOTHERFILE.test(fileName);
}
export function getFileTypeIcon(fileName) {
  const lastIndex = fileName?.lastIndexOf('.');
  const type = fileName?.substring(lastIndex + 1); // png
  const value = (type && type.toLocaleLowerCase()) || null;

  if (pictureExt.includes(value)) {
    return 'hiconfont hicon-img';
  }
  if (videoExt.includes(value)) {
    return 'hiconfont hicon-film';
  }
  if (officeExt.includes(value)) {
    if (['xls', 'xlss', 'xlsx'].includes(value)) {
      return 'hiconfont hicon-excel';
    }
    if (['doc', 'docs'].includes(value)) {
      return 'hiconfont hicon-word';
    }
    if (['ppt', 'pptx'].includes(value)) {
      return 'hiconfont hicon-powerpoint';
    }
    return 'hiconfont hicon-file';
  }
  if (pdfExt.includes(value)) {
    return 'hiconfont hicon-pdf';
  }
  if (mdExt.includes(value)) {
    return 'hiconfont hicon-file';
  }
  if (emlExt.includes(value)) {
    return 'hiconfont hicon-email';
  }
  return 'hiconfont hicon-file';
}
export function openNewTabToView(item) {
  window.open(item.documentUrl, '_blank');
}

export function handleDownload(item, index) {
  if (item.documentId.startsWith('AttachmentId:')) {
    this.$message.warning('The picture is syncing from SMS, please download it again later.')
    return;
  }
  DocumentService.downloadFile(item.documentId).then(res => {
    var blob = new Blob([res], { type: 'application/octet-stream' });
    saveAs(blob, item.documentName);
  });
}

export function ellipsisClassName(value, maxlength) {
  let className = '';
  if (value && value.length >= maxlength) {
    className = 'font-longer-ellipsis'
  }
  return className;
}
