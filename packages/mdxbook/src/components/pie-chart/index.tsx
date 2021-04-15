import React from 'react';

export interface IPieChartProps {
  /**
   * @description       配置信息
   */
  opt?: IOpt;
  /**
   * @description       饼状图数据
   */
  data?: IData;
  /**
   * @description       是否加载中
   */
  loading?: boolean;
  /**
   * @description       选中回调
   */
  onSectorClick?: Function;
  /**
   * @description
   */
  onTailToggle?: Function;
}

export interface IData {
  /**
   * @description       标签名称
   */
  label: string;
  /**
   * @description       值
   */
  value: number;
}

export interface IOpt {
  /**
   * @description       字体大小
   * @default      11
   */
  fontSize: number;
  /**
   * @description       字体颜色
   * @default      '#000'
   */
  fontColor: string;
  /**
   * @description       环形图
   * @default      false
   */
  isDount: boolean;
  /**
   * @description       内圆半径占外圆的百分比
   * @default      0.5
   */
  innerRaduis: number;
  /**
   * @description       内圆填充颜色
   * @default      '#ffffff'
   */
  innerCircleColor: string;
  /**
   * @description       内圆border color
   * @default      '#ffffff'
   */
  innerCircleBorderColor: string;
  /**
   * @description       内圆border color
   * @default      2
   */
  innerCircleBorderWidth: number;
  /**
   * @description       border
   * @default      false
   */
  showBorder: boolean;
  /**
   * @description       border color
   * @default      '#fff'
   */
  borderColor: string;
  /**
   * @description       border width
   * @default      2
   */
  borderWidth: number;
  /**
   * @description       是否显示label
   * @default      true
   */
  showlabel: boolean;
  /**
   * @description       是否显示label文本与扇形直接的连接线，showLabelTogether为true时无效
   * @default      true
   */
  showlabelLine: boolean;
  /**
   * @description
   * @default      1
   */
  labelLineWith: number;
  /**
   * @description       饼图与label水平排列时饼图宽度比例
   * @default      0.5
   */
  pieAreaWith: number;
  /**
   * @description
   * @default      "<%=label%> <%=value%>"
   */
  labelTemplate: string;
  /**
   * @description       显示原数值 eg：其它 3
   * @default      true
   */
  showOrignalValue: boolean;
  /**
   * @description       true：label显示计算出来的百分比 false 显示原data.value  eg：其它 3 1.6%
   * @default      true
   */
  labelUsePercent: boolean;
  /**
   * @description
   * @default      '#19a6ef'
   */
  labelColor: string;
  /**
   * @description       label占据的位置 算半径需要减去它
   * @default      0.25
   */
  labelLineOffset: number;
  /**
   * @description       labelLine与饼图,labelLine与label文本间距
   * @default      5
   */
  labelLinePointOffset: number;
  /**
   * @description
   * @default      Math.PI*2
   */
  totalAngle: number;
  /**
   * @description       扇形是否可以点击
   * @default      true
   */
  enableClick: boolean;
  /**
   * @description       点击扇形弹出距离
   * @default      0
   */
  pullOutDistance: number;
  /**
   * @description       每一块饼的颜色
   * @default      ['#19a6ef','#ffc000','#47c720','#ff8421','#c637ef','#5645f8','#65f2ff','#47e89a','#f5409e','#f4f222','#8840f5','#ef5050']
   */
  colors: Array<string>;
  /**
   * @description
   * @default      'h'
   */
  layout: string;
  /**
   * @description
   * @default      ''
   */
  labelItemClassName: string;
  /**
   * @description
   * @default      ''
   */
  pieAreaClassName: string;
  /**
   * @description       标签是否可折叠，如果不传该值，则标签列表有固定高度且可滚动
   * @default      false
   */
  enableLabelCollapse: boolean;
  /**
   * @description       标签是否可折叠，如果不传该值，则标签列表有固定高度且可滚动
   * @default      3
   */
  headLabelNum: number;
}

export function IPieChartProps(props: IPieChartProps) {
  return null;
}

export function IData(props: IData) {
  return null;
}

export function IOpt(props: IOpt) {
  return null;
}
