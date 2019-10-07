import { embeddedWebHelper } from "../src/index";

describe("Object validation", () => {
  test("correctly formatted passes validation", () => {
    const mockArray = [
      {
        Type: "NameValue",
        Origin: "https://origin.test.org",
        Data: [
          {
            Name: "A thing",
            Value: "bla bla bla"
          },
          {
            Name: "Another thing",
            Value: "Nåt annat bla bla"
          }
        ]
      }
    ];
    const spy = spyOn(embeddedWebHelper, "submitData");
    embeddedWebHelper.submitData(mockArray as any);
    expect(spy).toHaveBeenCalled();
  });

  test("empty array fails validation", () => {
    expect(() => embeddedWebHelper.submitData([] as any[])).toThrowError(
      "received empty array"
    );
  });

  test("empty object fails validation", () => {
    expect(() => embeddedWebHelper.submitData([{}] as any[])).toThrowError(
      "object not defined"
    );
  });

  test("missing Type-property fails validation", () => {
    const mockArray = [
      {
        Origin: "https://origin.test.org",
        Data: [
          {
            Name: "A thing",
            Value: "bla bla bla"
          }
        ]
      }
    ];

    expect(() => embeddedWebHelper.submitData(mockArray as any[])).toThrowError(
      "property Type required. Should be a valid type"
    );
  });

  test("non approved Type-property fails validation", () => {
    const mockArray = [
      {
        Type: "some non-existing type",
        Origin: "https://origin.test.org",
        Data: [
          {
            Name: "A thing",
            Value: "bla bla bla"
          }
        ]
      }
    ];

    expect(() => embeddedWebHelper.submitData(mockArray as any[])).toThrowError(
      "property Type required. Should be a valid type"
    );
  });

  test("missing Origin-property fails validation", () => {
    const mockArray = [
      {
        Type: "NameValue",
        Data: [
          {
            Name: "A thing",
            Value: "bla bla bla"
          }
        ]
      }
    ];

    expect(() => embeddedWebHelper.submitData(mockArray as any[])).toThrowError(
      "property Origin required. Type: string"
    );
  });

  test("missing Data-property fails validation", () => {
    const mockArray = [
      {
        Origin: "https://origin.test.org",
        Type: "NameValue"
      }
    ];

    expect(() => embeddedWebHelper.submitData(mockArray as any[])).toThrowError(
      "property Data required"
    );
  });

  test("origin as non string fails validation", () => {
    const mockArray = [
      {
        Type: "NameValue",
        Origin: 2,
        Data: [
          {
            Name: "A thing",
            Value: "bla bla bla"
          }
        ]
      }
    ];

    expect(() => embeddedWebHelper.submitData(mockArray as any[])).toThrowError(
      "property Origin required. Type: string"
    );
  });

  test("too many properties fails validation", () => {
    const mockArray = [
      {
        FakedProperty: "I should not exist",
        Type: "NameValue",
        Origin: 2,
        Data: [
          {
            Name: "A thing",
            Value: "bla bla bla"
          }
        ]
      }
    ];

    expect(() => embeddedWebHelper.submitData(mockArray as any[])).toThrowError(
      "property Origin required. Type: string"
    );
  });
});
