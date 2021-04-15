/*
 * @Author: your name
 * @Date: 2021-02-08 11:09:42
 * @LastEditTime: 2021-03-31 16:49:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /Mars/public/components/dynamic-form/index.tsx
 */
import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  Fragment,
  ReactElement,
  useCallback,
} from 'react';
import { Subject } from 'rxjs';
import { isEqual, cloneDeep } from 'lodash';

interface FiledValue {
  /**
   * @description  表单值
   */
  value: any;
  label: string;
  component: string;
  relay?: string;
  validate?: string;
  ui?: string;
  [attr: string]: any;
}

interface InitValue {
  /**
   * @description  表单值
   */
  [attr: string]: FiledValue;
}
interface LabelProps {
  filedValue: FiledValue;
  Comp:
    | ((props: {
        name: string;
        value: any;
        onChange: Function;
      }) => React.ReactElement)
    | React.ReactElement;
}
interface IDynamicFormProps {
  /**
   * @description  表单值
   */
  initValue: InitValue;
  /**
   * @description  表单UI
   */
  formUI?: { [attr: string]: (props: { isValid: boolean }) => JSX.Element };
  /**
   * @description  组件UI
   */
  fieldUI: { [attr: string]: (props: LabelProps) => JSX.Element };
  /**
   * @description  表单组件映射函数
   */
  mapComponent: {
    [attr: string]: (props: {
      name: string;
      value: any;
      onChange: Function;
    }) => React.ReactElement;
  };
  /**
   * @description  表单依赖映射函数
   */
  mapRelay?: {
    [attr: string]: (
      get: (name: string) => InitValue | FiledValue | null,
      currentFiled: FiledValue,
      updateForm: (val: FiledValue) => void,
    ) => FiledValue;
  };
  /**
   * @description  表单验证映射函数
   */
  mapValidate?: {
    [attr: string]: (v: any) => boolean | string;
  };
}

