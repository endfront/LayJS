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
          },
          states: {
            hovered: {
              onlyif: LAID.take("this", "$hovered"),
              props: {
                opacity:0.8
              }
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
            width: LAID.take( "../", "width"),
            text: "WALMART",
            textAlign: "center",
            textColor: LAID.color( "white"),
            textPadding:20,
            textSize: 30,
            textLetterSpacing:1
          }
        }
      },
    }
  }
});
