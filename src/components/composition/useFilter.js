import $router from '@/router'
export default () => {
  const targetRentAmount = (val) => {
    val = val || 0;
    const money = val.toString().replace(/\d+/, n => {
      return n.replaceAll(/(\d)(?=(\d{3})+$)/g, $1 => {
        return $1 + ',';
      });
    });
    return money;
  }
  const formatMoney = (str, n) => {
    n = n > 0 && n <= 20 ? n : 2;
    str = parseFloat((str + '').replace(/[^\d.-]/g, ''));
    if (isNaN(str)) return '--';
    str = str.toFixed(n) + '';
    const intValue = targetRentAmount(str.split('.')[0]);
    const floatValue = str.split('.')[1];
    return '$' + `${intValue}.${floatValue}`;
  }
  const openPageInNewTab = (name, params, query) => {
    const url = $router.resolve({ name, params, query });
    window.open(url.href, '_blank');
  }
  const calcChangedSubtotal = (qty, price) => {
    return qty * price || 0;
  }

  return {
    targetRentAmount,
    formatMoney,
    openPageInNewTab,
    calcChangedSubtotal
  }
}
