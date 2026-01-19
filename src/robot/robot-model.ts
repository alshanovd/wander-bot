export interface Robot {
  x: number;
  y: number;
  direction: RobotDirection;
}

export enum RobotDirection {
  North,
  East,
  South,
  West,
}
