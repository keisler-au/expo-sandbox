export interface RootStackParamList {
  Home: undefined;
  Publish: { game: string[] };
  Play: { game: Game; player: Player };
}

export interface Player {
  id: number;
  name: string;
}

export interface Game {
  id: number;
  code: string;
  title: string;
  players: Player[];
  tasks: Task[][];
  lastSaved?: number;
}

export interface Task {
  [key: string]: any;
  id: number;
  last_updated: string;
  value: string;
  completed: boolean;
  completed_by: Player;
  displayText?: string;
  displayType?: string;
  game_id: number;
  grid_column: number;
  grid_row: number;
}

export interface FixtureGames {
  [key: string]: string[][];
}

export default {};
