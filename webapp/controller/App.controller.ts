import Button from "sap/m/Button";
import List from "sap/m/List";
import MessageToast from "sap/m/MessageToast";
import type NavContainer from "sap/m/NavContainer";
import Popover from "sap/m/Popover";
import StandardListItem from "sap/m/StandardListItem";
import Controller from "sap/ui/core/mvc/Controller";
import History from "sap/ui/core/routing/History";
import UIComponent from "sap/ui/core/UIComponent";

/**
 * @namespace base.controller
 */
export default class App extends Controller {
  private _oAppMenu?: Popover;
  private _currentSelectedItem?: StandardListItem;

  // ✅ Danh sách menu cố định
  private readonly aItems = [
    { key: "home", title: "Home", icon: "sap-icon://home" },
    { key: "work", title: "Work Overview", icon: "sap-icon://complete" },
    { key: "proposal", title: "Xây dựng tờ trình đề xuất mua sắm", icon: "sap-icon://order-status" },
    { key: "packageCreate", title: "Tạo gói mua sắm", icon: "sap-icon://order-status" },
    { key: "packageBuild", title: "Xây dựng gói mua sắm", icon: "sap-icon://order-status" },
    { key: "scoring", title: "Chấm điểm", icon: "sap-icon://order-status" },
    { key: "contract", title: "Hợp đồng", icon: "sap-icon://order-status" },
    { key: "supplier", title: "Quản lý NCC", icon: "sap-icon://order-status" },
    { key: "CentralizedPurchasing", title: "Sphinx Mua sắm tập trung", icon: "sap-icon://order-status" },
  ];

  public override onInit(): void {
    const oRouter = UIComponent.getRouterFor(this);
    const oButton = this.byId("appTitleButton") as Button;

    // ✅ 1. Lấy hash hiện tại khi load lại trang
    const sHash = oRouter.getHashChanger().getHash() || "";

    // ✅ 2. So khớp với danh sách aItems
    const oMatchedItem = this.aItems.find((item) => sHash.includes(item.key));

    // ✅ 3. Đặt lại text tương ứng
    if (oMatchedItem && oButton) {
      oButton.setText(oMatchedItem.title);
    } else {
      oButton.setText("Home");
    }
  }

  public onAppTitlePressed(oEvent: any): void {
    const oButton = oEvent.getSource() as Button;

    // Nếu popover chưa được tạo thì tạo mới
    if (!this._oAppMenu) {
      const oList = new List({
        items: this.aItems.map((item) => {
          const oListItem = new StandardListItem({
            title: item.title,
            icon: item.icon,
            type: "Active",
            press: () => this.onMenuItemPress(item.key, oListItem),
          });
          return oListItem;
        }),
      });

      this._oAppMenu = new Popover({
        title: "Chọn trang",
        placement: "Bottom",
        showArrow: true,
        contentWidth: "auto",
        content: [oList],
      });
    }

    this._oAppMenu.openBy(oButton);
  }

  private onMenuItemPress(key: string, oListItem: StandardListItem): void {
    const oButton = this.byId("appTitleButton") as Button;
    const oRouter = UIComponent.getRouterFor(this);

    oButton.setText(oListItem.getTitle());

    if (this._currentSelectedItem) {
      this._currentSelectedItem.setSelected(false);
    }

    this._currentSelectedItem = oListItem;
    oListItem.setSelected(true);
    this._oAppMenu?.close();

    oRouter.navTo(key);
  }

  public onNavBack(): void {
    const history = History.getInstance();
    const previousHash = history.getPreviousHash();
    const oButton = this.byId("appTitleButton") as Button;

    if (previousHash !== undefined) {
      window.history.go(-1);
      oButton.setText("Home");
    } else {
      const router = UIComponent.getRouterFor(this);
      oButton.setText("Home");
      router.navTo("RouteMain", {}, true);
    }
  }

  public setHeaderTitle(sTitle: string): void {
    const oButton = this.byId("appTitleButton") as any;
    if (oButton) {
      oButton.setText(sTitle);
    }
  }
}
