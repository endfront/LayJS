LAID.run( {
  data: {
    lang: "en"
  },
  children: {
    "Header": {
      props: {
        width: LAID.take( '/', 'width'),
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
            hovered: {
              onlyif: LAID.take("this", "$hovered"),
              props: {
                opacity:1,


              },
              transition: {
                boxShadows1Color: {
                  type: "linear",
                  duration:1000
                },
                opacity: {
                  type:"linear",
                  duration: 200
                },
              }
            },
            clicked: {
              onlyif: LAID.take("this", "$clicked"),
              props: {
                shiftX: 3,
                shiftY: 3
              }
            }
          },

          transition: {
            boxShadows1Color: {
              type: "linear",
              duration:10000
            }
          },
          children: {
            "TopBar": {
                props: {
                  width:LAID.take("../", "width"),
                  height:3,
                  backgroundColor:LAID.color("white"),
                }
            },
            "MiddleBar": {
              inherits: ["../TopBar"],
              props: {
                top:6
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
            text: "WALMART",
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
        right:LAID.take("../", "width"),
        height: LAID.take("../Header", "height").multiply(3),
        backgroundColor: LAID.color("gainsboro"),
        overflowY: "auto",
        scrollY: 0

      },
      states: {
        bottom: {
        //  onlyif: LAID.take("this", "$clicked"),
          props: {
            scrollY: LAID.take("this", "bottom")
          }
        }
      },
      children: {
        "Option1": {
          props: {
            width:LAID.take("../", 'width').subtract(20),
            centerX: LAID.take("../","width").divide(2),
            height:150,
            backgroundColor:LAID.color("blue")
          }
        },
        "Option2": {
          inherits: ["../Option1"],
          props: {
            top: LAID.take("../Option1", "height").add(10),
            backgroundColor:LAID.take("this", "textColor").colorInvert(),
            textColor:LAID.color("blue").green(100),
            text: LAID.take({
              "en": "number: %s",
              "zh": "li: %s"
            }).i18nFormat(LAID.take("this", "backgroundColor").colorStringify())
          },
          states: {
            angry: {
            //  onlyif:LAID.take(true),
              props: {

                background: {
                  color: LAID.rgb(255,100,200)
                }
              }
            }
          },
          when: {
            click: [
              function () {
                if (LAID.level("/").attr("data.lang") === "en") {
                  LAID.level("/").data("lang", "zh");
                } else {
                  LAID.level("/").data("lang", "en");
                }
              }
            ]
          }
        }
      }
    }
  }
});
