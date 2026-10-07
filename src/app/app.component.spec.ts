import { TestBed } from "@angular/core/testing";
import { AppComponent } from "./app.component";
describe("AppComponent", () => {
  it("creates the dashboard", async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
    const f = TestBed.createComponent(AppComponent);
    expect(f.componentInstance).toBeTruthy();
    f.destroy();
  });
});
