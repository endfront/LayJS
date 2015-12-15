
var PING = Math.random()*64;

var FAKESERVER = {
  addToList: function ( id, fn ) {
    setTimeout(function() {
      // false -> error
      // true -> success
      fn( Math.random() > 0.1 );
    }, PING*32 );
  },
  removeFromList: function ( id, fn ) {
    setTimeout(function() {
      // false -> error
      // true -> success
      fn( Math.random() > 0.1 );
    }, PING*32 );
  },
  getBillboardItems: function ( fn ) {
    setTimeout(function() {
      // false -> error
      // true -> success
      fn( billboardItems );
    }, PING );
  },
  getSuggestions: function ( fn ) {
    setTimeout(function() {
      // false -> error
      // true -> success
      fn( suggestions );
    }, PING );
  }
};




         

var billboardItems = [
  { 
    id: 234033,
    hero: "http://cdn1.nflximg.net/images/4283/8804283.jpg",
    title: "http://cdn0.nflximg.net/images/7520/9507520.png",
    synopsis: "Robbing malls is what this safe-cracking Santa does. He'd be better at it if he could put down the bottle.",
    year: 2003,
    rating: "R",
    length: "1h 31m",
    list: false
  },
  { 
    id: 200489,
    hero: "http://cdn0.nflximg.net/images/1094/22071094.jpg",
    title: "http://cdn0.nflximg.net/images/1106/22071106.png",
    synopsis: "The New York comic offers his view of America's founding fathers. It's a hilarious history lesson you'll never forget.",
    year: 2015,
    rating: "TV-MA",
    length: "55m",
    list: true
  },
  { 
    id: 304820,
    hero: "http://cdn1.nflximg.net/images/0629/21760629.jpg",
    title: "http://cdn0.nflximg.net/images/0860/9610860.png",
    synopsis: "Two World War II marksmen, a Russian and a German, wage an intense battle of wits. The enemy is only half the battle.",
    year: 2001,
    rating: "R",
    length: "2h 11m",
    list: false
  }
];


var suggestions = [
  {
    title: "Trending Now",
    options: [
      { 
        id: 12312,
        type: "tv",
        name: "Prison Break",
        cover: "http://cdn0.nflximg.net/images/1866/3511866.jpg",
        length: "4 seasons",
        publicRating: 4.5,
        userRating: 5,
        list: false,
        year: 2008,
        rating: "TV-14",
        userLastWatched: {
          location: "S1:E1",
          title: "Pilot",
          length: 43,
          till: 41
        },
        trailers: []
      },
      { 
        id: 62312,
        type: "movie",
        name: "Gone in 60 seconds",
        cover: "http://cdn0.nflximg.net/images/2974/9312974.jpg",
        length: "1h 58m",
        publicRating: 4.5,
        userRating: null,
        list: false,
        year: 2000,
        rating: "PG-13",
        userLastWatched: {},
        trailers: []
      },

      { 
        id: 52312,
        type: "movie",
        name: "Ray",
        cover: "http://cdn0.nflximg.net/images/7026/9417026.jpg",
        length: "2h 32m",
        publicRating: 4.5,
        userRating: -1,
        list: false,
        year: 2008,
        rating: "TV-14",
        userLastWatched: {},
        trailers: []
      },
      { 
        id: 42312,
        type: "movie",
        name: "Chasing Tyson",
        cover: "http://cdn0.nflximg.net/images/8386/23978386.jpg",
        length: "1h 17m",
        publicRating: 4.5,
        userRating: 5,
        list: false,
        year: 2015,
        rating: "TV-14",
        userLastWatched: {},
        trailers: []
      },
      { 
        id: 32312,
        type: "movie",
        name: "A League of Their Own",
        cover: "http://cdn0.nflximg.net/images/0640/8400640.jpg",
        length: "2h 7m",
        publicRating: 4.5,
        userRating: 5,
        list: false,
        year: 1992,
        rating: "PG",
        userLastWatched: {},
        trailers: []
      },
      { 
        id: 22312,
        type: "tv",
        name: "The Office (U.S.)",
        cover: "http://cdn1.nflximg.net/images/0927/8390927.jpg",
        length: "4 seasons",
        publicRating: 4.5,
        userRating: 5,
        list: false,
        year: 2008,
        rating: "TV-14",
        userLastWatched: {},
        trailers: []
      }
      
    ]
  }


];