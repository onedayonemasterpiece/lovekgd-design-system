export class ClosureValidationError extends Error {
  constructor(code, stage, record, pointer, diagnostic) {
    super(diagnostic);
    this.name = 'ClosureValidationError';
    this.code = code;
    this.stage = stage;
    this.record = record;
    this.pointer = pointer;
    this.diagnostic = diagnostic;
  }
  toJSON() { return { name: this.name, code: this.code, stage: this.stage, record: this.record, path: this.pointer, diagnostic: this.diagnostic }; }
}
export const reject = (code, stage, record, pointer, diagnostic) => { throw new ClosureValidationError(code, stage, record, pointer, diagnostic); };
export const demand = (condition, code, stage, record, pointer, diagnostic) => { if (!condition) reject(code, stage, record, pointer, diagnostic); };
