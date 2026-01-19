export abstract class BaseAlert {
  abstract info(text: string): void;
  abstract error(text: string): void;
  abstract warning(text: string): void;
}
