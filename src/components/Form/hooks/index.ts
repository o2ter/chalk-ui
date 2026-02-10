//
//  index.ts
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

import _ from "lodash";
import { SetStateAction, useCallback, useContext, useEffect, useMemo } from "frosty";
import { FormContext, FormInternalContext } from "../Base/context";
import { useFormGroup } from "../Group";
import { uniqueId } from "frosty/_native";

export const useForm = () => ({
  ...useContext(FormContext),
  groupPath: useFormGroup(),
});

export const useField = (name: string | string[]) => {

  const formState = useForm();
  const { roles, disabled, values, setValue, validate, touched, setTouched, submit, reset, refresh, groupPath } = formState;
  const path = [...groupPath, ..._.toPath(name)].join('.');
  const value = _.get(values, path);

  const onChange = useCallback((value: SetStateAction<any>) => setValue(path, value));
  const _setTouched = useCallback(() => setTouched(path));

  const { extraError, setExtraError } = useContext(FormInternalContext);

  const uniqId = useMemo(() => uniqueId(), []);
  useEffect(() => { return () => setExtraError(uniqId); }, []);

  const useValidator = useCallback((
    validator?: (value: any) => void
  ) => {
    useEffect(() => {
      try {
        validator?.(value);
        setExtraError(uniqId, undefined);
      } catch (e) {
        setExtraError(uniqId, e as Error);
      }
    }, [value]);
  });

  return {
    value,
    form: formState,
    roles,
    disabled,
    get error() { return _.compact([...validate(values, path), extraError(uniqId)]); },
    get touched() { return touched(path); },
    setTouched: _setTouched,
    useValidator,
    onChange,
    submit,
    reset,
    refresh,
  };
};
