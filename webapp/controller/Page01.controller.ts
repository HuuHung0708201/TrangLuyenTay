import Label from "sap/m/Label";
import Page from "sap/m/Page";
import type SearchField from "sap/m/SearchField";
import type SplitApp from "sap/m/SplitApp";
import type Tree from "sap/m/Tree";
import FilterBar from "sap/ui/comp/filterbar/FilterBar";
import Controller from "sap/ui/core/mvc/Controller";
import type View from "sap/ui/core/mvc/View";
import XMLView from "sap/ui/core/mvc/XMLView";
import UIComponent from "sap/ui/core/UIComponent";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace base.controller
 */
export default class Page01 extends Controller {
  public override onInit(): void {
    const oTree = this.byId("queryTree") as Tree;

    // 1️⃣ Load JSON file
    const sPath = sap.ui.require.toUrl("base/localService/queries.json");
    const oModel = new JSONModel();

    // 2️⃣ Khi load xong => set model rồi expand
    oModel.attachRequestCompleted(() => {
      this.getView()?.setModel(oModel);
      oTree.expandToLevel(99); // xổ hết
      setTimeout(() => this.addIndentClasses(oTree), 200);
    });

    // 3️⃣ Trigger load
    oModel.loadData(sPath);
  }

  /**
   * Thêm class CSS treeLevel-x cho mỗi item dựa trên cấp độ
   */
  private addIndentClasses(oTree: Tree): void {
    const aItems = oTree.getItems();
    aItems.forEach((item: any) => {
      const level = item.getLevel?.() ?? -1;
      item.addStyleClass(`treeLevel-${level}`);
    });
  }

  public async onTreeItemPress(oEvent: any): Promise<void> {
    const oItem = oEvent.getSource();
    const oData = oItem.getBindingContext()?.getObject();
    if (!oData) return;

    const oTree = this.byId("queryTree") as Tree;
    const oSplitApp = this.byId("SplitAppDemo") as SplitApp;
    if (!oTree || !oSplitApp) return;

    // 🔹 Reset highlight
    const aItems = (oTree as any).getItems?.() || [];
    aItems.forEach((item: any) => item.removeStyleClass("treeItemSelected"));
    oItem.addStyleClass("treeItemSelected");

    // 🔹 Chuẩn hóa ID an toàn
    const normalizeId = (name: string) =>
      name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9_-]/g, "_");
    const sDetailId = `detail_${normalizeId(oData.name)}`;

    // 🔹 Kiểm tra xem XMLView detail đã tồn tại chưa
    let oDetailPage = sap.ui.getCore().byId(sDetailId) as SplitApp;
    if (!oDetailPage) {
      // Map Tree item name => XMLView path
      const viewMap: Record<string, string> = {
        "Save draft": "base.view.Page02",
      };
      const sViewName = viewMap[oData.name] || "base.view.Default";

      // Tạo XMLView mới
      oDetailPage = (await XMLView.create({
        id: sDetailId,
        viewName: sViewName,
      })) as any;

      oSplitApp.addDetailPage(oDetailPage);
    }

    // 🔹 Chuyển sang detail page tương ứng
    oSplitApp.toDetail(oDetailPage.getId(), "slide");

    // 🔹 Router sync URL (nếu muốn URL reflect)
    const oRouter = UIComponent.getRouterFor(this);
    oRouter.navTo("detail", { detailId: normalizeId(oData.name) });
  }
}
