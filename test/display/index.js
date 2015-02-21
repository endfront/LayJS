

LAID.run( {
  data: {
    lang: "en",
    menu: false
  },
  states: {
    menu: {
      onlyif: LAID.take("this", "data.menu")
    }
  },
  children: {
    "_SpringTransition": {
      transition: {
        all: {
          type:"spring",
          args: {
            tension: 191.0,
            friction: 12.9,
            //velocity:0.0,
          }
        }
      }
    },
    "Menu": {
      inherit: [ "/_SpringTransition" ],
      props: {
        height:LAID.take("../", "height"),
        width:300,
        backgroundColor:LAID.color("gainsboro"),
        zIndex:1
      },

      states: {
        "hidden": {
          onlyif: LAID.take("/", "data.menu").not(),
          props: {
            left: LAID.take("this","width").negative()
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
      inherit: [ "/_SpringTransition" ],
      props: {
        width:LAID.take("../", "width"),
        height:LAID.take("../", "height")
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
                  onlyif: LAID.take("this", "$clicked"),
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
                      width: LAID.take("this", "$naturalWidth").max( LAID.take("this", "$naturalHeight") ),
                      height: LAID.take("this", "width"),
                      overflowX: "visible",
                      overflowY: "visible"

                    },
                    children: {
                      "TopBar": {
                        inherit: [ "/_SpringTransition" ],
                          data: {
                            barDistance:LAID.take(function ( width, height, numBars) {
                              return (width - (numBars * height))/2;
                            }).fn(LAID.take("this", "width"),LAID.take("this", "height"),
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
                                width: LAID.take("this", "root.width").multiply(1.5),
                                top: LAID.take("../MiddleBar", "root.top")
                                //width: LAID.take("this", "root.width").divide(Math.sin(45))
                              }
                            }
                          }
                      },
                      "MiddleBar": {
                        inherit: ["../TopBar"],
                        props: {
                          top:LAID.take("this", "data.barDistance").add(LAID.take("this","height"))
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
                        inherit: ["../TopBar"],
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
              inherit: ["/_SpringTransition"],
              data: {
                isRotating: false
              },
              props: {
                centerX: LAID.take("../", "width").divide(2),
                text: "WOLPART",
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
          inherit:[ "/_SpringTransition" ],

          props: {
            width: LAID.take("../", 'width'),
            top: LAID.take("../Header", "bottom"),
            height: LAID.take("../", "height").subtract(LAID.take("../Header", "height")),
            backgroundColor: LAID.color("gainsboro"),
            overflowY: "auto",
          },

          children: {
            "Option1": {
              props: {
                width:LAID.take("../", 'width').subtract(20),
                centerX: LAID.take("../","width").divide(2),
                height:220,
                backgroundColor:LAID.color("blue"),
                text: "Hello Mars",
                textPadding:10,
                textColor:LAID.take("this", "backgroundColor").colorInvert()
              }
            },
            "Option2": {
              inherit: ["../Option1"],
              props: {
                top: LAID.take("../Option1", "height").add(10),
                backgroundColor:LAID.take("../Option1", "backgroundColor").colorInvert(),
                text: LAID.take({
                  "en": "number: %s",
                  "zh": "li: %s"
                }).i18nFormat(LAID.take("this", "backgroundColor").colorStringify())
              },
            }
          }
        },
        "BodyOverlay": {
          inherit: [ "/_SpringTransition" ],
          data: {
            startMove: 0,
            fnCalculateDelta: function (e) {
              var startMove = LAID.level("", this).attr("data.startMove");
              var menuWidth = LAID.level("/Menu", this).attr("width");
              var curMove = e.pageX;
              var delta = (startMove - curMove) / menuWidth;
              return delta;
            }
          },
          props: {
            top: LAID.take("../Body", "top"),
            width:LAID.take("../Body", "width"),
            height:LAID.take("../Body", "height"),
            backgroundColor:LAID.color("black"),
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
                    if ( LAID.dataTravellingLevel ===  LAID.level("/") ) {

                      LAID.level("/").dataTravelContinue(
                        this.attr("data.fnCalculateDelta").call( this, e)
                      );

                    }
                  }
                ],
                mouseup: [
                  function (e) {
                    if ( LAID.dataTravellingLevel ===  LAID.level("/") ) {
                      LAID.level("/").dataTravelArrive(
                        this.attr("data.fnCalculateDelta").call( this, e) > 0.5
                      );
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
                /*click: [
                  function () {
                    LAID.level("/").data("menu", false);
                  }
                ],*/
                mousedown: [
                  function (e) {
                    if ( !LAID.isDataTravelling ) {
                      LAID.level("", this).data("startMove", e.pageX );
                      LAID.level("/").dataTravelBegin( "menu", false );

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
            height:LAID.take("this", "data.proxy").add(10),
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
