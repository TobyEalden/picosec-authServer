/**
 * Created by toby on 10/05/15.
 */
var unitData = {
  unitNames: [
    {value: "[any]", id: "*"},
    {value: "Trial 1", id: "http://picosec.org/Trial1"},
    {value: "Trial 2", id: "http://picosec.org/Trial2"},
    {value: "Trial 3", id: "http://picosec.org/Trial3"},
    {value: "Trial 4", id: "http://picosec.org/Trial4"},
    {value: "Trial 5", id: "http://picosec.org/Trial5"},
    {value: "Trial 6", id: "http://picosec.org/Trial6"}
  ],
  resourceNames: [
    { value: "[any]", sensor: "*", actions: ["[any]"]},
    { value: "COZIR-Temperature", sensor: "COZIR", actions: ["[any]","get", "subscribe"]},
    { value: "COZIR-Humidity", sensor: "COZIR", actions: ["[any]","get", "subscribe"]},
    { value: "COZIR-CO2", sensor: "COZIR", actions: ["[any]","get", "calibrate", "subscribe"]},
    { value: "EMON-TH-Temperature", sensor: "EMON-TH", actions: ["[any]","get", "subscribe"]},
    { value: "EMON-TH-Humidity", sensor: "EMON-TH", actions: ["[any]","get", "subscribe"]},
    { value: "EMON-TX-Power", sensor: "EMON-TX", actions: ["[any]","get", "subscribe", "set_alarm"]}
  ],

  findResource: function (name) {
    var res;
    for (var r in unitData.resourceNames) {
      if (unitData.resourceNames[r].value === name) {
        res = unitData.resourceNames[r];
        break;
      }
    }
    return res;
  }
};
