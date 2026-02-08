import { graph } from "rdflib";
import { PodOsSession } from "../authentication";
import { Thing } from "../thing";
import { NewFile } from "../files";
import { createFileLinkOperation } from "./createFileLinkOperation";
import { Store } from "../Store";

describe("createPictureLinkOperation", () => {
  it("creates an update operation linking a picture to a thing with schema:image", () => {
    // given a thing
    const internalStore = graph();
    const mockSession = {} as unknown as PodOsSession;
    const store = new Store(mockSession, undefined, undefined, internalStore);

    const thing = new Thing("https://pod.test/things/thing1", store, true);

    // and a picture file
    const file: NewFile = {
      url: "https://pod.test/things/photo.jpg",
      name: "photo.jpg",
      contentType: "image/jpeg",
    };

    // when creating the picture link operation
    const operation = createFileLinkOperation(
      thing,
      "http://schema.org/image",
      file,
    );

    // then the operation has no deletions or files to create
    expect(operation.deletions).toEqual([]);
    expect(operation.filesToCreate).toEqual([]);

    // and the operation has one insertion linking thing to picture
    expect(operation.insertions).toHaveLength(1);
    const insertion = operation.insertions[0];
    expect(insertion.subject.value).toBe(thing.uri);
    expect(insertion.predicate.value).toBe("http://schema.org/image");
    expect(insertion.object.value).toBe(file.url);
    expect(insertion.graph.value).toBe(thing.uri);
  });
});
