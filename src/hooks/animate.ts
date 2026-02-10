//
//  animate.ts
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
import { useRef, useState, useCallback } from 'frosty';

/**
 * Options for configuring the animation.
 * 
 * @property fromValue - The starting value of the animation. Defaults to the current value.
 * @property toValue - The target value of the animation.
 * @property duration - The duration of the animation in milliseconds.
 * @property easing - An optional easing function to control the animation's progress. Defaults to a linear function.
 * @property delay - An optional delay (in milliseconds) before the animation starts. Defaults to `0`.
 * @property onCompleted - An optional callback function invoked when the animation completes or is stopped.
 */
type AnimateOptions = {
  fromValue?: number;
  toValue: number;
  duration: number;
  easing?: (value: number) => number;
  delay?: number;
  onCompleted?: (result: {
    value: number;
    finished: boolean;
  }) => void;
};

/**
 * Options for interpolating a value.
 * 
 * @property inputRange - A tuple specifying the input range for interpolation.
 * @property outputRange - A tuple specifying the output range for interpolation.
 */
type InterpolateOptions = {
  inputRange: [number, number];
  outputRange: [number, number];
};

/**
 * Represents an interpolated value and provides a method to further interpolate it.
 * 
 * @property value - The interpolated value.
 * @property interpolate - A function to interpolate the current value based on new input and output ranges.
 */
type AnimatedInterpolation = {
  value: number;
  interpolate: ({ inputRange, outputRange }: InterpolateOptions) => AnimatedInterpolation;
};

const interpolate = (value: number) => ({ inputRange, outputRange }: InterpolateOptions): AnimatedInterpolation => {
  const [inputMin, inputMax] = inputRange;
  const [outputMin, outputMax] = outputRange;

  // Safeguard against division by zero
  if (inputMax === inputMin) {
    throw new Error('Input range must have distinct values.');
  }

  const t = (value - inputMin) / (inputMax - inputMin);
  const interpolatedValue = outputMin + t * (outputMax - outputMin);
  return {
    value: interpolatedValue,
    interpolate: interpolate(interpolatedValue),
  };
};

/**
 * A hook to manage animations with support for starting, stopping, and interpolating values.
 * 
 * @param initialValue - The initial value of the animation.
 * 
 * @returns An object containing:
 * - `value`: The current animated value.
 * - `stop`: A function to stop the animation.
 * - `start`: A function to start the animation with specified options.
 * - `interpolate`: A function to interpolate the current value based on input and output ranges.
 */
export const useAnimate = (initialValue: number) => {
  const [value, setValue] = useState(initialValue);
  const ref = useRef<{
    interval: ReturnType<typeof setInterval>;
    callback?: AnimateOptions['onCompleted'];
  }>();
  const _stop = () => {
    const { interval, callback } = ref.current ?? {};
    ref.current = undefined;
    if (interval) clearInterval(interval);
    return callback;
  };
  const stop = useCallback(() => {
    const callback = _stop();
    if (_.isFunction(callback)) callback({ value, finished: false });
  });
  const start = useCallback(({
    fromValue = value,
    toValue,
    duration,
    easing = (x) => x,
    delay = 0,
    onCompleted,
  }: AnimateOptions) => {
    _stop();
    const start = Date.now();
    if (duration > 0) {
      ref.current = {
        interval: setInterval(() => {
          const t = (Date.now() - start) / duration - delay;
          if (t >= 1) {
            clearInterval(ref.current?.interval);
            ref.current = undefined;
            setValue(toValue);
            if (_.isFunction(onCompleted)) onCompleted({ value: toValue, finished: true });
          } else if (t >= 0) {
            setValue((toValue - fromValue) * easing(_.clamp(t, 0, 1)) + fromValue);
          }
        }, 16),
        callback: onCompleted,
      }
    }
  });
  return {
    value,
    stop,
    start,
    interpolate: interpolate(value),
  };
}