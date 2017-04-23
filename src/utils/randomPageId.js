import _ from 'lodash';

const LETTERS = 'abcdefghijklmnopqrstuvwxyz1234567890';
const randomPageId = (num = 8) => {
  const letters = _.range(num).map(() => {
    const index = _.random(0, LETTERS.length);
    return LETTERS[index];
  });
  return letters.join('');
};

export default randomPageId;