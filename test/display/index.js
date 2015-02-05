LAID.run( {
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
            filters: [
              {type:"dropShadow",
              x: 10, y:10, blur:10, color:LAID.color("red")}

            ]

          },
          states: {
            hovered: {
              onlyif: LAID.take("this", "$hovered"),
              props: {
                opacity:1,
                boxShadows: [
                  { x:10,y:10,blur:5, color:LAID.color("blue") },
                  //{ x:1,y:10,blur:5, color:LAID.color("blue") }
                ]

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
          },
          when: {
              click: [
                function () {
                  console.log("fuck");
                }
              ]
          },
        }
      },
    },
    "Body": {
      props: {
        width: LAID.take("../", 'width').divide(2),
        top: LAID.take("../Header", "bottom"),
        right:LAID.take("../", "width"),
        height: LAID.take("../Header", "height").multiply(3),
        backgroundColor: LAID.color("gainsboro"),
        overflowY: "auto",
        scrollY: 100

      },
      states: {
        bottom: {
          onlyif: LAID.take("this", "$clicked"),
          props: {
            //scrollY: 0
          }
        }
      },
      children: {
        "Option1": {
          props: {
            width:100,
            height:150,
            backgroundColor:LAID.color("blue")
          }
        },
        "Option2": {
          inherits: ["../Option1"],
          props: {
            top: LAID.take("../Option1", "height").add(10),
            backgroundColor:LAID.color("red"),
            text: LAID.take("../", "$scrolledX")
          }
        }
      }
    }
  }
});
