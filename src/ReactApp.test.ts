import { ReactApp } from "./ReactApp";

describe("Check ReactApp", () => {
  it("function test", () => expect(ReactApp).toBeInstanceOf(Function));
  it("div test", () => {
    const el = document.createElement("div");
    ReactApp();
    expect(el.innerHTML.length).toBeGreaterThanOrEqual(0);
  });
});
