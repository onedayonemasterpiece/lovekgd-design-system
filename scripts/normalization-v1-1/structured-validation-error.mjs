export class NormalizationValidationError extends Error {
  constructor({ code, stage, record, path, diagnostic }) {
    super(diagnostic);
    this.name = 'NormalizationValidationError';
    this.code = code;
    this.stage = stage;
    this.record = record;
    this.path = path;
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

export const rejectNormalization = (details) => {
  throw new NormalizationValidationError(details);
};

export const requireNormalization = (condition, details) => {
  if (!condition) rejectNormalization(details);
};

export const structuredValidationError = (error) => {
  if (!(error instanceof NormalizationValidationError)) throw error;
  return error.toJSON();
};
