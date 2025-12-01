/**
 * Registration of a type in the type index
 */
export interface TypeRegistration {
  /**
   * RDF class of the indexed item(s) (resembling terms:forClass)
   */
  forClass: string;
  /**
   * The containers or things this registration points to
   */
  targets: RegistrationTarget[];
}

/**
 * Target of a type registration
 */
export interface RegistrationTarget {
  /**
   * container containing instances or direct reference to a single instance
   */
  type: "container" | "instance";
  /**
   * URI the index points to (resembling terms:instance or terms:instanceContainer)
   */
  uri: string;
}
