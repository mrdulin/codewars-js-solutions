const queryString = require('query-string');

const getHashQuery = hash => {
  const hashQueryString = hash.split('?')[1];
  const queryParameter = hashQueryString ? queryString.parse(`?${hashQueryString}`) : {};
  return queryParameter;
};

const dimensionMap = {
  DEPT: '1',
  DOC: '2'
};

// url中存在换行符\n和回车符\r导致的问题
const url = 'http://www.test.pajk.cn/budapest/#/customer/home?dimension=DEPT\n\r&bizId=21864930705';
const query = getHashQuery(url);
console.log(JSON.stringify(query, null, 4));

const { dimension } = query;
console.log('dimension: ', JSON.stringify(dimension));
const dimensionNum = dimensionMap[dimension];
console.log('dimensionNum: ', dimensionNum);

// 正确的url
const urlNormal = 'http://www.test.pajk.cn/budapest/#/customer/home?dimension=DEPT&bizId=21864930705';
const queryNormal = getHashQuery(urlNormal);
console.log(JSON.stringify(queryNormal, null, 4));
console.log('dimension normal: ', JSON.stringify(queryNormal.dimension));
console.log('dimensionNum normal: ', JSON.stringify(dimensionMap[queryNormal.dimension]));
