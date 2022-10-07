export class HttpStatus {
  constructor(public readonly code: number, public readonly text?: string) {}

  toString() {
    return this.text ? `${this.code} - ${this.text}` : this.code.toString();
  }
}
