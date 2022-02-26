interface ErrorHandler {
  (err: Error): any;
}
interface TimeResult {
  EVENT_ID: number;
  Duration: string;
  SQL_TEXT: string;
}

export interface TestFunction {
  (query: string, errorHandler?: ErrorHandler): Promise<{ queryResult: any[]; timeResult: TimeResult[] }>;
}

export function setMysql(): Promise<void>;
export function createTest(): Promise<TestFunction>;
