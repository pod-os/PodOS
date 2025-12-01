export interface TypeRegistration {
  /**
   * Type of the index: container containing instances or direct reference to a single instance
   */
  type: "container" | "instance";

  /**
   * URI the index point to (resembling terms:instance or terms:instanceContainer)
   */
  targetUri: string;

  /**
   * RDF class of the indexed item(s) (resembling terms:forClass)
   */
  forClass: string;
}
