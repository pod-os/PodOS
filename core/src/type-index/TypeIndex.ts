import { Thing } from "../thing";
import { IndexedFormula, sym } from "rdflib";
import { RegistrationTarget, TypeRegistration } from "./TypeRegistration";
import { solid } from "@solid-data-modules/rdflib-utils";
import { labelForType } from "../thing/labelForType";
import { Store } from "../Store";

/**
 * Represents a private or public type index document
 * @since 0.24.0
 */
export class TypeIndex extends Thing {
  constructor(
    readonly uri: string,
    readonly store: IndexedFormula,
    readonly reactiveStore: Store,
    readonly editable: boolean = false,
  ) {
    super(uri, store, reactiveStore, editable);
  }

  listAll(): TypeRegistration[] {
    const forClassStatements = this.reactiveStore.statementsMatching(
      null,
      solid("forClass"),
      null,
      sym(this.uri),
    );

    return forClassStatements.map((statement) => {
      const subject = statement.subject;

      const instanceContainerStatements = this.reactiveStore.statementsMatching(
        subject,
        solid("instanceContainer"),
        null,
        sym(this.uri),
      );

      const instanceStatements = this.reactiveStore.statementsMatching(
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
        forClass: statement.object.value,
        label: labelForType(statement.object.value),
      };
    });
  }
}
