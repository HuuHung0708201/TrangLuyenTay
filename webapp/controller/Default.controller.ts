import UIComponent from "sap/ui/core/UIComponent";
import BaseController from "./Base.controller";
import type Page from "sap/m/Page";
import Label from "sap/m/Label";

/**
 * @namespace base.controller
 */
export default class Page02 extends BaseController {
  public override onInit(): void {
    const oRouter = UIComponent.getRouterFor(this);
    oRouter?.getRoute("detail")?.attachPatternMatched(this._onObjectMatched, this);
  }

  private _onObjectMatched(oEvent: any): void {
    const sDetailId = oEvent.getParameter("arguments").detailId;
    const oPage = this.byId("dynamicDetailPage") as Page;

    oPage.destroyContent();
    oPage.addContent(new Label({ text: `📄 Chi tiết cho: ${sDetailId}` }));
  }

  public onNavBack(): void {
    const oRouter = UIComponent.getRouterFor(this);
    oRouter.navTo("default");
  }
}
