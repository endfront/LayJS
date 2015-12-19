Refer to specification.markdown

**Demos**

- Clock: [http://codepen.io/relfor/pen/eJZQab?editors=001](http://codepen.io/relfor/pen/eJZQab?editors=001)

- TodoMVC: [http://codepen.io/relfor/full/VeaVNe/](http://codepen.io/relfor/full/VeaVNe/)

- Hello World: [http://codepen.io/relfor/pen/bEpONL?editors=001](http://codepen.io/relfor/pen/bEpONL?editors=001)

- Drawer Menu: [http://codepen.io/relfor/full/BjKvNm/](http://codepen.io/relfor/full/BjKvNm/)

**Basic API**

	LAY.run({
      "<ChildName>": {
        $type: string,
        $gpu: boolean,
        $inherit: string | object | [ string | object, ... ],
        $obdurate: [ string, ... ],
        $load: function,

        exist: boolean (take),
        data: object,
        props: object,
        when: object,
        transition: object,

        many: {
          $load: function,
          $id: string,

          data: object,
          formation: string (take),
          sort: [sortDict, ...],
          filter: take,
          rows: array | take,
          fargs: {
          	<formationName>: args 
          },

          states: {
            < name >: {
              onlyif: take,
              formation: string (take),
              sort: [sortDict, ...],
              filter: LAY.take,
              fargs: obj,
              install: function
              uninstall: function
            }
          }
        },
        states: {
          < name >: {
            onlyif: boolean (take),
            props: object,
            when: object,
            transition: transitionObj,
            install: function,
            uninstall: function
          }
        }
       }
     }
    });