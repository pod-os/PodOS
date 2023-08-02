import { IndexedFormula, sym } from "rdflib";
import { Thing } from "../thing";

export interface ContainerContent {
  uri: string;
  name: string;
}
export class LdpContainer extends Thing {
  constructor(
    readonly uri: string,
    readonly store: IndexedFormula,
    readonly editable: boolean = false,
  ) {
    super(uri, store, editable);
  }

  contains(): ContainerContent[] {
    const contains = this.store.statementsMatching(
      sym(this.uri),
      sym("http://www.w3.org/ns/ldp#contains"),
      null,
      sym(this.uri),
    );
    return contains.map((content) => ({
      uri: content.object.value,
      name: content.object.value.replace(
        new RegExp(`${this.uri}([^/]*)/?`),
        "$1",
      ),
    }));
  }
}
