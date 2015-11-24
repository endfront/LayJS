
var springTransition = {
  type:"spring",
    args: {
      velocity: 20,
      tension: 200.0,
      friction: 15.9
  }
};


LAID.run( {
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
      transition: {
        all: springTransition
      }
    },
    "Menu": {
      props: {
        height:LAID.take("/", "height"),
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
        width:LAID.take("/", "width"),
        height:LAID.take("/", "height")
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
                centerY: LAID.take( "../", "$midpointY")
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

                "click": {
                  onlyif: LAID.take("", "$clicking"),
                  props: {
                    shiftX: 3,
                    shiftY: 3
                  }
                }
              },

              children: {
                "Wrapper": {
                    props: {
                      centerX: LAID.take("../", "$midpointX"),
                      centerY: LAID.take("../", "$midpointY"),
                      width: LAID.take("", "$naturalWidth").max( LAID.take("", "$naturalHeight") ),
                      height: LAID.take("", "width"),
                      overflow: "visible"
                    },
                    children: {
                      "TopBar": {
                        $inherit: [ "/_SpringTransition" ],
                        data: {
                          barDistance: LAID.take(function ( width, height ) {
                            var numBars = 3;
                            return (width - (numBars * height))/2;
                          }).fn(LAID.take("", "width"),LAID.take("", "height"))
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
              data: {
                isRotating: false
              },
              props: {
                centerX: LAID.take("../", "$midpointX"),
                centerY: LAID.take("../", "$midpointY"),
                text: "WOLPART",
                textAlign: "center",
                textColor: LAID.color( "white"),
                textPadding:{top: 20,bottom:20},
                textSize: 30,
                textLetterSpacing:1
              }
              /*$load: function () {
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
          }
        },
        "Body": {
          
          props: {
            width: LAID.take("../", 'width'),
            top: LAID.take("../Header", "bottom"),
            height: LAID.take("../", "height").subtract(LAID.take("../Header", "height")),
            backgroundColor: LAID.color("gainsboro"),
            overflowY: "auto"
          },
          transition:{
            height:springTransition
          },
          children: {
            "Option1": {
              props: {
                width:LAID.take("../", 'width').subtract(20),
                centerX: LAID.take("../", "$midpointX"),
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
              }
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
            backgroundColor:LAID.color("black")
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
            }
          }
        }
      }
    }
  }
});





var y =({
  children: {
    "Grand": {
      props:{
        centerY: LAID.take("../", "$midpointY")
      },
      children: {
        "Parent": {
          props:{
          //  centerX: LAID.take("../", "$midpointX"),
        //    centerY: LAID.take("../", "$midpointY"),
            width: 1000,
                height:100,
                backgroundColor:LAID.color("red")
          },
          children: {
            "Baby": {
              props: {
                width: 100,
                height:50,
                backgroundColor:LAID.color("blue")
              }
            }
          }
        }
      }
    }
  }

});

/**/
