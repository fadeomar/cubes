function XO(str) {
  const lowerStr = str.toLowerCase();
  const xCount = (lowerStr.match(/x/g) || []).length;
  const oCount = (lowerStr.match(/o/g) || []).length;
  return xCount === oCount;
}
