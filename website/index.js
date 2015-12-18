
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




var lson = ({
  data: {
    lightWhite: LAY.rgb(235,235,235),
    lightBlack: LAY.rgb(70,70,70)
  },
  props: {
    userSelect: true,
    textFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif"
  },
  "Header": {
    props: {
      height: LAY.take("", "$naturalHeight").plus(10),
      width: LAY.take("../", "width"),
      backgroundColor: LAY.take("/", "data.lightWhite"),
      textWeight: "100"
    },
    "Title": {
      props: {
        centerX: LAY.take("../", "$midpointX"),
        centerY: LAY.take("../", "$midpointY"),
        text: "LAY",
        textLetterSpacing:20,
        textSize: 50,
        textColor: LAY.take("/", "data.lightBlack"),
      }
    }
  },
  "Docs": {
    "TreeContainer": {
      props: {
        top: LAY.take("/Header", "bottom")
      },
      "_Tree": {
        many: {
          formation: "onebelow"
        },
        "Line": {
          props: {
            display: false,
            text: LAY.take("line: %s").format(
              LAY.take("../", "row.text"))
          },
          states: {
            "active": {
              onlyif: LAY.take("../", "row.tree").length().eq(0),
              props: {
                display: true
              }
            }
          }
        },
        "Expander": {
          props: {
            display: false,
            text: LAY.take("Expander: %s").format(
              LAY.take("../", "row.text"))
          },
          states: {
            "active": {
              onlyif: LAY.take("../", "row.tree").length().gt(0),
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








