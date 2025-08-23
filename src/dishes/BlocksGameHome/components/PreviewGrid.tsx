import React, { useMemo } from 'react';
import {
    useDerivedValue
} from 'react-native-reanimated';
import gameManager from '../core/managers/GameManager';
import { validateDrop } from '../core/utils';
import { useUIBinder } from '../hooks/useUIBinder';
import PreviewBlock from './PreviewBlock';

const PreviewGrid: React.FC = () => {
  const {matrix, blockSize, occupancyMatrix} = useUIBinder(
    gameManager.getBoardManager(),
  );
  const {selectedShapeMetaSV, currentDropCellSV} = useUIBinder(
    gameManager.getDropManager(),
  );

  const numRows = matrix.length;
  const numCols = matrix[0]?.length || 0;

  const isInvalidDropSV = useDerivedValue(()=>{
    const isValidDrop = validateDrop(
            occupancyMatrix,
            selectedShapeMetaSV,
            currentDropCellSV,
          );
    return !isValidDrop;
  })


  const previewBlocks = useMemo(() => {
    const blocks = [];
    for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
      for (let colIndex = 0; colIndex < numCols; colIndex++) {
        blocks.push(
          <PreviewBlock
            key={`${rowIndex}-${colIndex}`}
            row={rowIndex}
            col={colIndex}
            blockSize={blockSize}
            selectedShapeMetaSV={selectedShapeMetaSV}
            currentDropCellSV={currentDropCellSV}
            isInvalidDropSV={isInvalidDropSV}
          />,
        );
      }
    }
    return blocks;
  }, [
    numRows,
    numCols,
    blockSize,
    selectedShapeMetaSV,
    currentDropCellSV,
    isInvalidDropSV,
  ]);

  return <>{previewBlocks}</>;
};

export default React.memo(PreviewGrid);
