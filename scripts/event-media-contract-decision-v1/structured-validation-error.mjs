export class EventMediaValidationError extends Error {
  constructor(code, stage, record, pointer, diagnostic) {
    super(`${code}: ${stage}: ${record}: ${pointer}: ${diagnostic}`);
    this.name = 'EventMediaValidationError';
    this.code = code;
    this.stage = stage;
    this.record = record;
    this.path = pointer;
    this.diagnostic = diagnostic;
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      stage: this.stage,
      record: this.record,
      path: this.path,
      diagnostic: this.diagnostic,
    };
  }
}

export const fail = (code, stage, record, pointer, diagnostic) => {
  throw new EventMediaValidationError(code, stage, record, pointer, diagnostic);
};

export const requireValue = (condition, code, stage, record, pointer, diagnostic) => {
  if (!condition) fail(code, stage, record, pointer, diagnostic);
};
