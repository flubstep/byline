// Note: This is unused

import _ from 'lodash';
import uuidV4 from 'uuid/v4';

const initialPage = {
  title: 'Your new page',
  items: []
};

const page = (state = initialPage, action) => {
  switch (action.type) {
    case 'UPDATE_TITLE':
      return {
        ...state,
        title: action.title
      };
    case 'ADD_ITEM':
    case 'REMOVE_ITEM':
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: items(state.items, action)
      };
    default:
      return state;
  }
};

const items = (state = [], action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      let key = uuidV4();
      let newItem = {...action.item, key};
      return [...state, newItem];
    case 'REMOVE_ITEM':
      return state.filter(item => item.key !== action.item.key);
    case 'UPDATE_ITEM':
      return state.map(item => (
        item.key === action.item.key ? action.item : item
      ));
    default:
      return state;
  }
};

export {
  page,
  items
};
