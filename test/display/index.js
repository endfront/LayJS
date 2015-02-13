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
    "Menu": {
      props: {
        height:LAID.take("../", "height"),
        width:300,
        backgroundColor:LAID.color("gainsboro"),
        zIndex:1
      },
      transition: {
        left: {
          duration:200,
          type:"ease"
        }
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
      props: {
        width:LAID.take("../", "width"),
        height:LAID.take("../", "height")
      },

      transition: {
        all:{
          type:"ease",
          duration:200,
          args: {
            a: .86,
            b: -0.06,
            c: .54,
            d: 1.56
          }
        }
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
                width:20,
                centerY: LAID.take( "../", "height").divide(2),
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




                "hovered": {
                  onlyif: LAID.take("this", "$hovered"),
                  props: {
                    opacity:1,

                  },
                  transition: {
                    boxShadows1Color: {
                      type: "ease",
                      duration:1000
                    },
                    opacity: {
                      type:"ease",
                      duration: 200
                    },
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

              transition: {
                boxShadows1Color: {
                  type: "ease",
                  duration:10000
                }
              },
              children: {
                "TopBar": {
                    props: {
                      width:LAID.take("../", "width"),
                      height:3,
                      backgroundColor:LAID.color("white"),
                      rotateX: 30
                    },
                    transition: {
                      all: {
                        type:"ease",
                        duration: 200
                      }
                    },
                    states: {
                      "cross": {
                        onlyif: LAID.take("/", "data.menu"),
                        props: {
                          rotateX: 30
                        }
                      }
                    }
                },
                "MiddleBar": {
                  inherits: ["../TopBar"],
                  props: {
                    top:6
                  },
                  states: {
                    "hidden": {
                      onlyif: LAID.take("/", "data.menu"),
                      props: {
                        opacity: 0
                      }
                    }
                  }
                },
                "BottomBar": {
                  inherits: ["../TopBar"],
                  props: {
                    top: 12
                  }
                }

              }
            },
            "Title": {
              props: {
                //width: LAID.take( "../", "width"),
                centerX: LAID.take("../", "width").divide(2),
                text: "WOLPART",
                textAlign: "center",
                textColor: LAID.color( "white"),
                textPadding:20,
                textSize: 30,
                textLetterSpacing:1
              }
            }
          },
        },
        "Body": {
          props: {
            width: LAID.take("../", 'width'),
            top: LAID.take("../Header", "bottom"),
            //height:300,
            height: LAID.take("../", "height").subtract(LAID.take("../Header", "height")),
            backgroundColor: LAID.color("gainsboro"),
            overflowY: "auto",

          },
          children: {
            "Option1": {
              props: {
                width:LAID.take("../", 'width').subtract(20),
                centerX: LAID.take("../","width").divide(2),
                height:150,
                backgroundColor:LAID.color("blue"),
                text: "Hello Mars",
                textPadding:10,
                textColor:LAID.take("this", "backgroundColor").colorInvert()
              }
            },
            "Option2": {
              inherits: ["../Option1"],
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
        }
        ,"BodyOverlay": {
          props: {
            top: LAID.take("../Body", "top"),
            width:LAID.take("../Body", "width"),
            height:LAID.take("../Body", "height"),
            backgroundColor:LAID.color("black"),
          },
          transition: {
            opacity:{
              duration:200,
              type:"ease"
            }

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
              }
            },
            "shown": {
              onlyif: LAID.take("/", "data.menu"),
              props: {
                opacity:0.5,
                zIndex:1
              },
              when: {
                click: [
                  function () {
                    LAID.level("/").data("menu", false);
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
