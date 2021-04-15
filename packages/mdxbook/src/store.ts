import { configureStore, combineReducers, Reducer } from '@reduxjs/toolkit';

/** 动态插入的 reducer */
const asyncReducers:{
    [k:string]:Reducer;
} = {};

const store = configureStore({
  reducer: combineReducers({}),
});

/**
 * 用于异步加载的模块动态插入reducer
 * @param reducers
 */
export function mergeReducer(reducers:Array<{
    key:string;
    reducer:Reducer;
}> | {
    key:string;
    reducer:Reducer;
}):void {
  let hasNew = false;
  if (reducers instanceof Array) {
    reducers.forEach((item) => {
      const { key, reducer } = item;
      if (!!key && !!reducer && !asyncReducers[key]) {
        hasNew = true;
        asyncReducers[key] = reducer;
      }
    });
  }
  else {
    const { key, reducer } = reducers;
    if (!!key && !!reducer && !asyncReducers[key]) {
      hasNew = true;
      asyncReducers[key] = reducer;
    }
  }
  if (hasNew) {
    store.replaceReducer(combineReducers({
      ...asyncReducers,
    }));
  }
}
export type AppDispatch = typeof store.dispatch;
/**
 * 全局 state 类型,
 * ReturnType<typeof rootReducer> 为同步
 * 里面的为异步
 */
export interface RootState {
    [k:string]:any;
}
export default store;
