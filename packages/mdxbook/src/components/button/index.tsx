import React, { Children, useMemo, isValidElement } from 'react';

export interface IButtonProps {
  /**
   * @description       按钮类型
   * @default           'primary'
   */
  type: 'primary' | 'minor' | 'disable' | 'warning';
  /**
   * @description       按钮大小
   * @default           'primary'
   */
  size: 'default' | 'mid' | 'sm';
  /**
   * @description       点击事件处理函数
   */
  onClick?: React.MouseEventHandler;
  /**
   * @description       额外的className
   */
  className?: string;
  /**
   * @description       自定义按钮样式
   */
  style?: React.CSSProperties;
  /**
   * @description       按钮内容
   */
  children: React.ReactChild;
}

export interface IButtonGroupProps {
  /**
   * @description       额外的样式名
   * @default
   */
  className?: string; // 支持识别 TypeScript 可选类型为非必选属性
  /**
   * @description       children 只能是 ActionBtn 或 Button
   */
  children: React.ReactChild;
}

export interface IActionBtnProps {
  /**
   * @description       动作按钮文本
   */
  text: string;
  /**
   * @description       动作按钮图标
   */
  icon: React.ReactElement;
  /**
   * @description       点击事件处理函数
   */
  onClick?: React.MouseEventHandler;
}

export function ActionBtn(props: IActionBtnProps) {
  return (
    <div className="action-item" onClick={props.onClick}>
      <div className="action-icon">{props.icon}</div>
      <div className="action-text">
        <div className="text-hide-1">{props.text}</div>
      </div>
    </div>
  );
}

export function ButtonGroup(props: IButtonGroupProps) {
  const { className = '', children } = props;
  const { actions, btns } = useMemo(() => {
    const actions: React.ReactElement[] = [];
    const btns: React.ReactElement[] = [];
    Children.forEach(children, child => {
      if (isValidElement(child)) {
        if (child.type === Button) {
          child.props;
          btns.push(child);
        } else if (child.type === ActionBtn) {
          actions.push(child);
        } else {
          console.warn('无效元素');
        }
      }
    });
    return {
      actions,
      btns,
    };
  }, [children]);
  return (
    <div className={`o-button-box flexbox align-end ${className}`}>
      {!!actions.length && <div className="action-box flex-1">{actions}</div>}
      {btns.map((item, index) => (
        <div key={`${item.key}-${index}`} className="flex-1">
          {item}
        </div>
      ))}
    </div>
  );
}

function Button(props: IButtonProps) {
  const { type, size, onClick, className, children, style } = props;
  const btnCls = size === 'default' ? 'o-button' : `o-button-${size}`;
  return (
    <button
      className={`${btnCls} ${type} ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

Button.defaultProps = {
  type: 'primary',
  size: 'default',
};

export default Button;
