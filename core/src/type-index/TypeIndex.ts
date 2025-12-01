import { Thing } from "../thing";
import { IndexedFormula } from "rdflib";
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
      null, // TODO check correct document
    );

    return forClassStatements.map((statement) => {
      const subject = statement.subject;

      const instanceContainerStatements = this.store.statementsMatching(
        subject,
        solid("instanceContainer"),
        null,
        null, // TODO check correct document
      );
      return {
        type: "container",
        targetUri: instanceContainerStatements[0].object.value,
        forClass: forClassStatements[0].object.value,
      };
    });
  }
}
