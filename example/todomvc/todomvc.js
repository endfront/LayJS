


LAID.run({
  data: {
    responsiveWidth: 550,
    gray230: LAID.rgb(230,230,230)
  },
  props: {
    backgroundColor: LAID.color("whitesmoke"),
    textFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    textSmoothing: "antialiased",
//    textLineHeight: "1.4em",
    textColor: LAID.rgb(77,77,77),
  },
  children: {
    "Header": {
      props: {
        width: LAID.take("../", "width"),
        //centerX: LAID.take("../", "width").divide(2),
        text: "todos",
        textSize: 100,
        textPadding: {
          top:9, bottom: 9
        },

        textColor: LAID.rgba(175, 47, 47, 0.15),
        textAlign:"center",
        textRendering: "optimizeLegibility",
        textWeight: "100",

      }
    },
    "Container": {
      props:{
        top: LAID.take("../Header", "bottom"),
        centerX: LAID.take("../", "width").divide(2),
        height: LAID.take("", "$naturalHeight").subtract(
          LAID.take("Sheets", "height")),
        width:LAID.take("/", "data.responsiveWidth"),
        backgroundColor:  LAID.color("white"),
        overflow: "visible",
        boxShadows: [
          {x:0, y:2, blur:4, color: LAID.rgba(0,0,0,0.2)  },
          {x:0, y:25, blur:50, color: LAID.rgba(0,0,0,0.1) }, 
        ]
      },
      states: {
        "responsive": {
          onlyif: LAID.take("/", "width").lt(
            LAID.take("/", "data.responsiveWidth")),
          props: {
            width: LAID.take("/", "width")
          }
        }
      },
      children: {
        "Controls": {
          props: {
            width: LAID.take("../", "width"),
            height: 65

          },
          children: {
            "CheckAll": {
              props: {
                width:40,
                centerY: LAID.take("../", "height").divide(2),
                text: "❯",
                textColor: LAID.take("/", "data.gray230"),
                textSize: 22,
                // Text line height should equal
                // the width (division for conversion
                // to "em")
                textLineHeight: LAID.take("", "width").divide(
                  LAID.take("", "textSize")),
                textAlign: "center",
                rotateZ: 90
              }
            },
            "New": {
              props: {
                left: LAID.take("../CheckAll", "right"),
                centerY: LAID.take("../", "height").divide(2),
                width: LAID.take("../", "width").subtract(
                  LAID.take("../CheckAll", "height")),
                textWeight: "300",

              },
              children: {
                "Placeholder": {
                  props: {
                    width: LAID.take("../", "width"),
                    text: "What needs to be done?",
                    textColor: LAID.take("/", "data.gray230"),
                    textStyle: "italic",
                    textSize: 24,
                    textPaddingLeft: 10

                  },
                  states: {
                    "hidden": {
                      onlyif: LAID.take("../Input", "$input").neq(""),
                      props: {
                        display: false
                      }
                    }
                  }
                },
                "Input": {
                  $type: "input:line",
                  props: {
                    zIndex:1,
                    width: LAID.take("../", "width"),
                    backgroundColor: LAID.transparent(),
                    textColor: LAID.take("/", "data.gray230"),
                    textStyle: "italic",
                    textSize: 24,
                    textPaddingLeft: 10


                  }
                }
              }

            }
          }
        },
        "TodosWrapper": {
          props:{
            top: LAID.take("../Controls", "bottom"),
            width: LAID.take("../", "width"),
            borderTop:{ 
              width:1,
              color: LAID.take("/", "data.gray230"),

           }
          },
          children: {
            "Todo" : {
              data: {
                colorR: 255,
                colorName: "red"
              },
              props: {
                width:LAID.take("../", 'width'),
                borderBottom: {
                  width:1, style:"solid",
                  color: LAID.rgb(237,237,237)
                },
                text: LAID.take("", "row.title"),
                textPadding:10,
                textSize: 24,

              },
              
              states: {
                "complete": {
                  onlyif: LAID.take("", "row.complete"),
                  props: {
                    textDecoration: "line-through",
                    textColor: LAID.color("gainsboro")

                  }
                },
                "incomplete": {
                  onlyif: LAID.take("", "row.complete").not(),
                  props: {
                  }

                }
              },
              many: {
                args: {
                  onebelow: {
                    gap: 0
                  },
                },
                $id: "id",
                formation: "onebelow",
                load: function () {
                  alert("woot");
                },
              //  filter: LAID.take("", "$all").filterEq("row.complete", true),
                rows: [
                  {id:1, title: "first", complete: false },
                  {id:2, title: "second", complete: true },
                  {id:3, title: "third", complete: false },
                  {id:4, title: "fourth", complete: false },
                  {id:5, title: "fifth", complete: true }
                ],
                
                }
              }
            }
          },
          "Sheets": {
            props: {
              width: LAID.take("../", "width"),
              height:50,
              shiftY:LAID.take("", "height").negative(),
              backgroundColor: LAID.transparent(),
              top: LAID.take("../TodosWrapper", "bottom"),
              boxShadows: [
                {x:0, y:1, blur:1, color: LAID.rgba(0,0,0,0.2) },
                {x:0, y:8, blur:0, spread:-3, color: LAID.rgb(246,246,246) },
                {x:0, y:9, blur:1, spread:-3 ,color: LAID.rgba(0,0,0,0.2) },
                {x:0, y:16, blur:0, spread:-6, color: LAID.rgb(246,246,246) },
                {x:0, y:17, blur:2, spread:-6, color: LAID.rgba(0,0,0,0.2) },

              ]
            }
          },      
        }
    },
    "Footer": {
      props: {
        top: LAID.take("../Container", "bottom").add(40),
        width: LAID.take("../", "width"),
        textAlign:"center",
        textShadows: [
          {x: 0, y:1, blur:1, color: LAID.rgba(255,255,255,0.5)}
        ],
        textSize:10,
        textColor: LAID.rgb(191,191,191),
        text: LAID.take("", "row.text")
      },

      many: {
        formation: "onebelow",
        args: {
          onebelow: {
            gap: 10
          }
        },
        $id: "id",
        rows: [
          { id: 1, text: "Double-click to edit a todo" },
          { id: 2, text: "Created by <a href='https://github.com/relfor' " +
        "class='link'>Relfor</a>"},
          { id: 3, text: "Part of <a href='http://todomvc.com' " +
        "class='link'>TodoMVC</a>"}
        ]
      }
    }
  }
  



        
});
 


