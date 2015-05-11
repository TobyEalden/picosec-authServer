/**
 * Created by toby on 10/05/15.
 */
var resourceList = [];

function doSave() {
  var normalised = [];
  resourceList.sort().forEach(function(r) {
    normalised.push({ key: r.resource, value: r.actions.sort() });
  });
  $$("resourceHolder").setValue(JSON.stringify(normalised));

  var form = $$("newForm");
  $$("newView").showProgress({ type: "icon"});
  webix.ajax().post("addCapability", form.getValues(), function() {
    $$("newView").hideProgress();
    window.location.reload();
  });
}

function showCapabilityDetails(bind, propertySheet) {
  var elements = [
    {label: "id", type: "text", id: "id"},
    {label: "token", type: "text", id: "token"},
    {label: "scope", type: "text", id: "scope"},
    {label: "subject", type: "text", id: "subject"},
    {label: "expires", type: "text", id: "expiry"}
  ];

  bind.resources.forEach(function(r) {
    elements.push({ label: "resource " + r.resource, type: "label" });
    r.actions.forEach(function(a) {
      elements.push({ label: a });
    });
  });

  propertySheet.define("elements",elements);
  propertySheet.parse(bind);
}

function capabilityListClick(item, propertySheet) {
  var bind = {
    id: item.nonce,
    token: item.id,
    expiry: (new Date(item.expires)).toUTCString(),
    scope: item.capability.scope,
    subject: item.subject || "n/a",
    resources: item.capability.resources
  };
  showCapabilityDetails(bind, propertySheet);
};

function addNewResourceAction() {
  $$("scopeSelect").disable();
  var resource = $$("resourceSelect").getValue();
  if (resource === "[any]") resource = "*";
  var action = $$("actionSelect").getValue();
  if (action === "[any]") action = "*";
  var findResource = function(res) {
    var found;
    for (var r in resourceList) {
      if (resourceList[r].resource === res) {
        found = resourceList[r];
        break;
      }
    }
    return found;
  };
  var existing = findResource(resource);
  if (existing === undefined) {
    existing = { resource: resource, actions: []};
    resourceList.push(existing);
  }
  if (existing.actions.indexOf(action) == -1 && existing.actions.indexOf("*") == -1) {
    existing.actions.push(action);
  }

  updateNewCapability();
}

function updateNewCapability() {
  var subject = $$("subject").getValue();
  var scope = $$("scopeSelect").getValue();
  var expiryMins = $$("expiryMins").getValue();
  var expireDate = new Date(Date.now() + expiryMins*60000);

  var bind = {
    id: "...pending...",
    token: "n/a",
    scope: scope,
    subject: subject,
    expiry: expireDate.toUTCString(),
    resources: resourceList
  };
  showCapabilityDetails(bind, $$("newTokenData"));
}

function activateTab() {
  var active = $$("capabilityTabBar").getValue();

  $$("activeTokenDataContainer").hide();
  $$("expiredTokenDataContainer").hide();
  $$("newTokenDataContainer").hide();

  switch (active) {
    case "activeView":
      $$("activeView").refresh();
      $$("activeTokenDataContainer").show();
      break;
    case "expiredView":
      $$("expiredTokenDataContainer").show();
      break;
    case "newView":
      $$("newTokenDataContainer").show();
      break;
    default:
      webix.message("unknown tab");
      break;
  }

  // ToDo - investigate and fix
  $$("mainLayout").resize();
}

//webix.debug = true;
webix.ready(function() {
  webix.require("../../listView.js");
  webix.require("../../newView.js");

  webix.ui({
    id: "mainLayout",
    rows:[
      {
        view:"toolbar",
        height: 45,
        elements: [
          { view: "label", template: "<div id='picoHeader'><span class='picoHeaderTitle'> &mdash; authentication server</span>"},
          {},
          {view:"label", template: "<div style='text-align: right;'>toby.ealden</div>" },
          {view:"icon", icon:"user"},
          {view:"icon", icon:"cog"}
        ]
      },
      {
        type: "space",
        cols: [
          {
            header: "notifications",
            collapsed: true,
            body: {

            }
          },
          {
            id: "capabilityTabBar",
            view:"tabview",
            tabbar: { optionWidth: 100},
            multiview: { animate: true },
            gravity: 3,
            cells: [
              {
                header: "active",
                body: activeView
              },
              {
                header: "expired",
                body: expiredView
              },
              {
                header: "new",
                body: newView
              }
            ]
          },
          {
            view: "resizer"
          },
          {
            id: "tokenDataContainer",
            gravity: 1,
            rows: [
              {
                id: "activeTokenDataContainer",
                header: "capability",
                body: {
                  id: "activeTokenData",
                  view: "property",
                  elements: []
                }
              },
              {
                id: "expiredTokenDataContainer",
                hidden: true,
                header: "capability",
                body: {
                  id: "expiredTokenData",
                  view: "property",
                  elements: []
                }
              },
              {
                id: "newTokenDataContainer",
                hidden: true,
                header: "capability",
                body: {
                  id: "newTokenData",
                  view: "property",
                  elements: []
                }
              }
            ]
          }
        ]
      },
      {
        view: "toolbar",
        height: 45,
        elements: [
          { view: "label", id: "version", template: "<div style='font-size: .8em;'>v 0.0.12</div>" },
          {},
          { view: "label", id: "timestamp", template: "<div style='text-align: right;font-size: .8em;'>" + (new Date().toUTCString()) + "</div>" }
        ]
      }
    ]
  });


  $$("capabilityTabBar").getTabbar().attachEvent("onAfterTabClick", activateTab);

  $$("scopeSelect").define("options", unitData.unitNames);
  $$("resourceSelect").define("options", unitData.resourceNames);

  $$("scopeSelect").attachEvent("onChange", updateNewCapability);
  $$("subject").attachEvent("onChange", updateNewCapability);
  $$("expiryMins").attachEvent("onChange", function() {
    updateNewCapability();
  });
  $$("expiry").attachEvent("onChange", function() {
    var inpDate = new Date($$("expiry").getValue());
    var expireTime = new Date(Date.UTC(inpDate.getFullYear(), inpDate.getMonth(), inpDate.getDate(), inpDate.getHours(), inpDate.getMinutes(), inpDate.getSeconds()));
    var diff = expireTime.getTime() - Date.now();
    $$("expiryMins").setValue(diff/60000);
    updateNewCapability();
  });

  $$("activeView").attachEvent("onItemClick", function(id) {
    var item = this.getItem(id);
    capabilityListClick(item, $$("activeTokenData"));
  });

  $$("expiredView").attachEvent("onItemClick", function(id) {
    var item = this.getItem(id);
    capabilityListClick(item, $$("expiredTokenData"));
  });

  $$("resourceSelect").attachEvent("onChange", function(item) {
    var resource = unitData.findResource(item);
    var actions = resource.actions.map(function(i) {
      return { value: i };
    });
    $$("actionSelect").define("options", actions);
    $$("actionSelect").refresh();
  });

  $$("addResource").attachEvent("onItemClick", addNewResourceAction);
  $$("saveButton").attachEvent("onItemClick", doSave);
  $$("resetButton").attachEvent("onItemClick", function() { window.location.reload(); });

  webix.extend($$("newView"), webix.ProgressBar);

  setInterval(function() {
    $$("timestamp").define("template","<div style='text-align: right;font-size: .8em;'>" + (new Date().toUTCString()) + "</div>");
    $$("timestamp").refresh();
  },1000);
});
