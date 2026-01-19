import { RobotDirection } from "@robot/robot-model";

export const DIRECTIONS = {
  north: RobotDirection.North,
  east: RobotDirection.East,
  south: RobotDirection.South,
  west: RobotDirection.West,
} as const;

export type DirectionName = keyof typeof DIRECTIONS;

export const getDirectionName = (dir: RobotDirection): DirectionName | null => {
  for (const key in DIRECTIONS) {
    const typedKey = key as DirectionName;
    if (DIRECTIONS[typedKey] === dir) {
      return typedKey;
    }
  }
  return null;
};

// const DIRECTIONS = {
//   NORTH: RobotDirection.North,
//   EAST: RobotDirection.East,
//   SOUTH: RobotDirection.South,
//   WEST: RobotDirection.West,
// } as const;
