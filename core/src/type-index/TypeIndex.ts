import { Thing } from "../thing";
import { IndexedFormula, sym } from "rdflib";
import { RegistrationTarget, TypeRegistration } from "./TypeRegistration";
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

      const instanceStatements = this.store.statementsMatching(
        subject,
        solid("instance"),
        null,
        sym(this.uri),
      );
      const instances: RegistrationTarget[] = instanceStatements.map((it) => ({
        type: "instance",
        uri: it.object.value,
      }));

      const instanceContainers: RegistrationTarget[] =
        instanceContainerStatements.map((it) => ({
          type: "container",
          uri: it.object.value,
        }));
      return {
        targets: [...instanceContainers, ...instances],
        forClass: forClassStatements[0].object.value,
      };
    });
  }
}
