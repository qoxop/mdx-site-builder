import React from 'react';

export interface IBarChartProps {
  /**
   * @description       配置信息
   */
  opt?: IOpt;
  /**
   * @description       柱状图数据
   */
  data?: Array<IData>;
  /**
   * @description       选中回调
   */
  onSelect?: (index: number, data: IData) => void;
  /**
   * @description       维度切换回调
   */
  onDimensionChange?: Function;
  /**
   * @description       移动到边缘的回调
   */
  onToEdge?: Function;
  /**
   * @description       选中元素index
   */
  selectedIndex?: number;
  /**
   * @description       柱状图总数
   */
  total?: number;
  /**
   * @description       图标描述
   */
  barDesc?: string;
  /**
   * @description       图标描述字体颜色
   */
  barDescColor?: string;
  /**
   * @description       不清楚
   */
  dimension?: string;
  /**
   * @description       是否加载中
   */
  loading: boolean;
  /**
   * @description       是否显示折线描述
   */
  showPolyLineDesc?: boolean;
  /**
   * @description       是否显示柱状图
   */
  showBar?: boolean;
  /**
   * @description       是否显示折线图
   */
  showLine?: boolean;
  /**
   * @description       渲染柱状图文字
   */
  renderBarText?: Function;
  /**
   * @description       多行维度文字大小
   */
  multiDimensionFontSize?: number;
}

export interface IData {
  id: string;
  label: string;
  value: number;
}

export interface IOpt {
  /**
   * @description       x轴距离底部高度
   * @default 40
   */
  xAxisBottom?: number;
  /**
   * @description       x轴线宽
   * @default 1
   */
  xAxisStrokeWidth?: number;
  /**
   * @description       x轴字体大小
   * @default 11
   */
  xAxisFontSize?: number;
  /**
   * @description       坐标label间隔
   * @default 8
   */
  axisLabelSpace?: number;
  /**
   * @description       x轴颜色
   * @default '#71cfff'
   */
  horizontalAxisColor?: string;
  /**
   * @description       柱状图top
   * @default 40
   */
  barChartTop?: number;
  /**
   * @description       柱状图bottom
   * @default 30
   */
  barChartBottom?: number;
  /**
   * @description       图距离两边距离
   * @default 40
   */
  barChartMargin?: number;
  /**
   * @description       柱宽度
   * @default 33
   */
  barWidth?: number;
  /**
   * @description       柱间隔
   * @default 12
   */
  barSpace?: number;
  /**
   * @description       柱颜色
   * @default '#aae2ff'
   */
  barColorDefault?: string;
  /**
   * @description       柱选中颜色
   * @default '#71cfff'
   */
  barColorSelected?: string;
  /**
   * @description       折线时,柱值小于折线值
   * @default '#ffeb99'
   */
  barColorUntarget?: string;
  /**
   * @description       柱背景色
   * @default '#f2fbff'
   */
  barBgColor?: string;
  /**
   * @description       柱border颜色
   * @default 'transparent'
   */
  barBorderColor?: string;
  /**
   * @description       柱border颜色
   * @default 5
   */
  barDescSpace?: number;
  /**
   * @description       描述颜色
   * @default '#999'
   */
  descColor?: string;
  /**
   * @description       图表描述字体颜色
   * @default '#999'
   */
  barDescColor?: string;
  /**
   * @description
   * @default '#19A6EF'
   */
  arrowColor?: string;
  /**
   * @description
   * @default '#ddd'
   */
  disableColor?: string;
  /**
   * @description       字体大小
   * @default 11
   */
  fontSize?: number;
  /**
   * @description       字体颜色
   * @default '#222'
   */
  fontColor?: string;
  /**
   * @description       背景色
   * @default '#fff'
   */
  bgColor?: string;
  /**
   * @description       皮肤颜色
   * @default '#19a6ef'
   */
  skinColor?: string;
  /**
   * @description       折线颜色
   * @default '#3a9cce'
   */
  polylineColor?: string;
  /**
   * @description       是否显示折线描述
   * @default true
   */
  showPolyLineDesc?: boolean;
  /**
   * @description       是否显示柱状图
   * @default true
   */
  showBar?: boolean;
  /**
   * @description       是否显示柱状图
   * @default true
   */
  showLine?: boolean;
  /**
   * @description       年分割线
   * @default ''
   */
  yearSplitColor?: string;
  /**
   * @description       时间维度
   * @default ['day','week','month','season','year']
   */
  timeDimensions?: Array<string>;
  /**
   * @description       初始选中维度
   * @default 'month'
   */
  timeDimension?: string;
  /**
   * @description       是否显示维度切换按钮
   * @default true
   */
  showDimenstion?: boolean;
  /**
   * @description       多行维度文字大小
   * @default 12
   */
  multiDimensionFontSize?: number;
}

export function BarCHarProps(props: IBarChartProps) {
  return <>Hello World</>;
}

export function IData(props: IData) {
  return <>Hello World</>;
}

export function IOpt(props: IOpt) {
  return <>Hello World</>;
}
