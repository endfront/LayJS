
var springTransition = {
  type:"spring",
    args: {
      velocity: 20,
      tension: 200.0,
      friction: 15.9,
  }
};


var x = ( {
  data: {
    lang: "en",
    menu: false
  },
  states: {
    menu: {
      onlyif: LAID.take("", "data.menu")
    }
  },
  children: {
    "_SpringTransition": {
      $interface:true,
      transition: {
        all: springTransition
      }
    },
    "Menu": {
      props: {
        height:LAID.take("../", "height"),
        width:300,
        backgroundColor:LAID.color("gainsboro"),
        zIndex:1
      },
      transition: {
        left: springTransition
      },

      states: {
        "hidden": {
          onlyif: LAID.take("/", "data.menu").not(),
          props: {
            left: LAID.take("","width").negative()
          }
        },
        "shown": {
          onlyif: LAID.take("/", "data.menu"),
          props: {
            left: 0
          }
        }
      }
    },

    "Content": {
      props: {
        width:LAID.take("../", "width"),
        height:LAID.take("../", "height")
      },
      transition: {
        left: springTransition
      },

      states: {
        "hidden": {
          onlyif:LAID.take("/", "data.menu"),
          props: {
            left: LAID.take("../Menu", "width")
          }
        }
      },
      children: {
        "Header": {
          props: {
            width: LAID.take( '../', 'width'),
            backgroundColor: LAID.color( "black" )
          },
          

          children: {
            "MenuInvoke": {
              props: {
                left: 30,
                centerY: LAID.take( "../", "height").divide(2),
                width:LAID.take("Wrapper", "width").add(20),
                height:LAID.take("Wrapper", "height").add(20),
                cornerRadius:100
              },
              states: {
                "hidden": {
                  onlyif: LAID.take("/", "data.menu").not(),
                  when: {
                    click: [
                      function () {
                        LAID.level("/").data("menu", true);
                      }
                    ]
                  }
                },
                "shown": {
                  onlyif: LAID.take("/", "data.menu"),
                  when: {
                    click: [
                      function () {
                        LAID.level("/").data("menu", false);
                      }
                    ]
                  }
                },


                "clicked": {
                  onlyif: LAID.take("", "$clicked"),
                  props: {
                    shiftX: 3,
                    shiftY: 3
                  }
                }
              },

              children: {
                "Wrapper": {
                    props: {
                      centerX: LAID.take("../", "width").divide(2),
                      centerY: LAID.take("../", "height").divide(2),
                      width: LAID.take("", "$naturalWidth").max( LAID.take("", "$naturalHeight") ),
                      height: LAID.take("", "width"),
                      overflowX: "visible",
                      overflowY: "visible"

                    },
                    children: {
                      "TopBar": {
                        $inherit: [ "/_SpringTransition" ],
                          data: {
                            barDistance:LAID.take(function ( width, height, numBars) {
                              return (width - (numBars * height))/2;
                            }).fn(LAID.take("", "width"),LAID.take("", "height"),
                                  LAID.take("../", "$numberOfChildren"))
                          },
                          props: {
                            width:18,
                            height:3,
                            backgroundColor:LAID.color("white"),
                            cornerRadius:10
                          },
                          states: {
                            "cross": {
                              onlyif: LAID.take("/", "data.menu"),
                              props: {
                                rotateZ: 45,
                                width: LAID.take("", "root.width").multiply(1.5),
                                top: LAID.take("../MiddleBar", "root.top")
                              }
                            }
                          }
                      },
                      "MiddleBar": {
                        $inherit: ["../TopBar"],
                        props: {
                          top:LAID.take("", "data.barDistance").add(LAID.take("","height"))
                        },
                        states: {
                          "cross": {
                            onlyif: LAID.take("/", "data.menu"),
                            props: {
                              rotateZ: 0,
                              opacity: 0
                            }
                          }
                        }
                      },
                      "BottomBar": {
                        $inherit: ["../TopBar"],
                        props: {
                          top:LAID.take("../MiddleBar", "top").multiply(2)
                        },
                        states: {
                          "cross": {
                            props: {
                              rotateZ: -45
                            }
                          }
                        }
                    }
                  }
                }
              }
            },
            "Title": {
              //$inherit: ["/_SpringTransition"],
              data: {
                isRotating: false
              },
              props: {
                centerX: LAID.take("../", "width").divide(2),
                text: "WOLPART",
//                height:200,
                textAlign: "center",
                textColor: LAID.color( "white"),
                textPadding:20,
                textSize: 30,
                textLetterSpacing:1
              },
              /*load: function () {
                this.data("isRotating", true);

              },
              transition: {
                rotateZ: {
                  type:"linear",
                  duration:1000
                }
              },

              states: {
                "rotating": {
                  onlyif: LAID.take("", "data.isRotating"),
                  props: {
                    rotateZ: 360
                  },
                  transition: {
                    rotateZ:{
                      done: function () {
                        this.data("isRotating", false);

                      }
                    }
                  },
                  uninstall: function () {
                    var self = this;
                    setTimeout(function(){
                          self.data("isRotating", true);
                    });
                  }
                },

              }*/
            }
          },
        },
        "Body": {
          
          props: {
            width: LAID.take("../", 'width'),
            top: LAID.take("../Header", "bottom"),
            height: LAID.take("../", "height").subtract(LAID.take("../Header", "height")),
            backgroundColor: LAID.color("gainsboro"),
            overflowY: "auto",
          },
          transition:{
            height:springTransition
          },

          children: {
            /*"Option" : {
              props: {
                width:LAID.take("../", 'width').subtract(20),
                height:120,
                backgroundColor: LAID.color("blue"),
                centerX: LAID.take("../","width").divide(2),
                backgroundColor:LAID.color("blue"),
                textColor:LAID.take("", "backgroundColor").colorInvert(),
                text: "hlrlo world"
//                text: LAID.take("", "row.title")

              },
              many:{
                formation: "onebelow",
                $id: "id",
                rows: [
                  {id:1, title:"first"},
                  {id:2, title:"second"}
                ]
              }
            }*/
            "Option1": {
              props: {
                width:LAID.take("../", 'width').subtract(20),
                centerX: LAID.take("../","width").divide(2),
                height:120,
                backgroundColor:LAID.color("blue"),
               text: LAID.take("Is data travelling? %s <br> Delta? %s").format( 
                  LAID.take("/", "$dataTravelling"),
                  LAID.take("/", "$dataTravelDelta")
                   ),
                textPadding:10,
                textColor:LAID.take("", "backgroundColor").colorInvert()
              }
            },
            "Option2": {
              $inherit: ["../Option1"],
              props: {
                top: LAID.take("../Option1", "height").add(10),
                backgroundColor:LAID.take("../Option1", "backgroundColor").colorInvert(),
                text: LAID.take({
                  "en": "color: %s",
                  "zh": "颜色: %s"
                }).i18nFormat(LAID.take("", "backgroundColor"))
              },
            }
          }
        },
        "BodyOverlay": {
          data: {
            startMove: 0,
            fnCalculateDelta: function (e) {
              var startMove = this.attr("data.startMove");
              var menuWidth = LAID.level("/Menu").attr("width");
              var curMove = e.pageX;
              var delta = (startMove - curMove) / menuWidth;
              return delta;
            },
            didMouseMove: false
          },
          props: {
            cursor:"default",
            top: LAID.take("../Body", "top"),
            width:LAID.take("../Body", "width"),
            height:LAID.take("../Body", "height"),
            backgroundColor:LAID.color("black"),
          },
          transition: {
            opacity: springTransition
          },
          states: {
            "hidden": {
              onlyif: LAID.take("/", "data.menu").not(),

              props: {
                opacity:0,
                zIndex:-1
              },
              transition: {
                zIndex: {
                  delay: 200
                }
              },
              when: {
                mousemove: [
                  function (e) {
//                    if ( LAID.level("/").attr("$dataTravellingLevel")  ) {
                      this.data("didMouseMove", true);
                      LAID.level("/").dataTravelContinue(
                        this.attr("data.fnCalculateDelta").call( this, e)
                      );

                    }
//                  }
                ],
                mouseup: [
                  function (e) {
                    if ( LAID.level("/").attr("$dataTravelling") ) {
                      if ( this.attr("data.didMouseMove") ) {
                        LAID.level("/").dataTravelArrive(
                          ( this.attr("data.fnCalculateDelta").call(
                             this, e) > 0.5 )
                        )
                      } else {
                        LAID.level("/").dataTravelArrive(true);
                      }
                      var self = this;
                      setTimeout(function(){
                        // delay for click event to realize change later
                        self.data("didMouseMove", false);
                      });

                    }
                  }
                ]
              }
            },
            "shown": {
              onlyif: LAID.take("/", "data.menu"),
              props: {
                opacity:0.5,
                zIndex:1
              },
              when: {

                mousedown: [
                  function (e) {
                    if ( !LAID.level("/").attr("$dataTravelling" ) ) {
                      this.data("startMove", e.pageX );
                      LAID.level("/").dataTravelBegin( "menu", false );

                    }
                  }
                ],
                click: [
                  function () {
                    if (!this.attr("data.didMouseMove") ) {
                      LAID.level("/").data("menu", false);
                    }
                  }
                ]
              }
            },
          }
        }
      }
    }

  }
});



