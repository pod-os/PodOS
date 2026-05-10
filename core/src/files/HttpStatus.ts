export class HttpStatus {
  readonly code: number;
  readonly text?: string;

  constructor(code: number, text?: string) {
    this.code = code;
    this.text = text;
  }

  toString() {
    return this.text ? `${this.code} - ${this.text}` : this.code.toString();
  }
}
