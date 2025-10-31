import FilterBar from "sap/ui/comp/filterbar/FilterBar";
import SearchField from "sap/m/SearchField";
import Controller from "sap/ui/core/mvc/Controller";

export default class Page02 extends Controller {
  public override onInit(): void {
    
  }
  public override onAfterRendering(): void {
    const oFilterBar = this.byId("filterbar") as FilterBar;
    const oSearchField = oFilterBar.getAggregation("_searchField") as SearchField;
    console.log("fdfdfdf");

    if (oSearchField) {
      // đổi chữ "Go" sang "Search"
      oSearchField.setPlaceholder("Search");
    }
  }
}
