
var springTransition = {
  type:"spring",
    args: {
      velocity: 20,
      tension: 200.0,
      friction: 15.9
  }
};


LAY.run( {
  data: {
    lang: "en",
    menu: false
  },
  states: {
    menu: {
      onlyif: LAY.take("", "data.menu")
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
        height:LAY.take("/", "height"),
        width:300,
        backgroundColor:LAY.color("gainsboro"),
        zIndex:1
      },
      transition: {
        left: springTransition
      },

      states: {
        "hidden": {
          onlyif: LAY.take("/", "data.menu").not(),
          props: {
            left: LAY.take("","width").negative()
          }
        },
        "shown": {
          onlyif: LAY.take("/", "data.menu"),
          props: {
            left: 0
          }
        }
      }
    },

    "Content": {
      props: {
        width:LAY.take("/", "width"),
        height:LAY.take("/", "height")
      },
      transition: {
        left: springTransition
      },

      states: {
        "hidden": {
          onlyif:LAY.take("/", "data.menu"),
          props: {
            left: LAY.take("../Menu", "width")
          }
        }
      },
      children: {
        "Header": {
          props: {
            width: LAY.take( '../', 'width'),
            backgroundColor: LAY.color( "black" )
          },
          

          children: {
            "MenuInvoke": {
              props: {
                left: 30,
                centerY: LAY.take( "../", "$midpointY")
              },
              states: {
                "hidden": {
                  onlyif: LAY.take("/", "data.menu").not(),
                  when: {
                    click: [
                      function () {
                        LAY.level("/").data("menu", true);
                      }
                    ]
                  }
                },
                "shown": {
                  onlyif: LAY.take("/", "data.menu"),
                  when: {
                    click: [
                      function () {
                        LAY.level("/").data("menu", false);
                      }
                    ]
                  }
                },

                "click": {
                  onlyif: LAY.take("", "$clicking"),
                  props: {
                    shiftX: 3,
                    shiftY: 3
                  }
                }
              },

              children: {
                "Wrapper": {
                    props: {
                      centerX: LAY.take("../", "$midpointX"),
                      centerY: LAY.take("../", "$midpointY"),
                      width: LAY.take("", "$naturalWidth").max( LAY.take("", "$naturalHeight") ),
                      height: LAY.take("", "width"),
                      overflow: "visible"
                    },
                    children: {
                      "TopBar": {
                        $inherit: [ "/_SpringTransition" ],
                        data: {
                          barDistance: LAY.take(function ( width, height ) {
                            var numBars = 3;
                            return (width - (numBars * height))/2;
                          }).fn(LAY.take("", "width"),LAY.take("", "height"))
                        },
                        props: {
                          width:18,
                          height:3,
                          backgroundColor:LAY.color("white"),
                          cornerRadius:10
                        },
                        states: {
                          "cross": {
                            onlyif: LAY.take("/", "data.menu"),
                            props: {
                              rotateZ: 45,
                              width: LAY.take("", "root.width").multiply(1.5),
                              top: LAY.take("../MiddleBar", "root.top")
                            }
                          }
                        }
                      },
                      "MiddleBar": {
                        $inherit: ["../TopBar"],
                        props: {
                          top:LAY.take("", "data.barDistance").add(LAY.take("","height"))
                        },
                        states: {
                          "cross": {
                            onlyif: LAY.take("/", "data.menu"),
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
                          top:LAY.take("../MiddleBar", "top").multiply(2)
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
                centerX: LAY.take("../", "$midpointX"),
                centerY: LAY.take("../", "$midpointY"),
                text: "WOLPART",
                textAlign: "center",
                textColor: LAY.color( "white"),
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
                  onlyif: LAY.take("", "data.isRotating"),
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
            width: LAY.take("../", 'width'),
            top: LAY.take("../Header", "bottom"),
            height: LAY.take("../", "height").subtract(LAY.take("../Header", "height")),
            backgroundColor: LAY.color("gainsboro"),
            overflowY: "auto"
          },
          transition:{
            height:springTransition
          },
          children: {
            "Option1": {
              props: {
                width:LAY.take("../", 'width').subtract(20),
                centerX: LAY.take("../", "$midpointX"),
                height:120,
                backgroundColor:LAY.color("blue"),
                text: LAY.take("Is data travelling? %s <br> Delta? %s").format( 
                  LAY.take("/", "$dataTravelling"),
                  LAY.take("/", "$dataTravelDelta")
                   ),
                textPadding:10,
                textColor:LAY.take("", "backgroundColor").colorInvert()
              }
            },
            "Option2": {
              $inherit: ["../Option1"],
              props: {
                top: LAY.take("../Option1", "height").add(10),
                backgroundColor:LAY.take("../Option1", "backgroundColor").colorInvert(),
                text: LAY.take({
                  "en": "color: %s",
                  "zh": "颜色: %s"
                }).i18nFormat(LAY.take("", "backgroundColor"))
              }
            }
          }
        },
        "BodyOverlay": {
          data: {
            startMove: 0,
            fnCalculateDelta: function (e) {
              var startMove = this.attr("data.startMove");
              var menuWidth = LAY.level("/Menu").attr("width");
              var curMove = e.pageX;
              var delta = (startMove - curMove) / menuWidth;
              return delta;
            },
            didMouseMove: false
          },
          props: {
            cursor:"default",
            top: LAY.take("../Body", "top"),
            width:LAY.take("../Body", "width"),
            height:LAY.take("../Body", "height"),
            backgroundColor:LAY.color("black")
          },
          transition: {
            opacity: springTransition
          },
          states: {
            "hidden": {
              onlyif: LAY.take("/", "data.menu").not(),

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
//                    if ( LAY.level("/").attr("$dataTravellingLevel")  ) {
                      this.data("didMouseMove", true);
                      LAY.level("/").dataTravelContinue(
                        this.attr("data.fnCalculateDelta").call( this, e)
                      );

                    }
//                  }
                ],
                mouseup: [
                  function (e) {
                    if ( LAY.level("/").attr("$dataTravelling") ) {
                      if ( this.attr("data.didMouseMove") ) {
                        LAY.level("/").dataTravelArrive(
                          ( this.attr("data.fnCalculateDelta").call(
                             this, e) > 0.5 )
                        )
                      } else {
                        LAY.level("/").dataTravelArrive(true);
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
              onlyif: LAY.take("/", "data.menu"),
              props: {
                opacity:0.5,
                zIndex:1
              },
              when: {

                mousedown: [
                  function (e) {
                    if ( !LAY.level("/").attr("$dataTravelling" ) ) {
                      this.data("startMove", e.pageX );
                      LAY.level("/").dataTravelBegin( "menu", false );

                    }
                  }
                ],
                click: [
                  function () {
                    if (!this.attr("data.didMouseMove") ) {
                      LAY.level("/").data("menu", false);
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



var z = ({
  props: {
    backgroundColor: LAY.color("gainsboro")
  },
  "Box": {
    props: {
      centerX: LAY.take("../", "$midpointX"),
      centerY: LAY.take("../", "$midpointY"),      
    },
    "Child": {
      props: {
        width:50,
        height:50,
        backgroundColor: LAY.color("red")
      }
    },
    "Child2": {
      $inherit: "../Child",
      data: {
        down: false,
      },
      props: {
        top:LAY.take("../Child", "bottom"),
        backgroundColor:LAY.color("blue")
      },
      states: {
        "down": {
          onlyif: LAY.take("", "data.down"),
          props: {
            top: LAY.take("","root.top").add(10)
          },
        }
      },
      when: {
        click: function () {
          this.data("down", true);
        }
      }
    }
  }
});

var y =({
  children: {
    "Grand": {
      props:{
        centerY: LAY.take("../", "$midpointY")
      },
      children: {
        "Parent": {
          props:{
          //  centerX: LAY.take("../", "$midpointX"),
        //    centerY: LAY.take("../", "$midpointY"),
            width: 1000,
                height:100,
                backgroundColor:LAY.color("red")
          },
          children: {
            "Baby": {
              props: {
                width: 100,
                height:50,
                backgroundColor:LAY.color("blue")
              }
            }
          }
        }
      }
    }
  }

});

/**/
