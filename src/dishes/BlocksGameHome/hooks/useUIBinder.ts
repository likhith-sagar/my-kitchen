import {useEffect, useRef, useState} from 'react';
import {UIBinder} from '../core/base/UIBinder';

// TODO: change types (currently it's not working as expected)

const simpleExtractor = <T>(data: T) => data;

const simpleComparator = <T>(a: T, b: T): boolean => a === b;

export function useUIBinder<U extends UIBinder<any>>(
  instance: U,
  extractor = simpleExtractor<U extends UIBinder<infer T> ? T : never>,
  comparator = simpleComparator,
) {
  type InferredExtractType = ReturnType<typeof extractor>;
  type InferredDataType = U extends UIBinder<infer T> ? T : never;

  const [data, setData] = useState<InferredExtractType>(() =>
    extractor(instance.getData()),
  );

  const helperRef = useRef({extractor, comparator});
  helperRef.current = {extractor, comparator};

  useEffect(() => {
    setData(helperRef.current.extractor(instance.getData()));

    const listener = (newData: InferredDataType) => {
      const extractedNewData = helperRef.current.extractor(newData);
      setData((currentData: InferredExtractType) => {
        if (helperRef.current.comparator(currentData, extractedNewData)) {
          return currentData;
        }
        return extractedNewData;
      });
    };

    const listenerId = instance.addChangeListener(listener);

    return () => {
      instance.removeChangeListener(listenerId);
    };
  }, [instance]);

  return data as InferredExtractType;
}
