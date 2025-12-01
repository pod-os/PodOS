import { Thing } from "../thing";
import { IndexedFormula, sym } from "rdflib";
import { TypeRegistration } from "./TypeRegistration";
import { solid } from "@solid-data-modules/rdflib-utils";

/**
 * Represents a private or public type index document
 */
export class TypeIndex extends Thing {
  constructor(
    readonly uri: string,
    readonly store: IndexedFormula,
    readonly editable: boolean = false,
  ) {
    super(uri, store, editable);
  }

  listAll(): TypeRegistration[] {
    const forClassStatements = this.store.statementsMatching(
      null,
      solid("forClass"),
      null,
      sym(this.uri),
    );

    return forClassStatements.map((statement) => {
      const subject = statement.subject;

      const instanceContainerStatements = this.store.statementsMatching(
        subject,
        solid("instanceContainer"),
        null,
        sym(this.uri),
      );
      return {
        targets: instanceContainerStatements.map((it) => ({
          type: "container",
          uri: it.object.value,
        })),
        forClass: forClassStatements[0].object.value,
      };
    });
  }
}
