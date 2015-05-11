/**
 * Created by toby on 10/05/15.
 */
var newView = {
  padding: 0,
  id: "newView",
  rows: [
    {
      id: "newForm",
      view: "form",
      elements: [
        {
          rows: [
            { template: "token", type: "section" },
            { id: "resourceHolder", name: "resources", hidden: true, view: "text" },
            { id: "subject", name: "subject", view: "text", label: "subject (optional)" },
            { cols: [
              { id: "expiryMins", name: "expiry", view: "counter", label: "expiry", value: 10, minWidth: 300 },
              { id: "expiry", view: "datepicker", label: "date" }
            ]}
          ]
        },
        { rows: [
          { template: "resources", type: "section" },
          { id: "scopeSelect", view: "select", name: "scope", label: "device", options: []},
          { id: "resourceSelect", view: "select", label: "resource", options: []},
          { id: "actionSelect", view: "select", label: "action", options: [ { value: "[any]"} ]},
          { id: "addResource", view: "button", type: "iconButton", icon: "plus", inputWidth: 130, label: "add resource", align: "right"}
        ]}
      ]
    },
    {
      view: "toolbar",
      id: "newToolbar",
      cols: [
        { view: "button", type: "iconButton", id: "saveButton", icon: "save", label: "create", width: 80 },
        { view: "button", type: "iconButton", id: "resetButton", icon: "refresh", label: "reset", width: 80 },
        {}
      ]
    },
    {}
  ]
};
