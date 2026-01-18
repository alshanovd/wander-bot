export interface Robot {
  positionX: number;
  positionY: number;
  direction: RobotDirection;
}

export enum RobotDirection {
  North,
  South,
  West,
  East,
}
