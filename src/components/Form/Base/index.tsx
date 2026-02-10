//
//  index.tsx
//
//  The MIT License
//  Copyright (c) 2021 - 2026 O2ter Limited. All rights reserved.
//
//  Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to deal
//  in the Software without restriction, including without limitation the rights
//  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//  copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.
//

import _ from 'lodash';
import { ElementNode, useFormState, useState } from 'frosty';
import { FormState } from './types';
import { FormContext, FormInternalContext } from './context';

type FormProps<Values> = {
  initialValues?: Values;
  disabled?: boolean;
  activity?: boolean | { actions?: string[]; delay?: number; };
  validate?: (value: any, path?: string) => Error[];
  validateOnMount?: boolean;
  onReset?: (state: FormState) => void;
  onChange?: (state: FormState) => void;
  onChangeValues?: (state: FormState) => void;
  onAction?: (action: string, state: FormState) => void;
  onSubmit?: (values: Record<string, any>, state: FormState) => void;
  onError?: (error: Error, state: FormState & { preventDefault: VoidFunction; }) => void;
  onLoading?: (action: string, task: Promise<void>, state: FormState) => void;
  children?: ElementNode | ((state: FormState) => ElementNode);
};

export const FormBase = <Values extends object>({
  initialValues,
  disabled,
  activity,
  validate,
  validateOnMount,
  onReset,
  onChange,
  onChangeValues,
  onAction,
  onSubmit,
  onError,
  onLoading,
  children,
}: FormProps<Values>) => {

  const [touched, setTouched] = useState<true | Record<string, boolean>>(validateOnMount ? true : {});
  const state = useFormState<Partial<Values>>({
    initialValues: initialValues ?? {},
    activity,
    callback: async(action, state, error) => {
      switch (action) {
        case 'submit': {
        } break;
        case 'reset': {
        } break;
        case 'error': {
        } break;
        default: {
        } break;
      }
    },
  });

};
