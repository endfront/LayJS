LAY.run({
  props: {
    textSize:20
  },
  "Header": {
    props: {
      width: LAY.take("/", "width"),
      backgroundColor: LAY.color("black"),
      text: "APP",
      textSize: 30,
      textPadding: 20,
      textAlign: "center",
      textColor: LAY.color("white")
    }
  },
  "Items": {
    props: {
      width: LAY.take("../", "width"),
      top: LAY.take("../Header", "bottom")
    },
    "Item": {
      many: {
        formation:"onebelow",
        fargs: {
          onebelow: {
            gap: 10
          }
        },
        rows: [
          {id: "Popcorn", order:1},
          {id: "Cake", order:2},
          {id: "Lasagna", order:3},
          {id: "Sushi", order:4},
          {id: "Butter", order:5},
          {id: "Jelly", order:6}
        ],
        sort: [
          {key:"order"}
        ]
      },
      data: {
        isMoving: false,
        x: 0,
        y: 0,
        startX: 0,
        startY: 0
      },
      props: {
        cursor:"move",
        width: LAY.take("../", "width"),
        backgroundColor: LAY.color("gainsboro"),
        text: LAY.take("", "row.id"),
        textPadding:10
      },
      transition: {
       // top: {type:"ease", duration: 200}
      },
      states: {
        "moving": {
          onlyif: LAY.take("", "data.isMoving"),
          props: {
            zIndex:"2",
            opacity: 0.5,
            shiftX: LAY.take("", "data.x"),
            shiftY: LAY.take("", "data.y")
          },
          when: {
            mousemove: function (e) {
              LAY.clog();
              this.data("x",
                 e.clientX - this.attr("data.startX"));
              this.data("y",
                e.clientY - this.attr("data.startY"));
              LAY.unclog();
            },
            mouseup: function () {
              LAY.clog();
              this.data("isMoving", false);
              alert("This LAY example is incomplete")
              LAY.unclog();

            }
          }
        },
        "static": {
          onlyif: LAY.take("", "data.isMoving").not(),
          when: {
            mousedown: function (e) {
              this.data("startX", 
                e.clientX);
              this.data("startY", 
                e.clientY);
          
              this.data("isMoving", true);
            }
          }
        }
      }
    }
  }
});