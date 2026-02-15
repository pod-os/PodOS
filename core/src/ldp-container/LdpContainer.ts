import { sym } from "rdflib";
import { labelFromUri, Thing } from "../thing";
import { Store } from "../Store";
import { debounceTime, filter, map, merge, Observable, startWith } from "rxjs";

export interface ContainerContent {
  uri: string;
  name: string;
}
export class LdpContainer extends Thing {
  constructor(
    readonly uri: string,
    readonly store: Store,
    readonly editable: boolean = false,
  ) {
    super(uri, store, editable);
  }

  /**
   * Resources that the LDP Container contains
   *
   * @returns Array of objects with uri and name
   */
  contains(): ContainerContent[] {
    const contains = this.store.statementsMatching(
      sym(this.uri),
      sym("http://www.w3.org/ns/ldp#contains"),
      null,
      sym(this.uri),
    );
    return contains.map((content) => ({
      uri: content.object.value,
      name: labelFromUri(content.object.value),
    }));
  }

  /**
   * Observe changes to the resources that the LDP Container contains
   * 
   * @returns RxJS Observable that pushes a new contains() array when it changes
   */
  observeContains(): Observable<ContainerContent[]> {
    return merge(this.store.additions$, this.store.removals$).pipe(
      filter(
        (quad) =>
          quad.graph.value == this.uri &&
          quad.predicate.value == "http://www.w3.org/ns/ldp#contains",
      ),
      map(() => this.contains()),
      startWith(this.contains()),
      debounceTime(250),
    );
  }
}
