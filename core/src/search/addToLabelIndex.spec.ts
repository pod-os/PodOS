import { addToLabelIndex } from "./addToLabelIndex";
import { graph, lit, st, sym } from "rdflib";
import { rdfs } from "../namespaces";
import { LabelIndex } from "./LabelIndex";
import { Thing } from "../thing";

describe(addToLabelIndex.name, () => {
  it("add the label of a thing to the label index", () => {
    const store = graph();
    store.add(
      st(
        sym("https://thing.test#it"),
        rdfs("label"),
        lit("Something"),
        sym("https://thing.test"),
      ),
    );
    const thing = new Thing("https://thing.test#it", store, true);
    const labelIndex = new LabelIndex(
      "https://alice.test/label-index",
      store,
      true,
    );
    const result = addToLabelIndex(thing, labelIndex);
    expect(result.deletions).toEqual([]);
    expect(result.filesToCreate).toEqual([]);
    expect(result.insertions).toEqual([
      st(
        sym("https://thing.test#it"),
        rdfs("label"),
        lit("Something"),
        sym("https://alice.test/label-index"),
      ),
    ]);
  });
});
