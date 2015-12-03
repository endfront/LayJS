

LAY.run({
  props: {
    overflow:"auto"
  },
  "Columns": {
    $type:"input:select",
    props: {
      input: [
        { value: "1", content: "1" },
        { value: "2", content: "2" },
        { value: "3", content: "3", selected: true },
        { value: "4", content: "4" },
        { value: "5", content: "5" },
        { value: "6", content: "6" },
        { value: "7", content: "7" }

      ],
      textPadding: 10,
      textSize: 30,
      width: LAY.take("/", "width")
    }
  },
  "Content": {
    props: {
      top: LAY.take("../Columns", "bottom"),
    },
    transition: {
      height: {
        type:"ease",
        duration: 500
      }
    },
    "Cell": {
      many: {
        formation: "grid",
        fargs: {
          grid: {
            columns: LAY.take("/Columns", "$input").number()
          }
        },
        rows: [
          "red",
          "blue",
          "green",
          "magenta",
          "cyan",
          "pink",
          "skyblue",
          "purple",
          "wheat",
          "brown",
          "yellow",
          "teal"
        ]
      },
      props: {
        width: LAY.take("/", "width").divide(
          LAY.take("many", "fargs.grid.columns")),
        height: LAY.take("","width"),
        backgroundColor: LAY.color( LAY.take("", "row.content"))
      },
      transition: {
        all: {
         type:"ease",
         duration: 500
        }
      } 
    }
  }

});