const DynamicForm = (config: IDynamicFormProps) => {
  const { fieldUI, formUI, mapComponent, mapRelay, mapValidate } = config;

  const form = useRef({
    values: config.initValue,
    relayFileds: {} as any,
  });

  const formState = useRef({
    isValid: false,
  });

  const [, setState] = useState(0);

  const updateRef = useRef<{ [attr: string]: Function }>({});

  const uiRef = useRef({} as { [attr: string]: () => ReactElement });

  const subject = new Subject<string>();

  // 这里必须在dom更新前执行
  useMemo(() => {
    // 预检测，计算各个字段对依赖关系。
    let computeRelay = true;
    while (computeRelay) {
      const initValues = form.current.values;
      computeRelay = false; // 默认不重新计算
      Object.keys(initValues).forEach(key => {
        const currentField = initValues[key];
        const relay =
          mapRelay && currentField.relay
            ? mapRelay[currentField.relay]
            : undefined;

        if (relay) {
          if (typeof relay !== 'function') {
            console.error('依赖配置必须是函数');
            return;
          }

          const newVal = relay(
            name => {
              if (!name || !initValues[name]) {
                console.warn('获取不存在的表单字段');
                return null;
              }
              // 每次调用getFiled函数获取字段信息时，框架判断当前字段对该字段有依赖关系
              if (form.current.relayFileds[key]) {
                form.current.relayFileds[key][name] = true;
              } else {
                form.current.relayFileds[key] = {};
                form.current.relayFileds[key][name] = true;
              }
              return cloneDeep(initValues[name]); // 这里尽量只克隆当前字段配置
            },
            cloneDeep(initValues[key]),
            newVal => {
              initValues[key] = newVal;
              console.log('setstate', key);
              setState(Math.random());
            },
          );

          if (!isEqual(newVal, initValues[key])) {
            console.warn(
              '---检测到表单字段初始化值和依赖关系规则冲突, 将重新计算表单--- \n',
              '字段: ',
              initValues[key].label,
              key,
              '\n',
              '初始值: ',
              initValues[key],
              '\n',
              '依赖计算新值: ',
              newVal,
              '\n',
              '----------------------------------------------------',
            );
            initValues[key] = newVal;
            computeRelay = true; // 存在计算更改的filed则重新计算
          }
        }
      });
    }

    // 创建自定义的表单UI组件
    if (formUI && typeof formUI === 'object') {
      Object.keys(formUI).forEach(key => {
        const UI = formUI[key];
        const ComponentUI = () => {
          const [, update] = useState(0);

          useEffect(() => {
            updateRef.current[key] = update;
          }, []);

          return <UI isValid={formState.current.isValid} />;
        };
        uiRef.current[key] = ComponentUI;
      });
    }
  }, []);

  useEffect(() => {
    const updateFormUI = () => {
      Object.keys(updateRef.current).forEach(key => {
        const update = updateRef.current[key];
        update(Math.random());
      });
    };
    const observeFromState = () => {
      const v = form.current.values;
      const isValid = Object.keys(v).every(
        fieldname => v[fieldname].isvalid === true,
      );
      console.log(isValid);

      if (formState.current.isValid !== isValid) {
        formState.current.isValid = isValid;
        updateFormUI();
      }
    };
    observeFromState();
    subject.subscribe({
      next: () => observeFromState(),
    });
    return () => subject.unsubscribe();
  }, [subject]);

  const Field = ({ name }: { name: string }) => {
    const [, update] = useState(0);
    const timeRef = useRef<any>(null);
    if (!name) {
      console.error('字段缺少 name');
      return <Fragment />;
    }
    const filedConfig = form.current.values[name];
    if (!filedConfig) {
      console.error(`表单字段${name}配置不存在`);
      return <Fragment />;
    }
    const validate =
      filedConfig.validate && mapValidate
        ? mapValidate[filedConfig.validate]
        : undefined;
    const Comp = mapComponent[filedConfig.component];
    const relay =
      filedConfig.relay && mapRelay ? mapRelay[filedConfig.relay] : undefined;

    if (!Comp) {
      console.error(`没有为字段${name}配置对应的组件`);
      return <Fragment />;
    }

    // 每次render当前字段都计算valid状态
    const filedValue = form.current.values[name];
    if (validate && typeof validate === 'function') {
      const res = validate(filedValue.value);
      filedValue.isvalid = res === true;
      filedValue.errMsg = res === true ? '' : res;
    } else {
      filedValue.isvalid = true;
      filedValue.errMsg = '';
    }

    useEffect(() => {
      if (relay) {
        // 有依赖关系才订阅
        // 设置了依赖函数的字段才订阅消息
        subject.subscribe({
          // 订阅其它字段更新表单内容后的消息，获取最新状态的整体表单
          next: key => {
            const relayConfig = form.current.relayFileds[name]; // 找到自己的依赖
            if (relayConfig && relayConfig[key] && key !== name) {
              // 只处理和自己有依赖关系的字段的消息，不处理自己广播出去又被自己收到的消息
              const formValues = form.current.values;
              const newVal = relay(
                targetName => cloneDeep(formValues[targetName]),
                cloneDeep(formValues[name]),
                newVal => {
                  form.current.values[name] = newVal;
                  setState(Math.random());
                },
              );

              if (!isEqual(newVal, formValues[name])) {
                // 监听当前表单字段更新，只重新render当前字段
                form.current.values[name] = newVal;
                if (!filedConfig.hide) {
                  console.log(newVal);
                  // 在没有解除自身隐藏状态前不参与任何联动计算，只更新自己的值
                  update(Math.random());
                  subject.next(name);
                }
              }
            }
          },
        });
      }
    }, []);

    if (filedConfig.hide === true) {
      return <Fragment />;
    }

    const onChange = (value: any) => {
      const isvalid =
        validate && typeof validate === 'function' ? validate(value) : true;
      const filed = form.current.values[name];
      form.current.values[name] = { ...filed, isvalid, value };
      update(Math.random());

      if (filedConfig.debounce) {
        // 这里开启防抖
        if (typeof filedConfig.debounce !== 'number') {
          filedConfig.debounce = 200;
        }
        if (timeRef.current) {
          clearTimeout(timeRef.current);
        }
        timeRef.current = setTimeout(() => {
          subject.next(name); // 当前字段发生变更，向全局广播此次变更
          clearTimeout(timeRef.current);
          timeRef.current = null;
        }, filedConfig.debounce);
      } else {
        subject.next(name); // 当前字段发生变更，向全局广播此次变更
      }
    };

    const FiledLabel = fieldUI[filedConfig.ui ? filedConfig.ui : 'default'];
    if (FiledLabel) {
      return (
        <FiledLabel
          Comp={
            <Comp
              name={name}
              value={form.current.values[name].value}
              onChange={onChange}
            />
          }
          filedValue={form.current.values[name]}
        />
      );
    } else {
      return (
        <Comp
          name={name}
          value={form.current.values[name].value}
          onChange={onChange}
        />
      );
    }
  };

  const getValues = () => {
    return form.current.values;
  };

  const getFormState = () => {
    return formState.current;
  };

  return {
    Field,
    getValues,
    formUI: uiRef.current,
    getFormState,
  };
};

export function InitValue(props: {
  /**
   * @description  表单值
   */
  keyString: FiledValue;
}) {}

export function FiledValue(props: {
  /**
   * @description  字段值
   */
  value: any;
  /**
   * @description  字段名
   */
  label: string;
  /**
   * @description  组件名
   */
  component: string;
  /**
   * @description  依赖函数名
   */
  relay?: string;
  /**
   * @description  验证函数名
   */
  validate?: string;
  /**
   * @description  自定义字段名
   */
  keyString?: string;
}) {}

export function LabelProps(props: {
  /**
   * @description  表单值
   */
  filedValue: FiledValue;
  /**
   * @description  表单组件
   */
  Comp:
    | ((props: {
        name: string;
        value: any;
        onChange: Function;
      }) => React.ReactElement)
    | React.ReactElement;
}) {}

export default DynamicForm;
