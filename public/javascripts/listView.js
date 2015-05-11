/**
 * Created by toby on 10/05/15.
 */
var activeView = {
  type: "space",
  padding: 0,
  id: "activeView",
  view: "list",
  template: "#nonce# &mdash; #capability.scope# &mdash; #subject#",
  url: "tokenDb",
  select: true,
  ready: function() {
    if (this.count() === 0) {
      webix.extend(this, webix.OverlayBox);
      this.showOverlay("<div>no active capabilities</div>");
    } else {
      var selId = this.getIdByIndex(this.count()-1)
      this.select(selId);
      var item = this.getItem(selId);
      capabilityListClick(item, $$("activeTokenData"));
    }
  }
};

var expiredView = {
  type: "space",
  padding: 0,
  id: "expiredView",
  view: "list",
  template: "#nonce# &mdash; #capability.scope# &mdash; #subject#",
  url: "tokenDbExpired",
  select: true,
  ready: function() {
    if (this.count() === 0) {
      webix.extend(this, webix.OverlayBox);
      this.showOverlay("<div>no expired capabilities</div>");
    }
  }
};
