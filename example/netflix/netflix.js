
var NFICON = {
  logo: "&#58832;",
  play: "&#58950;",
  add: "&#59525;",
  addReverse: "&#59537;",
  tick: "&#59528;",
  tickReverse: "&#59540;",
  leftArrow: "&#59496;",
  rightArrow: "&#59495;",
  dot: "&#58914;"
};

LAY.run({
  data: {
    margin: LAY.take("/", "width").multiply(0.04),
    // vw to ensure cross-browser compatitbiliy
    vw: LAY.take("/", "width").multiply(0.01).round(),
    spread: LAY.take(function( width ){
      if ( 1400 < width ) {
        return 6;
      } else if ( 1100 < width ) {
        return 5;
      } else if ( 800 < width ) {
        return 4;
      } else if ( 500 < width ) {
        return 3;
      }
      return 2;
    }).fn( LAY.take("/", "width")),
    optionBaseWidth: LAY.take("/", "width").minus(
      LAY.take("/", "data.margin").double()).divide(
      LAY.take("/", "data.spread")),
    optionAspectRatio: 0.5625
  },
  props: {
    textColor: LAY.color("white"),
    textFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif",
    textSize: LAY.take("", "data.vw"),
    backgroundColor: LAY.hex(0x141414),
    userSelect: "none",
    cursor:"default"
  },
  "_Arrow": {
    props: {
      zIndex: "2",
      centerY: LAY.take("../", "$midpointY"),
      textLineHeight: 1,
      cursor: "pointer",
      textFamily: "nf-icon",
      textSize: LAY.take("/", "data.vw").multiply(2.5),
      textAlign: "center",
      textShadows: [
        {x:0, y:1, blur: 2, color: LAY. rgba(0,0,0,0.4) }
      ]
    },
    transition: {
      "all": {
        type: "ease-out",
        duration: 100
      }
    },
    states: {
      "hovering": {
        onlyif: LAY.take("", "data.isHovering"),
        props: {
          scaleX: 1.25,
          scaleY: 1.25,
          textWeight: "700"
        }
      }
    }
  },
  "_AddToList": {
    data: {
      isLoading: false,
      showError: false
    },
    props: {
      top: LAY.take("../Synopsis", "bottom").add(10),
      cursor: "pointer",
      overflow: "visible"
    },
    states: {
      "add": {
        onlyif: LAY.take("", "data.isLoading").not().and(
          LAY.take(".../", "row.list").not()),
        when: {
          click: [ LAY.take("", "data.fnAdd") ]
        }
      },
      "remove": {
        onlyif: LAY.take("", "data.isLoading").not().and(
          LAY.take(".../", "row.list")),
        when: {
          click: [ LAY.take("", "data.fnRemove" )]
        }
      }
    },
    "Icon": {
      props: {
        text: NFICON.add,
        textFamily: "nf-icon",
        textSize: LAY.take("/", "data.vw").double()
      },
      states: {
        "unadded": {
          onlyif: LAY.take(".../", "row.list").not(),
          props: {
            text: NFICON.add
          }
        },
        "unaddedHovering": {
          onlyif: LAY.take("", "unadded.onlyif").and(
            LAY.take("../", "$hovering")),
          props: {
            text: NFICON.addReverse
          }
        },
        "added": {
          onlyif: LAY.take(".../", "row.list"),
          props: {
            text: NFICON.tick
          }
        },
        "addedHovering": {
          onlyif: LAY.take("", "added.onlyif").and(
            LAY.take("../", "$hovering")),
          props: {
            text: NFICON.tickReverse
          }
        },
        "hovering": {
          onlyif: LAY.take("../", "$hovering"),
          props: {
            scaleX:1.15,
            scaleY:1.15
          }
        }
      },
      transition: {
        "all": {
          type: "ease",
          duration: 150
        }
      }
    },
    "Title": {
      props: {
        left: LAY.take("../Icon", "right").add(
          LAY.take("/", "data.vw").multiply(0.6)),
        centerY: LAY.take("../", "$midpointY"),
        text: "MY LIST",
        textSize: LAY.take("/", "data.vw").multiply(1.1),
        textWeight: "700"
      },
      states: {
        "error": {
          onlyif: LAY.take("../", "data.showError"),
          props: {
            text: "ERROR"
          },
          install: function () {
            var box = this.level("../");
            setTimeout(function(){
              box.data("showError", false);
            }, 1000);
          }
        },
        "adding": {
          onlyif: LAY.take("", "error.onlyif").not().and(
            LAY.take("../", "data.isLoading").and(
            LAY.take(".../","row.list").not())),
          props: {
            text: "ADDING..."
          }
        },
        "removing": {
          onlyif: LAY.take("", "error.onlyif").not().and(
            LAY.take("../", "data.isLoading").and(
            LAY.take(".../","row.list"))),
          props: {
            text: "REMOVING..."
          }
        }
      }
    }
  },
  "Header": {
    props: {
      width: LAY.take("/", "width"),
      zIndex:"2",
      backgroundImage:
        "linear-gradient(to bottom,rgba(0,0,0,.7) 10%,rgba(0,0,0,0))"
    },
    states: {
      "translucent": {
        onlyif: LAY.take("/Container", "$scrolledY").gt(0),
        props: {
          backgroundColor:LAY.rgba(0,0,0,0.7)
        },
      }
    },
    "Logo": {
      props: {
        left: LAY.take("/", "data.margin"),
        centerY: LAY.take("../", "$midpointY"),
        text: NFICON.logo,
        textFamily: "nf-icon",
        textSize:32,
        textColor: LAY.hex(0xE50914),
        textPadding: {top:18,bottom:18}
      }
    }
  },
  "Container": {
    props: {
      height:LAY.take("/", "height"),
      width:LAY.take("/", "width"),
      overflowY:"auto"
    },
    "Billboards": {
      data: {
        currentF: 1,
        total: LAY.take("Billboard", "rows").length()
      },
      "_BillboardArrow": {
        $inherit: "/_Arrow",
        data: {
          isHovering: LAY.take("", "$hovering")
        },
        props: {
          textPadding: {top:30, bottom:30, right:20, left: 20},
        }
      },
      "Prev": {
        $inherit: "../_BillboardArrow",
        props: {
          left: 0,
          text: NFICON.leftArrow
        },
        when: {
          click: function () {
            var billboards = this.level("../");
            var currentF = billboards.attr("data.currentF");

            billboards.data("currentF", 
              currentF === 1 ? billboards.attr("data.total") : 
              --currentF);
          }
        }
      },
      "Next": {
        $inherit: "../_BillboardArrow",
        props: {
          right: 0,
          text: NFICON.rightArrow
        },
        when: {
          click: function () {
            var billboards = this.level("../");
            var currentF = billboards.attr("data.currentF");
            billboards.data("currentF", 
              currentF === billboards.attr("data.total") ? 1 : 
              ++currentF);
          }
        }
      },
      "Billboard": {
        many: {
          $load: function () {
            var self = this;
            FAKESERVER.getBillboardItems( function( items ) {
              self.rowsCommit( items );
            });
          },
          formation: "none"
        },
        props: {
          opacity: 0,
          zIndex: "-1",
          width:LAY.take("/", "width"),
          height: LAY.take("/", "width").divide(2.5),
          backgroundColor: LAY.color("black"),
          overflow: "visible"
        },
        states: {
          "shown": {
            onlyif: LAY.take("../", "data.currentF").eq(
              LAY.take("", "$f")),
            props: {
              opacity: 1,
              zIndex: "1"
            }
          }
        },
        transition: {
          opacity: {
            type: "ease",
            duration: 500
          }
        },  
        "Description": {
          props: {
            left: LAY.take("/", "data.margin"),
            width: LAY.take("../", "width").multiply(0.3),
            overflow: "visible"
          },
          "Title": {
            $type:"image",
            props: {
              top: LAY.take("../../", "height").multiply(0.2),
              width: LAY.take("../", "width"),
              imageUrl: LAY.take(".../", "row.title")
            }
          },
          "Meta": {
            props: {
              top: LAY.take("../Title", "bottom").add(15),
              textColor: LAY.hex(0x666666),
              textWeight: "700",
              textSize: LAY.take("/", "data.vw").multiply(1.2)
            },
            "Year": {
              props: {
                text: LAY.take(".../", "row.year"),
                centerY: LAY.take("../Rating", "centerY")
              }
            },
            "Rating": {
              props: {
                left: LAY.take("../Year", "right").plus(10),
                text: LAY.take(".../", "row.rating"),
                border: {style:"solid", width:1,
                  color: LAY.hex(0x333333)},
                textPadding: {top:0, bottom:0, left:5, right:5}
              }
            },
            "Length": {
              props: {
                left: LAY.take("../Rating", "right").plus(10),
                centerY: LAY.take("../Rating", "centerY"),
                text: LAY.take(".../", "row.length")
              }
            }
          },
          "Synopsis": {
            props: {
              top: LAY.take("../Meta", "bottom").add(10),
              width: LAY.take("../", "width"),
              text: LAY.take(".../", "row.synopsis"),
              textSize: LAY.take("/", "data.vw").multiply(1.4),
              textWrap: "normal",
              textColor: LAY.hex(0x999999)
            }
          },
          "AddToList": {
            $inherit: "/_AddToList",
            data: {
              fnAdd: function () {
                var self = this;                    
                var row = self.level(".../");
                self.data("isLoading", true );
                FAKESERVER.addToList(row.attr("row.id"), function(res){
                  self.data("isLoading", false );
                  if ( !res ) { //unsuccessful
                    self.data("showError", true );
                  } else {
                    row.row("list", true );
                  }
                });
              },
              fnRemove: function () {
                var self = this;                    
                var row = self.level(".../");
                self.data("isLoading", true );
                FAKESERVER.removeFromList(row.attr("row.id"), function(res){
                  self.data("isLoading", false );
                  if ( !res ) { //unsuccessful
                    self.data("showError", true );
                  } else {
                    row.row("list", false );
                  }
                });
              } 
            }
          }
        },
        "Hero": {
          props: {
            left: LAY.take("../Description", "right"),
            height: LAY.take("../", "height"),
            width: LAY.take("../", "width").minus(
              LAY.take("", "left"))
          },
          "Gradient": {
            props: {
              width: LAY.take("../", "width"),
              height: LAY.take("../", "height"),
              backgroundImage: "linear-gradient(to right,#000 0,transparent 33%,transparent 100%)",
              zIndex: "2"
            }
          },
          "Image": {
            $type:"image",
            props: {
              imageUrl: LAY.take(".../", "row.hero"),
              height: LAY.take("../", "height")
            }
          },
          "Play": {
            props: {
              cursor: "pointer",
              zIndex: "3",
              width: LAY.take("", "$naturalWidth").max(
                  LAY.take("", "$naturalHeight")),
              height: LAY.take("", "width"),
              centerX: LAY.take("../", "$midpointX"),
              centerY: LAY.take("../", "$midpointY"),
              cornerRadius: LAY.take("", "width"),
              border: {style: "solid",
                color: LAY.color("white"),
                width: LAY.take("/", "data.vw").multiply(0.36)
              },
              opacity: 0.3,
              textFamily: "nf-icon",
             textSize: LAY.take("/", "data.vw").multiply(
                7.2).multiply(0.46),
              textIndent: LAY.take("", "textSize").multiply(0.25),
              textPadding: LAY.take("", "textSize").divide(2.1),
              text: NFICON.play,
              textColor: LAY.color("white"),
              textAlign: "center"
            },
            states: {
              "hovering": {
                onlyif: LAY.take("", "$hovering"),
                props: {
                  opacity: 1,
                  textColor: LAY.color("red"),
                  backgroundColor: LAY.rgba(0,0,0,0.5),
                  scaleX: 1.08,
                  scaleY: LAY.take("", "scaleX")
                }
              }
            }, 
            transition: {
                "all": {
                type: "ease",
                duration: 150
              }
            }
          }
        }
      },
      "Dots": {
        props: {
          bottom: 10,
          centerX: LAY.take("../", "$midpointX"),
          zIndex: "2"
        },
        "Dot": {
          many: {
            rows: LAY.take(function(len){
              return Array.apply(null, {length: len}).map(Number.call, Number);
            }).fn( LAY.take("../../Billboard", "rows").length() ),
            formation: "totheright",
            fargs: {
              totheright: {
                gap: LAY.take("/", "data.vw").multiply(0.7)
              }
            }
          },
          props: {
            cursor:"pointer",
            opacity: 0.5,
            textFamily: "nf-icon",
            text: NFICON.dot,
            textSize: LAY.take("/", "data.vw").multiply(0.8)
          },
          states: {
            "active": {
              onlyif: LAY.take("../../", "data.currentF").eq(
                LAY.take("","row.id")),
              props: {
                opacity: 1
              }
            }
          },
          when: {
            click: function () {
              this.level("../../").data("currentF",
                this.attr("row.id"))
            }
          }
        }
      }
    },
    "Suggestions": {
      props: {
        width: LAY.take("../", "width"),
        top: LAY.take("../Billboards", "bottom")
      },
      "_Nav": {
        props: {
          cursor: "pointer",
          top: LAY.take("../Title", "bottom"),
          width: LAY.take("/", "data.margin"),
          height: LAY.take("/", "data.optionBaseWidth").multiply(
            LAY.take("/", "data.optionAspectRatio")),
          backgroundColor: LAY.rgba(20,20,20,0.5)
        },
        states: {
          "hovering": {
            onlyif: LAY.take("", "$hovering"),
            props: {
              backgroundColor: LAY.rgba(20,20,20,0.7)
            }
          }
        }
      },
      "_BaseOption": {
        props: {
          width: LAY.take("/", "data.optionBaseWidth"),
          height: LAY.take("", "width").multiply( 
            LAY.take("/", "data.optionAspectRatio") ),
          border: {
            style:"solid", width:2,
            color: LAY.take("/", "backgroundColor")
          },
          background: { 
            image: LAY.take("url('%s')").format(
              LAY.take("", "data.image")),
            repeat: "no-repeat",
            positionX: "50%",
            positionY: "50%",
            sizeX: "100%",
            sizeY: "100%"
          }
        }
      },
      "Suggestion": {
        many: {
          $load: function() {
            self = this;
            FAKESERVER.getSuggestions(function( suggestions ){
              self.rowsCommit( suggestions );
            });
          },
          rows: []
        },
        data: {
          doesWrap: LAY.take("*", "rows").length().gt(
            LAY.take("/", "data.spread")
          )
        },
        props: {
          width: LAY.take("../", "width")
        },      
        "Title": {
          props: {
            left: LAY.take("/", "data.margin"),
            text: LAY.take("../", "row.title"),
            textColor: LAY.hex(0x999999),
            textWeight: "700",
            textSize: LAY.take("/", "data.vw").multiply(1.4)
          }
        },
        "Options": {
          props: {
            top: LAY.take("../Title", "bottom").add(
              LAY.take("/", "data.vw").multiply(0.7))
          },
          "Option": {
            $inherit: "../../../_BaseOption",
            many: {
              formation: "totheright",
              rows: LAY.take(".../", "row.options")
            },
            data: {
              image: LAY.take("", "row.cover")
            },
            props: {
              cursor: "pointer",
              left: LAY.take("/", "data.margin")
            }
          }
        },
        /*"Tail": {
          $inherit: "../../_BaseOption"
          data: {
            shown: LAY.take("../", "data.doesWrap"),
            image: ""  
          },
          props: {
            left: LAY.take("../Options", "left").minus(
              LAY.take("", "width")),
            width: LAY.take("/", "data.optionBaseWidth"),
            height: LAY.take("", "width").multiply(
              LAY.take("/", "data.optionAspectRatio")),
            background: { 
              repeat: "no-repeat",
              positionX: "50%",
              positionY: "50%",
              sizeX: "100%",
              sizeY: "100%"
            }
          }
        },*/
        "Prev": {
          $inherit: "../../_Nav",
          "Arrow": {
            $inherit: "/_Arrow",
            data: {
              isHovering: LAY.take("../", "$hovering")
            },           
            props: {
              centerX: LAY.take("../", "$midpointX"),
              text: NFICON.leftArrow
            }
          }
        },
        "Next": {
          $inherit: "../../_Nav",
          props: {
            right: 0
          },
          "Arrow": {
            $inherit: "/_Arrow",
            data: {
              isHovering: LAY.take("../", "$hovering")
            },           
            props: {
              centerX: LAY.take("../", "$midpointX"),
              text: NFICON.rightArrow
            }
          }
        }
      }
    }
  }
});
