import { describe, expect, it, vi } from "vitest";
import { mockLdpContainer, mockTurtleDocument } from "./mockResponses";

describe("mockResponses", () => {
  describe(mockTurtleDocument.name, () => {
    it("mocks a turtle document body", async () => {
      const fetch = vi.fn();
      mockTurtleDocument(
        fetch,
        "http://document.test/",
        `<> <> "Some content" .`,
      );
      const result = await fetch("http://document.test/", {});
      expect(await result.text()).toEqual('<> <> "Some content" .');
    });

    it("mocks standard turtle document headers", async () => {
      const fetch = vi.fn();
      mockTurtleDocument(
        fetch,
        "http://document.test/",
        `<> <> "Some content" .`,
      );
      const result: Response = await fetch("http://document.test/", {});
      expect(result.headers.get("Content-Type")).toEqual("text/turtle");
      expect(result.headers.get("Link")).toEqual(
        '<http://www.w3.org/ns/ldp#Resource>; rel="type"',
      );
      expect(result.headers.get("Wac-Allow")).toEqual(
        'user="read write append control",public="read"',
      );
      expect(result.headers.get("Accept-Patch")).toEqual("text/n3");
    });

    it("mocks additional headers as provided", async () => {
      const fetch = vi.fn();
      mockTurtleDocument(
        fetch,
        "http://document.test/",
        `<> <> "Some content" .`,
        {
          "X-My-Header": "MyValue",
        },
      );
      const result: Response = await fetch("http://document.test/", {});
      expect(result.headers.get("X-My-Header")).toEqual("MyValue");
    });
  });

  describe(mockLdpContainer.name, () => {
    it("mocks a container without contents", async () => {
      const fetch = vi.fn();
      mockLdpContainer(fetch, "http://container.test/");
      const result = await fetch("http://container.test/", {});
      expect(await result.text()).toEqual(`
      @prefix dc: <http://purl.org/dc/terms/>.
      @prefix ldp: <http://www.w3.org/ns/ldp#>.
      @prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
      
      <> a ldp:Container, ldp:BasicContainer, ldp:Resource ;
        
      .
      `);
    });

    it("mocks a container with contents", async () => {
      const fetch = vi.fn();
      mockLdpContainer(fetch, "http://container.test/", [
        "http://container.test/one",
        "http://container.test/two",
      ]);
      const result = await fetch("http://container.test/", {});
      expect(await result.text()).toEqual(`
      @prefix dc: <http://purl.org/dc/terms/>.
      @prefix ldp: <http://www.w3.org/ns/ldp#>.
      @prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
      
      <> a ldp:Container, ldp:BasicContainer, ldp:Resource ;
        ldp:contains <http://container.test/one>; ldp:contains <http://container.test/two>
      .
      `);
    });

    it("mocks a container with contents and more turtle statements", async () => {
      const fetch = vi.fn();
      mockLdpContainer(
        fetch,
        "http://container.test/",
        ["http://container.test/one", "http://container.test/two"],
        `<http://container.test/one> a ldp:Container .`,
      );
      const result = await fetch("http://container.test/", {});
      expect(await result.text()).toEqual(`
      @prefix dc: <http://purl.org/dc/terms/>.
      @prefix ldp: <http://www.w3.org/ns/ldp#>.
      @prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
      
      <> a ldp:Container, ldp:BasicContainer, ldp:Resource ;
        ldp:contains <http://container.test/one>; ldp:contains <http://container.test/two>
      .
      <http://container.test/one> a ldp:Container .`);
    });

    it("mocks standard ldp container headers", async () => {
      const fetch = vi.fn();
      mockLdpContainer(fetch, "http://container.test/");
      const result: Response = await fetch("http://container.test/", {});
      expect(result.headers.get("Content-Type")).toEqual("text/turtle");
      expect(result.headers.get("Link")).toEqual(
        '<http://www.w3.org/ns/ldp#Container>; rel="type"',
      );
      expect(result.headers.get("Wac-Allow")).toEqual(
        'user="read write append control",public="read"',
      );
      expect(result.headers.get("Accept-Patch")).toEqual("text/n3");
    });

    it("mocks additional headers as provided", async () => {
      const fetch = vi.fn();
      mockLdpContainer(fetch, "http://document.test/", undefined, undefined, {
        "X-My-Header": "MyValue",
      });
      const result: Response = await fetch("http://document.test/", {});
      expect(result.headers.get("X-My-Header")).toEqual("MyValue");
    });
  });
});
