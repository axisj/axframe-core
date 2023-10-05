/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";

export function useDidMountEffect(fn: React.EffectCallback): void {
  React.useEffect(() => {
    fn();
  }, []);
}