LAID.run({
  props: {
    backgroundColor: LAID.color("whitesmoke"),
    textFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    textSmoothing: "antialiased",
//    textLineHeight: "1.4em",
    textColor: LAID.rgb(77,77,77)
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
  //      textLineHeight: "1em"

      }
    },
    "Container": {
      props:{
        top: LAID.take("../Header", "bottom"),
        centerX: LAID.take("../", "width").divide(2),
        width:560,
    //    height:300,
        overflowX: "visible",
        overflowY:"visible",
        boxShadows: [
          {x:0, y:2, blur:4, color: LAID.rgba(0,0,0,0.2) },
          {x:0, y:25, blur:50, color: LAID.rgba(0,0,0,0.1) },
        ]
         // 0 2px 4px 0 rgba(0, 0, 0, 0.2),
        // 0 25px 50px 0 rgba(0, 0, 0, 0.1)
       // height:200
      },
      states: {
        "responsive": {
          onlyif: LAID.take("/", "width").lt(560),
          props: {
            width: LAID.take("/", "width")
          }
        }
      },
      children: {
        "TodosWrapper": {
          props:{
            width: LAID.take("../", "width")
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
                    gap: 10
                  },
                  totheright: {
                    gap: 10
                  },
                  grid: {
                    columns: 3 
                  }
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
              height:17,
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
        textColor: LAID.rgb(191,191,191)
      },
      children: {
        "Info": {
          props: {
            width: LAID.take("../", "width"),
            text: "double click to edit"
          }
        },
        "Author": {
          props: {
            width: LAID.take("../", "width"),
            top: LAID.take("../Info", "bottom").add(10),
            text: 
              "created by <a href='https://github.com/relfor'>relfor</a>"
          }
        },
        "PartOf": {
          props: {
            width: LAID.take("../", "width"),
            top: LAID.take("../Author", "bottom").add(10),
            text: "Part of TodoMVC"
          }
        }
      }
    }
  }
        
});
 


var w = ({
  props: {
    backgroundColor: LAID.color("red")
  },
  children: {
    "Top": {
      data: {
        on: true
      },
      props: {
        height: LAID.take("../", "height").divide(2),
        width: LAID.take("../", "width"),
        backgroundColor: LAID.color("blue")
      },
      states: {
        "on": {
          onlyif: LAID.take("", "data.on"),
          props: {
            bottom: 700
          }
        }
      }
    }
  }
});

/*
LAID.run({
  children: {
    "Parent": {
      props: {

        width:200,
        backgroundColor:LAID.color("black")
      },
      children: {
        "Child1": {
          data: {
            proxy: LAID.take("../", "height")
          },
          props: {
            width:100,
            height:LAID.take("", "data.proxy").add(10),
            backgroundColor:LAID.color("blue")
          }

        },
        "Child2": {
          props: {
            width:100,
            height:20,
            left:100,
            backgroundColor:LAID.color("green")
          }
        }
      }
    }
  }

});*/

/**/
