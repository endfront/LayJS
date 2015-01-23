LAID.run( {
  children: {
    "Header": {
      props: {
        left: 0,
        centerY: LAID.take('/', 'centerY'),
        width: 300,
        height: LAID.take('/', 'height').divide(2),
        backgroundColor: LAID.color( "gainsboro")
      },

      children: {
        "One": {
          props: {
            left: 0,
            top: 0,
            height:100,
            text:"Hello Waldo"
          }
        }
      },
    }
  }
});
