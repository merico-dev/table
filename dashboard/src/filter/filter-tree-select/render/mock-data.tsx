export function generateData(x = 3, y = 2, z = 1, gData = []) {
  function _loop(_level: number, _preKey?: string, _tns?: any[]) {
    const preKey = _preKey || '0';
    const tns = _tns || gData;

    const children = [];
    for (let i = 0; i < x; i++) {
      const key = `${preKey}-${i}`;
      tns.push({
        label: `${key}-label----------------label`,
        value: `${key}-value`,
        key,
        disabled: key === '0-0-0-1' || false,
      });
      if (i < y) {
        children.push(key);
      }
    }
    if (_level < 0) {
      return tns;
    }
    const __level = _level - 1;
    children.forEach((key, index) => {
      tns[index].children = [];
      return _loop(__level, key, tns[index].children);
    });

    return null;
  }
  _loop(z);
  console.log(gData);
  return gData;
}
