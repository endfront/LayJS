
LAID.run({
  data: {
    mobileResponsiveWidth: 550,
    sidebarResponsiveWidth: 900,
    gray230: LAID.rgb(230,230,230)
  },
  props: {
    backgroundColor: LAID.color("whitesmoke"),
    overflowY: "scroll",
    textFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    textSmoothing: "antialiased",
    textColor: LAID.rgb(77,77,77),
    textSize: 14,
    textWeight: "300",
    textLineHeight: 1.4
  },

  "App": {
    props: {
      centerX: LAID.take("../", "$midpointX").plus(
        LAID.take("../Learn", "$midpointX")),
      overflow: "visible"
    },
    states: {
      "nosidebar": {
        onlyif: LAID.take("/", "width").lt(
          LAID.take("/", "data.sidebarResponsiveWidth")),
        props: {
          centerX: LAID.take("../", "$midpointX")
        }
      }
    },

    "Header": {
      props: {
        width: LAID.take("../", "width"),
        text: "todos",
        textSize: 100,
       // textPadding: {
        //  top:9, bottom: 9
        //},
        textColor: LAID.rgba(175, 47, 47, 0.15),
        textAlign:"center",
        textRendering: "optimizeLegibility",
        textWeight: "100"
      }
    },
    "Container": {
      props:{
        top: LAID.take("../Header", "bottom"),
        centerX: LAID.take("../", "$midpointX"),
        width: LAID.take("/", "data.mobileResponsiveWidth"),
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
            LAID.take("/", "data.mobileResponsiveWidth")),
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
      
      "TopControls": {
        props: {
          width: LAID.take("../", "width"),
          boxShadows: [ 
                    {inset:true, x:0, y:-2, blur: 1,
                    color: LAID.rgba(0,0,0,0.03) }
                  ]

        },
        "CompleteToggle": {
          data: {
            allCompleted:
              LAID.take("/App/Container/Todos/Todo", "rows").length().gt(0).and(
                LAID.take("/App/Container/Todos/Todo", "rows").filterEq(
                  "complete", false).length().eq(0))
           
          },
          props: {
            width:40,
            height: 40,
            centerY: LAID.take("../Input", "centerY"),
            cursor: "default",
            text: "❯",
            textSize: 22,
            // Text line height should equal
            // the width (division for conversion
            // to "em")
            textLineHeight: LAID.take("", "width").divide(
              LAID.take("", "textSize")),
            textAlign: "center",
            rotateZ: 90
          },
          states: {
            "hidden": {
              onlyif: LAID.take("/App/Container/Todos/Todo", "rows").length().eq(0),
              props: {
                display: false
              }
            },
            "incomplete": {
              onlyif: LAID.take("", "data.allCompleted").not(),
              props: {
                textColor: LAID.take("/", "data.gray230")
              },
              when: {
                click: function () {
                  LAID.level("/App/Container/Todos/Todo").rowsUpdate(
                  "complete", true );
                  updateLocalStorage();
                }
              }
            },
            "completed": {
              onlyif: LAID.take("", "data.allCompleted"),
              props: {
                textColor: LAID.rgb(115,115,155)
              },
              when: {
                click: function () {
                  LAID.level("/App/Container/Todos/Todo").rowsUpdate(
                  "complete", false );
                  updateLocalStorage();
                }
              }
            }
          }
        },
        "Input": {
          $type: "input:line",
          props: {
            left: LAID.take("../CompleteToggle", "right"),
            width: LAID.take("../", "width").subtract(
              LAID.take("../CompleteToggle", "height")),
            backgroundColor: LAID.rgba(0, 0, 0, 0.003),
            textSize: 24,
            textPadding: 16,
            textSmoothing: "antialiased",
            textWeight: "inherit",
            textLineHeight:1.4,
            inputPlaceholder: "What needs to be done?",
            focus: true
          //  boxShadows: [
           //   { inset:true, x:0, y: -2, blur: 1,
           //        color:LAID.rgba(0, 0, 0, 0.03) }
            //]

          },
          when: {
            keypress: function (e) {
              if (e.keyCode === 13) { //enter
                var val = this.attr("$input").trim();
                if ( val ) {
                  this.changeNativeInput("");
                  LAID.level("/App/Container/Todos/Todo").rowAdd(
                    {id:Date.now(), title:val, complete:false});
                  updateLocalStorage();
                }
              }
            }
          }
        }
      },
      "Todos": {
        props:{
          top: LAID.take("../TopControls", "bottom"),
          width: LAID.take("../", "width"),
          borderTop:{ 
            style:"solid",
            width:1,
            color: LAID.take("/", "data.gray230")
          }
        },
        states: {
          "hidden": {
            onlyif: LAID.take("Todo", "rows").length().eq(0),
            props: {
              display:false
            }
          }
        },
        "Todo": {
          data: {
            isEditing: false
          },
          props: {
            width:LAID.take("../", "width"),
            borderBottom: {
              width:1, style:"solid",
              color: LAID.rgb(237,237,237)
            },
            overflow: "visible" //border overflow of input
          },
          
          many: {
            formation: "onebelow",
            $load: function () {
              if ( window.localStorage ) {
                var todos = localStorage.getItem("todos");
                if (todos) {
                  this.rowsCommit(JSON.parse(todos));
                }
              }
            },
            states: {
              "active": {
                onlyif: 
                  LAID.take("/App/Container/BottomControls/Strip/Categories/Category", "data.selected").eq("Active"),
                filter: LAID.take("", "rows").filterEq("complete", false)
                
              },
              "completed": {
                onlyif: 
                  LAID.take("/App/Container/BottomControls/Strip/Categories/Category", "data.selected").eq("Completed"),
                filter: LAID.take("", "rows").filterEq("complete", true)
              }
            }
          
          },
          
            "Tick": {
              props: {
                width: 40,
                height: 40,
                centerY: LAID.take("../", "$midpointY")
              },
              states: {
                "hidden": {
                  onlyif: LAID.take("../", "data.isEditing"),
                  props: {
                    display: false
                  }
                },
                "complete": {
                  onlyif: LAID.take("../", "row.complete"),
                  props: {
                    text: LAID.take('<svg xmlns="http://www.w3.org/2000/svg" width="%d" height="%d" viewBox="-10 -18 100 135"><circle cx="50" cy="50" r="50" fill="none" stroke="#bddad5" stroke-width="3"/><path fill="#5dc2af" d="M72 25L42 71 27 56l-4 4 20 20 34-52z"/></svg>').format(
                      LAID.take("", "width"),LAID.take("", "height"))
                  },
                  when: {
                    click: function () {
                      this.level("../").row("complete", false);
                      updateLocalStorage();
                    }
                  }
                },
                "incomplete": {
                  onlyif: LAID.take("../", "row.complete").not(),
                  props: {
                    text: LAID.take('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="-10 -18 100 135"><circle cx="50" cy="50" r="50" fill="none" stroke="#ededed" stroke-width="3"/></svg>').format(
                      LAID.take("", "width"),LAID.take("", "height"))
                  },
                  when: {
                    click: function () {
                      this.level("../").row("complete", true);
                      updateLocalStorage();
                    }
                  }
                }
              }
            },
            "Title": {
              props: {
                left: LAID.take("../Tick", "right"),
                width: LAID.take("../", "width").subtract(
                  LAID.take("", "left")),
                text: LAID.take("../", "row.title"),
                textPadding:15,
                textSize: 24,
                textWordBreak: "break-word",
                textWrap: "pre",
                textLineHeight: 1.2,
                userSelect: "text"
              },
              states: {
                "hidden": {
                  onlyif: LAID.take("../", "data.isEditing"),
                  props: {
                    display: false
                  }
                },
                "complete": {
                  onlyif: LAID.take("../", "row.complete"),
                  props: {
                    textDecoration: "line-through",
                    textColor: LAID.color("gainsboro")
                  }
                },
                "incomplete": {
                  onlyif: LAID.take("../", "row.complete").not()
                }
              },
              transition: {
                textColor: {
                  type: "ease-out",
                  duration: 400
                }
              },
              when: {
                dblclick: function () {
                  this.level("../").data("isEditing", true );
                }
              }
            },
            "Input": {
              $type: "input:line",
              props: {
                display: false,
                left: LAID.take("../Tick", "right"),
                width: LAID.take("../", "width").subtract(
                  LAID.take("", "left")),
                border: {
                  style:"solid", width:1,
                    color: LAID.hex(0x999999)
                },
                boxShadows: [
                  { inset:true, x:0, y: -1, blur: 5,
                   color:LAID.rgba(0, 0, 0, 0.2) }
                ],
                input: LAID.take("../", "row.title"),
                textPadding:15,
                textSize: 24,
                textLineHeight:1.2
              },
              states: {
                "shown": {
                  onlyif: LAID.take("../", "data.isEditing"),
                  props: {
                    display: true,
                    focus: true
                  }
                }
              },
              when: {
                keyup: function (e) {
                  if (e.keyCode === 13) { //enter
                    var val = this.attr("$input").trim();
                    if ( val === "") { //delete item
                      this.level("../").remove();
                    } else {
                      this.level("../").row("title", val );
                      this.level("../").data("isEditing", false );
                    }
                    updateLocalStorage();
                  } else if ( e.keyCode === 27) {
                    // reset the original value
                    this.changeNativeInput(
                      this.level("../").attr("row.title"));
                    this.level("../").data("isEditing", false );
                  }
                },
                blur: function () {
                  var val = this.attr("$input").trim();
                    if ( val === "") { //delete item
                      this.level("../").remove();
                    } else {
                      this.level("../").row("title", val );
                      this.level("../").data("isEditing", false );
                    }
                    updateLocalStorage();
                }
              }
            },
            "Cross": {
              props: {
                centerY: LAID.take("../", "$midpointY"),
                right: 10,
                width:40,
                height:40,
                cursor: "default",
                text: "×",
                textSize: 30,
                textLineHeight:1,
                textAlign: "center",
                textColor: LAID.hex(0xcc9a9a)
              },
              states:{
                "hidden": {
                  onlyif: LAID.take("../", "$hovering").not().or(
                    LAID.take("../", "data.isEditing")),
                  props: {
                    display: false
                  }
                },
                "hovering":{
                  onlyif: LAID.take("","$hovering"),
                  props: {
                    textColor: LAID.hex(0xaf5b5e)
                  }
                }
              },
              transition: {
                textColor: {
                  type: "ease-out",
                  duration: 200
                }
              },
              when: {
                click: function () {
                  LAID.level("/App/Container/Todos/Todo").rowDeleteByID(
                    this.level("../").attr("row.id"));
                  updateLocalStorage();
                }
              }
            }
          }
        },
        "BottomControls": {
          props: {
            height: 42,
            width:LAID.take("../", 'width'),
            top: LAID.take("../Todos", "bottom"),
            textColor: LAID.rgb(119, 119, 119),
            borderTop: {style:"solid", width: 1,
              color: LAID.hex(0xe6e6e6)}
          },
          states: {
            "hidden": {
              onlyif: LAID.take("../Sheets", "hidden.onlyif"),
              props: {
                display: false
              }
            }
          },
          "Strip": {
            props: {
              width: LAID.take("../", "width").subtract(30),
              centerX: LAID.take("../", "$midpointX"),
              centerY: LAID.take("../", "$midpointY")
            },
            "RemainingCount": {
              data: {
                remaining: LAID.take("/App/Container/Todos/Todo", "rows").filterEq("complete", false).length()
              },
              props: {
                centerY: LAID.take("../", "$midpointY"),
                text: LAID.take("%d items left").format(LAID.take("", "data.remaining")),
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
                centerX: LAID.take("../", "$midpointX")
              },
              "Category": {                    
                props: {
                  cursor:"pointer",
                  border: {style: "solid", width: 1,
                    color: LAID.transparent()},
                  cornerRadius: 3,
                  text: LAID.take("", "row.text"),
                  textPadding: {top:2, bottom:2, left:7, right:7}

                },
                states: {
                  "selected": {
                    onlyif: LAID.take("", "row.selected"),
                    props: {
                      borderColor: LAID.rgba(175, 47, 47, 0.2)
                    }
                  },
                  "hover": {
                    onlyif: LAID.take("", "$hovering").eq(true).and(
                      LAID.take("", "row.selected").not()),
                    props: {
                      borderColor: LAID.rgba(175, 47, 47, 0.1)
                    }
                  }
                },
                when: {
                  click: function () {
                    if ( !this.attr("row.selected") ) {
                      LAID.clog();
                      this.many().rowsUpdate("selected", false);
                      this.row("selected", true);
                      LAID.unclog();
                      updateLocalStorage();
                    }
                  }
                },
                many: {
                  data: {
                    selected: LAID.take("", "rows").
                      filterEq("selected", true).
                      index(0).key("text")
                  },
                  $load: function () {
                    /*if ( window.localStorage ) {
                      var prevSelectedText = localStorage.getItem("selected");
                      if ( prevSelectedText ) {
                        LAID.clog();
                        //this.rowsUpdate("selected", false );
                        this.rowsUpdate("selected",
                          this.queryRows().filterEq("text", prevSelectedText),
                          "selected", true);
                        LAID.unclog();
                
                      }
                    }*/
                  },
                  formation: "totheright",
                  fargs: {
                    totheright: {
                      gap:10
                    }
                  },
                  $id: "id",
                  rows: [
                    {id:1, text: "All", selected: true },
                    {id:2, text: "Active", selected: false },
                    {id:3, text: "Completed", selected: false }
                  ]
                }
              }                   
            },
            "ClearCompleted": {
              props: {
                cursor: "pointer",
                right: 0,
                centerY: LAID.take("../", "$midpointY"),
//                height: LAID.take("/", "textSize"),
                text: "Clear completed"
              },
              when: {
                click: function () {
                  var many = LAID.level("/App/Container/Todos/Todo");
                  many.rowsDelete(
                    many.queryRows().filterEq("complete", true ) );
                  updateLocalStorage();
                }
              },
              states: {
                "hidden": {
                  onlyif: LAID.take("/App/Container/Todos/Todo", "rows").filterEq("complete", true).length().eq(0),
                  props: {
                    display: false
                  }
                },
                "hover": {
                  onlyif: LAID.take("", "$hovering"),
                  props: {
                    textDecoration: "underline"
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
              {x:0, y:17, blur:2, spread:-6, color: LAID.rgba(0,0,0,0.2) }
            ]
          },
          states: {
            "hidden": {
              onlyif: LAID.take("/App/Container/Todos/Todo", "rows").length().eq(0),
              props: {
                display: false
              }
            }
          }
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
          text: LAID.take("", "row.text"),
          textLineHeight: 1
        },

        many: {
          formation: "onebelow",
          fargs: {
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
    },
    "Learn": {
      props: {
        width: 300,
        height:200,
        backgroundColor: LAID.rgba(255,255,255,0.6),
        userSelect: "auto"         
      },
      states: {
        "hidden": {
          onlyif: LAID.take("/", "width").lt(
            LAID.take("/", "data.sidebarResponsiveWidth")),
          props: {
            left: LAID.take("", "width").negative()
          }
        }
      },
      transition: {
        left: {
          type: "ease",
          duration: 500
        }
      },
      
      "Wrapper": {
        props: {
          width: LAID.take("../", "width").minus(40),
          height: LAID.take("../", "height").minus(40),
          centerX: LAID.take("../", "$midpointX")
        },
        
        "Name": {
          props: {
            top: 20,
            text: "LAID.JS",
            textWeight: "bold",
            textSize: 24
          }
        },
        "Examples": {
          props: {
            top: LAID.take("../Name", "bottom").add(
              LAID.take("Example", "fargs.onebelow.gap"))
          },          
          "Example": {
            many: {
              formation:"onebelow",
              fargs: {onebelow:{gap:8}},
              rows: [{id:1, title:"Example", links: "<a href='/'>Source</a>"}]
            },
            "Title": {
              props: {
                text: LAID.take("../", "row.title"),
                textWeight: "bold"
              }
            },
            "Links": {
              props: {
                top: LAID.take("../Title", "bottom"),
                text: LAID.take("../", "row.links")
              }
            }
          }
        },
        "FirstLine": {
          props: {
            top: LAID.take("../Examples", "bottom").add(10),
            width: LAID.take("../", "width"),
            height:2,
            border: {
              top: {style:"dashed", width:1,
              color: LAID.hex(0xc5c5c5)},
              bottom: {style:"dashed", width:1,
              color: LAID.hex(0xf7f7f7)}
            }
          }
        },
        "Quote": {
          props: {
            top: LAID.take("../FirstLine", "bottom").add(10),
            text: "dump css and get laid"
          }
        },
        "SecondLine": {
          $inherit: "../FirstLine",
          props: {
            top: LAID.take("../Quote", "bottom").add(10)
          }
        }
        
      }
      
    }
     
});

/*
LAID.run({
  props: {
    backgroundColor: LAID.color("gainsboro")
  },
  "Container": {
    props: {
      centerX: LAID.take("../", "$midpointX"),
      centerY: LAID.take("../", "$midpointY"),
      backgroundColor: LAID.color("pink")
    },
    transition: {
      all: {
        type: "linear",
        duration: 200
      }
    },
    "Person": {
      props: {
        width: 180,
        cursor: "default",
        border: {style:"solid",
         color: LAID.color("red"),
         width:1
      },
        backgroundColor: LAID.color("blue"),
        text: LAID.take("", "row.content"),
        textSize:20,
        textPadding: 10,
        textColor: LAID.color("white")
      },
      when: {
        click: function () {
          this.many().data("sidebiz",
            !this.many().attr("data.sidebiz") )
          }
      },
      transition: {
        all: {
          type: "linear",
          duration: 200
        }
      },
      states: {
        "hover": {
          onlyif: LAID.take("","$hovering"),
          props: {
            textColor: LAID.color("grey")

          }
        }
      },
      many: {
        data: {
          asc: true,
          sidebiz: false
        },
        formation: "onebelow",            
        sort: [{key: "content",
          ascending: LAID.take("", "data.asc")}],
        rows: [
          {id:1, content: "Airbus" },
          {id:2, content: "Boeing" },
          {id:3, content: "NASA" },
          {id:4, content: "Zeil" }
        ],
        states: {
          "sidebiz": {
            onlyif: LAID.take("", "data.sidebiz"),
            formation: "totheright",
            fargs: {
              totheright: {gap:10}
            }
          }
        }
      }
    } 
  }
});



/*
LAID.run({
  props: {
    backgroundColor: LAID.color("pink")
  },
  
  "First": {
    props: {
      centerX: LAID.take("../", "$midpointX"),
      centerY: LAID.take("../", "$midpointY"),

      width:100,
      height:100,
     border: {
        style: "solid",
        width:1,
        color:LAID.color("green")
      }
    }
  },
 "Second": {
    $inherit: ["../First"],
    props: {
      top: LAID.take("../First", "bottom")
    }
  }
});
*/


if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}

function updateLocalStorage () {
  var rows = LAID.level("/App/Container/Todos/Todo").attr("rows");
  if ( window.localStorage ) {
    window.localStorage.setItem("todos", JSON.stringify(rows));
  }
}











