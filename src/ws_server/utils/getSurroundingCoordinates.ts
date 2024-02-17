type CoordinationType = number[];

export const getSurroundingCoordinates = (shipCoordinates: CoordinationType[]) => {
  const surroundingCoords: Set<string> = new Set();

  shipCoordinates.forEach((coord) => {
    const [x, y] = coord;

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const newX = x + dx;
        const newY = y + dy;

        if (dx === 0 && dy === 0) continue;

        surroundingCoords.add(`${newX},${newY}`);
      }
    }
  });

  shipCoordinates.forEach((coord) => {
    const coordStr = coord.join(',');
    surroundingCoords.delete(coordStr);
  });

  // Преобразуем набор обратно в массив координат
  return Array.from(surroundingCoords).map((coord) => coord.split(',').map(Number));
};
