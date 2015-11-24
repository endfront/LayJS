
var docTree = [
  { text: "Loner1", tree:[] },
  { text: "Loner2", tree:[] },
  { text: "Expands1", tree:[
    { text: "Loner4", tree:[] },
    { text: "Expands2", tree: [
      { text:"Loner5", tree:[]}
    ]}
  ]},
  { text: "Loner3", tree:[] },

];




LAID.run({
  data: {
    lightWhite: LAID.rgb(235,235,235),
    lightBlack: LAID.rgb(70,70,70)
  },
  "Header": {
    props: {
      height: LAID.take("", "$naturalHeight").plus(10),
      width: LAID.take("../", "width"),
      backgroundColor: LAID.take("/", "data.lightWhite"),
      textWeight: "100"
    },
    "Title": {
      props: {
        centerX: LAID.take("../", "$midpointX"),
        centerY: LAID.take("../", "$midpointY"),
        backgroundColor: LAID.take("/", "data.lightBlack"),
        cornerRadius: {topLeft: 0, topRight:15,
          bottomRight:0, bottomLeft:15 },
        text: "LAID.JS",
        textSize: 50,
        textColor: LAID.take("/", "data.lightWhite"),
        textPadding:10
      }
    }
  },
  "Docs": {
    "TreeContainer": {
      props: {
        top: LAID.take("/Header", "bottom")
      },
      "_Tree": {
        many: {
          formation: "onebelow"
        },
        "Line": {
          props: {
            display: false,
            text: LAID.take("line: %s").format(
              LAID.take("../", "row.text"))
          },
          states: {
            "active": {
              onlyif: LAID.take("../", "row.tree").length().eq(0),
              props: {
                display: true
              }
            }
          }
        },
        "Expander": {
          props: {
            display: false,
            text: LAID.take("Expander: %s").format(
              LAID.take("../", "row.text"))
          },
          states: {
            "active": {
              onlyif: LAID.take("../", "row.tree").length().gt(0),
              props: {
                display: true
              }
            }
          },
        }
      },
      "Tree": {
        $inherit: "/Docs/TreeContainer/_Tree",
        many: {
          rows: docTree
        }
      }
    }
  }
});








