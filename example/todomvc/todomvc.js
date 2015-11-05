

/*LAID.run({
  data: {
    responsiveWidth: 550,
    gray230: LAID.rgb(230,230,230)
  },
  props: {
    backgroundColor: LAID.color("whitesmoke"),
    overflowY: "scroll",
    textFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    textSmoothing: "antialiased",
    textColor: LAID.rgb(77,77,77),
    textSize: 14,
    textWeight: "300"
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
        height: LAID.take("", "$naturalHeight"),
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
        },
        "sheets-displayed": {
          onlyif: LAID.take("Sheets", "hidden.onlyif").not(),
          props: {
            height: LAID.take("", "$naturalHeight").subtract(
          LAID.take("Sheets", "height"))
          }
        }
      },
      children: {
        "TopControls": {
          props: {
            width: LAID.take("../", "width"),
            boxShadows: [ 
                      {inset:true, x:0, y:-2, blur: 1,
                      color: LAID.rgba(0,0,0,0.03) }
                    ],

          },
          children: {
            "CheckAll": {
              props: {
                width:40,
                centerY: LAID.take("../New", "height").divide(2),
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
                //centerY: LAID.take("../", "height").divide(2),
                width: LAID.take("../", "width").subtract(
                  LAID.take("../CheckAll", "height")),
                
                textWeight: "300",



              },
              children: {
                "Placeholder": {
                  props: {
                    width: LAID.take("../", "width"),
                    centerY: LAID.take("../Input", "height").divide(2),
                    text: "What needs to be done?",
                    textColor: LAID.take("/", "data.gray230"),
                    textStyle: "italic",
                    textSize: 24,
                    textPaddingLeft: LAID.take("../Input", "textPaddingLeft"),
                    textWeight: "inherit"

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
                    backgroundColor: LAID.rgba(0, 0, 0, 0.003),
                    textSize: 24,
                    textPadding: {left:10, top:16, right:16, bottom:16},
                    textSmoothing: "antialiased",
                    textWeight: "inherit",

                  },
                  when: {
                    keypress: [
                      function (e) {
                        if (e.keyCode === 13) { //enter
                          var val = this.attr("$input");
                          if ( val ) {
                            this.changeNativeInput("");
                            LAID.level("/Container/TodosWrapper/Todo").
                              rowsMore([{id:Date.now(), title:val, complete:false}]);
                            updateLocalStorage();

                          }

                        }
                      }
                    ]
                  }
                }
              }

            }
          }
        },
        "TodosWrapper": {
          props:{
            top: LAID.take("../TopControls", "bottom"),
            width: LAID.take("../", "width"),
            borderTop:{ 
              width:1,
              color: LAID.take("/", "data.gray230"),
            }

          },
          children: {
            "Todo": {
              props: {
                width:LAID.take("../", 'width'),
                borderBottom: {
                  width:1, style:"solid",
                  color: LAID.rgb(237,237,237)
                },
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
                  if ( window.localStorage ) {
                    var todos = localStorage.getItem("todos");
                    if (todos) {
                      this.rowsChange(JSON.parse(todos));
                    }
                  }
                },
                states: {
                  "active": {
                    onlyif: 
                      LAID.take("/Container/BottomControls/Strip/Categories/Category", "data.selected").eq("Active"),
                    filter: LAID.take("", "$all").filterEq("row.complete", false)
                    
                  },
                  "completed": {
                    onlyif: 
                      LAID.take("/Container/BottomControls/Strip/Categories/Category", "data.selected").eq("Completed"),
                    filter: LAID.take("", "$all").filterEq("row.complete", true)
                  }
                }
                //filter: LAID.take("", "$all").filterEq("row.complete", true),
                //rows:[{id:1, title: "first", complete: false }],
                
                },
                children: {
                  "Tick": {
                    props: {
                      width: 40,
                      height: 40,
                      centerY: LAID.take("../", "height").divide(2)
                    },
                    states: {
                      "complete": {
                        onlyif: LAID.take("../", "row.complete"),
                        props: {
                          text: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="-10 -18 100 135"><circle cx="50" cy="50" r="50" fill="none" stroke="#bddad5" stroke-width="3"/><path fill="#5dc2af" d="M72 25L42 71 27 56l-4 4 20 20 34-52z"/></svg>'

                        },
                        when: {
                          click: [
                            function () {
                              this.level("../").row("complete", false);
                              updateLocalStorage();
                            }
                          ]
                        }
                      },
                      "incomplete": {
                        onlyif: LAID.take("../", "row.complete").not(),
                        props: {
                          text: '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="-10 -18 100 135"><circle cx="50" cy="50" r="50" fill="none" stroke="#ededed" stroke-width="3"/></svg>'
                        },
                        when: {
                          click: [
                            function () {
                              this.level("../").row("complete", true);
                              updateLocalStorage();
                            }
                          ]
                        }
                      }
                    }
                  },
                  "Content": {
                    props: {
                      left: LAID.take("../Tick", "right"),
                      text: LAID.take("../", "row.title"),
                      textPadding:15,
                      textSize: 24
                    },
                    states: {
                      "complete": {
                        onlyif: LAID.take("../", "row.complete"),
                        props: {
                          textDecoration: "line-through",
                          textColor: LAID.color("gainsboro")

                        }
                      },
                      "incomplete": {
                        onlyif: LAID.take("../", "row.complete").not(),
                        props: {}

                      }
                    }
                   
                  }
                }
              }
            }
          },
          "BottomControls": {
            props: {
              height:50,
              width:LAID.take("../", 'width'),
              top: LAID.take("../TodosWrapper", "bottom"),
              textColor: LAID.rgb(119, 119, 119)
            },
            states: {
              "hidden": {
                onlyif: LAID.take("../Sheets", "hidden.onlyif"),
                props: {
                  display: false
                }
              }
            },
            children: {
              "Strip": {
                props: {
                  width: LAID.take("../", "width").subtract(30),
                  centerX: LAID.take("../", "width").divide(2),
                  centerY: LAID.take("../", "height").divide(2)
                },
                children: {
                  "RemainingCount": {
                    data: {
                      remaining: LAID.take("/Container/TodosWrapper/Todo", "$all").filterEq("row.complete", false).length()
                    },
                    props: {
                      centerY: LAID.take("../", "height").divide(2),
                      text: LAID.take("%d items left").format(LAID.take("", "data.remaining")),
                      textWhitespace: "nowrap"
                    },
                    states: {
                      "single": {
                        onlyif: LAID.take("", "data.remaining").eq(1),
                        props: {
                          text: "1 item left"
                        }
                      }
                    }
                  },
                  "Categories": {
                    props: {
                      centerX: LAID.take("../", "width").divide(2),
                    },
                    
                    children: {
                      "Category": {
                        
                        props: {
                          cursor:"pointer",
                          border: {style: "solid", width: 1,
                            color: LAID.transparent()},
                          cornerRadius: 3,
                          text: LAID.take("", "row.text"),
                          textPadding: {top:3, bottom:3, left:7, right:7},
                        },
                        states: {
                          "selected": {
                            onlyif: LAID.take("", "row.selected"),
                            props: {
                              borderColor: LAID.rgba(175, 47, 47, 0.2)
                            }
                          },
                          "hover": {
                            onlyif: LAID.take("", "$hovered").eq(true).and(
                              LAID.take("", "row.selected").not()),
                            props: {
                              borderColor: LAID.rgba(175, 47, 47, 0.1)
                            }
                          }
                        },
                        when: {
                          "click": [
                            function () {
                              if ( !this.attr("row.selected") ) {
                                var selected =
                                 this.many().queryAll().filterEq("row.selected", true).end();
                                selected[ 0 ].row("selected", false );
                                this.row("selected", true);
                                updateLocalStorage();
                              }

                            }
                          ]
                        },
                        many: {
                          data: {
                            selected: LAID.take("", "$all").
                              filterEq("row.selected", true).
                              queryFetch(1, "row.text")
                          },
                          load: function () {
                            if ( window.localStorage ) {
                              var selected = localStorage.getItem("selected");
                              if ( selected ) {

                                var prevSelected =
                                  this.queryAll().filterEq("row.selected", true).end();
                                prevSelected[ 0 ].row("selected", false );
                                var toSelect = this.queryAll().filterEq("row.text", selected ).end();
                                toSelect[ 0 ].row("selected", true);
                              }
                            }
                          },
                          formation: "totheright",
                          args: {
                            totheright: {
                              gap:10
                            },
                          },
                          $id: "id",
                          rows: [
                            {id:1, text: "All", selected: true },
                            {id:2, text: "Active", selected: false },
                            {id:3, text: "Completed", selected: false }
                          ],
                        }
                      },                      
                    }
                  },
                  "ClearCompleted": {
                    props: {
                      cursor: "pointer",
                      right: LAID.take("../", "width"),
                      centerY: LAID.take("../", "height").divide(2),
                      height: LAID.take("/", "textSize"),
                      text: "Clear completed",
                      textWhitespace: "nowrap"
                    },
                    states: {
                      "hover": {
                        onlyif: LAID.take("", "$hovered"),
                        props: {
                          textDecoration: "underline"
                        }
                      }
                    }
                  }
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
              top: LAID.take("../BottomControls", "bottom"),
              zIndex: "-1",
              boxShadows: [
                {x:0, y:1, blur:1, color: LAID.rgba(0,0,0,0.2) },
                {x:0, y:8, blur:0, spread:-3, color: LAID.rgb(246,246,246) },
                {x:0, y:9, blur:1, spread:-3 ,color: LAID.rgba(0,0,0,0.2) },
                {x:0, y:16, blur:0, spread:-6, color: LAID.rgb(246,246,246) },
                {x:0, y:17, blur:2, spread:-6, color: LAID.rgba(0,0,0,0.2) },
              ]
            },
            states: {
              "hidden": {
                onlyif: LAID.take("/Container/TodosWrapper/Todo", "$all").length().eq(0),
                props: {
                  display: false
                }
              }
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
});*/

 
LAID.run({
  props: {
    backgroundColor: LAID.color("gainsboro")
  },
  children: {
    "Container": {
      props: {
        width: LAID.take("$naturalWidth"),
        height: LAID.take("$naturalHeight"),
        centerX: LAID.take("../", "width").divide(2),
        centerY: LAID.take("../", "height").divide(2),
        backgroundColor: LAID.color("pink")
      },
      children: {
        "Person": {
          props: {
            width: 180,
            centerX: LAID.take("../", "width").divide(2),
            cursor: "default",
            text: LAID.take("", "row.name"),
            textPadding: 10,
            textColor: LAID.color("black")

          },
          when: {
            "click": [
              function () {
                this.many().rowsChange(
                  [{id:2, name: "Alex" }]);
              }
            ]
          },
          transition: {
            all: {
              type: "linear",
              duration: 1000
            }
          },
          states: {
            "hover": {
              onlyif: LAID.take("","$hovered"),
              props: {
                textColor: LAID.color("gainsboro")
              }
            }
          },
          many: {
            formation: "totheright",
            args: {
              totheright:{
                gap:10
              }
            },
            $id: "id",
            rows: [
              {id:1, name: "Boeing" },
              {id:2, name: "NASA" },
              {id:3, name: "Airbus" }
            ],
          }
        }
      }
    
    }
  }
})

function updateLocalStorage () {
  var rows = LAID.level("/Container/TodosWrapper/Todo").attr("rows");

  if ( window.localStorage ) {
    window.localStorage.setItem("todos", JSON.stringify(rows));
    window.localStorage.setItem("selected",
      LAID.level("/Container/BottomControls/Strip/Categories/Category").
      attr("data.selected") );
  }
}











