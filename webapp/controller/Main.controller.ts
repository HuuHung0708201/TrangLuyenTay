import Core from "sap/ui/core/Core";
import MessageToast from "sap/m/MessageToast";
import Controller from "sap/ui/core/mvc/Controller";
import type View from "sap/ui/core/mvc/View";
import UIComponent from "sap/ui/core/UIComponent";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace base.controller
 */

// Định nghĩa cấu trúc dữ liệu của các item trong JSON
interface Item {
  Name: string;
  icon?: string;
  des?: string;
}
export default class Main extends Controller {
  public override onInit(): void {
    // Tạo model từ file JSON
    const oModel = new JSONModel(sap.ui.require.toUrl("base/localService/menu.json"));
    // Gán model vào view để các control có thể bind dữ liệu
    this.getView()?.setModel(oModel);
  }

  public onGridItemPress(oEvent: any): void {
    const oItem = oEvent.getSource(); // GridListItem
    const oContext = oItem?.getBindingContext();
    const oData = oContext?.getObject();

    if (!oData) {
      console.warn("Không lấy được dữ liệu item", oItem);
      return;
    }

    // 🔹 Lấy Router
    const oRouter = UIComponent.getRouterFor(this);

    // 🔹 Lấy App Controller an toàn qua Component
    const oOwnerComponent = this.getOwnerComponent() as any;
    const oRootView = oOwnerComponent.getRootControl(); // đây là App.view.xml
    const oAppController = oRootView.getController?.();

    if (oAppController && oAppController.setHeaderTitle) {
      oAppController.setHeaderTitle(oData.Name);
    }

    if (oData.route) {
      oRouter.navTo(oData.route);
    } else {
      MessageToast.show("Chưa gắn route cho item này!");
    }
  }
}
