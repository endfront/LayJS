#LAY.Color  

`LAY.Color` represents a color object within a LAY application.  
It can be instantiated by any of the below LAY methods:

  - [`LAY.color`](../function/color.md)
  - [`LAY.rgb`](../function/rgb.md)
  - [`LAY.rgba`](../function/rgba.md)
  - [`LAY.hsl`](../function/hsl.md)
  - [`LAY.hsla`](../function/hsla.md)
  - [`LAY.hex`](../function/hex.md)
  - [`LAY.transparent`](../function/transparent.md)

Within [LSON](../LSON/index.md) it is used for key-values of
(props)[props.md] associated with colors such as "textColor", "backgroundColor", etc.  
A brief example of its usage within [LSON](../LSON/LSON.md) follows as below:

  LAY.run({
    props: {
      backgroundColor: LAY.color('gainsboro')
    },
    "Box": {
      props: {
        text: "Hello World",
        textColor: LAY.rgba(220,50,92, 0.8)
      }
    }
  });
