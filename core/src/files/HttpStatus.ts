export class HttpStatus {
  constructor(private code: number, private text?: string) {}

  toString() {
    return this.text ? `${this.code} - ${this.text}` : this.code.toString();
  }
}
