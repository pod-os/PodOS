export class HttpStatus {
  constructor(private code: number, private text: string) {}

  toString() {
    return `${this.code} - ${this.text}`;
  }
}
