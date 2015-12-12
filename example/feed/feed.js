


/* data BEGIN */
var users = {
	1: {
		name: "Kevin Bacon",
		thumbnail: "http://img.sxsw.com/2014/presenters/678225.jpg"
	},
	2: {
		name: "Angelina Jolie",
		thumbnail: "http://imalbum.aufeminin.com/album/D20130205/sipa-angelina-jolie-now-861444_H110742_L_s100.jpg"
	},
	3: {
		name: "Brad Pitt",
		thumbnail: "http://www.picgifs.com/avatars/celebrities/brad-pitt/avatars-brad-pitt-094233.jpg"
	}
}
alert("fix tabindex");

var feed = [
	{
		_id: 213,
		type: "status",
		text: "Hey I'm kind of in the mood to do nothing.",
		user: 1,
		likes: [ 2, 3 ],
		timestamp: 1449642425

	},
	{
		_id: 213,
		type: "video",
		text: "Lol the trailer for this movie is so funny! LMAO xoxo",
		video: "http://www.w3schools.com/html/mov_bbb.ogg",
		user: 2,
		likes: [ 1 ],
		timestamp: 1449642325
	},
	{
		_id: 233,
		type: "status",
		text: "Damn.. My wife angelina has been watching some really weird movies lately.",
		user: 3,
		likes: [],
		timestamp: 1449642225
	},
	{
		_id: 333,
		type: "image",
		text: "Hey fans! I am goina be soon watchin a movie about a bunny, bunny love!",
		image: "https://pbs.twimg.com/profile_images/447374371917922304/P4BzupWu.jpeg",
		user: 2,
		likes: [],
		timestamp: 1449642125
	}

	
];

/* data END */


function formatTime ( curTime, timestamp ) {

    var seconds_diff = (curTime/1000 - timestamp);
    var future = seconds_diff < 0;
    seconds_diff = Math.abs(seconds_diff);
    var minutes_diff = Math.floor(seconds_diff / 60);
    var hours_diff = Math.floor(minutes_diff / 60);
    var days_diff = Math.floor(hours_diff / 24);
    var weeks_diff = Math.floor(days_diff / 7);
    var months_diff = Math.floor(days_diff / 30);
    var year_diff = Math.floor(days_diff / 365);

    var diff;

    if (seconds_diff < 60) {
       diff = 'less than a minute';
    } else if (minutes_diff < 2) {
       diff = 'one minute';
    } else if (minutes_diff <= 60) {
        diff = minutes_diff + ' minutes';
    } else if (hours_diff <= 2) {
        diff = 'one hour';
    } else if (hours_diff < 24) {
        diff = hours_diff + ' hours';
    } else if (days_diff < 2) {
        diff = 'yesterday';
    } else if (weeks_diff < 1) {
        diff = days_diff + ' days';
    }
    else if (weeks_diff < 2) {
        diff = 'one week';
    } else if (months_diff < 1) {
        diff = (Math.floor(days_diff / (7)) + ' weeks');
    } else if (months_diff < 2) {
        diff = 'a month';
    } else if (year_diff < 1) {
        diff = months_diff + ' months';
    } else if (year_diff < 2) {
        diff = 'one year';
    } else if (year_diff < 100) {
        diff = year_diff + " years";
    } else if (year_diff === 1000) {
        diff = "a century"
    } else if (year_diff < 1000) {
        diff = Math.floor(year_diff / 100) + " centuries";
    } else if (year_diff === 1000) {
        diff = "a millennium"
    } else {
        diff = Math.floor(year_diff / 1000) + " millennia";
    }

    return diff === "yesterday" ? diff : diff + " ago";
}


/* Example Starts Below */

LAY.run({
	$load: function () {
		var self = this;
		// update timestamp formatting every minute
		setInterval( function() {
			self.data("curTimestamp", Date.now());
		}, 60*1000 );
	},
	data: {
		themeBlue: LAY.rgb(70,100,255),
		themeGrey: LAY.color("gainsboro"),
		margin: 10,
		curTimestamp: Date.now()
	},
	props: {
		overflowY: "auto",
		userSelect: "none",
		cursor: "default"
	},
	"Header": {
		props: {
			width: LAY.take("/", "width"),
			backgroundColor: LAY.take("/", "data.themeBlue"),
			text: "facebuk",
			textColor: LAY.color("white"),
			textSize: 30,
			textAlign: "center",
			textWeight: "100",
			textLineHeight: 2
		}
	},
	"Body": {
		props: {
			top: LAY.take("../Header", "bottom"),
			width: LAY.take("/", "width")
		},
		"Feed": {
			many: {
				rows: feed,
				sort: [{key:"timestamp", ascending: false}]
			},
			props: {
				width: LAY.take("../", "width")
			},
			"Pic": {
				$type:"image",
				props: {
					left: LAY.take("/", "data.margin"),
					top: LAY.take("/", "data.margin"),
					width:50,
					height:50,
					cornerRadius: 10,
					imageUrl: LAY.take(users).key(
							LAY.take(".../", "row.user") ).key("thumbnail")
				}
				
			},
			"Content": {
				props: {
					top: LAY.take("/", "data.margin"),
					left: LAY.take("../Pic", "right").plus(
						LAY.take("/", "data.margin")),
					width: 400
				},
				states: {
					"responsive": {
						onlyif: LAY.take("/", "width").lt(480),
						props: {
							width: LAY.take("/", "width").minus(
								LAY.take("", "left")).minus(
									LAY.take("/", "data.margin"))
						}
					}
				},
				"Name": {
					props: {
						text: LAY.take(users).key(
								LAY.take(".../", "row.user") ).key("name"),
						textWeight: "bold"
					}
				},
				"Text": {
					props: {
						top: LAY.take("../Name", "bottom"),
						width: LAY.take("../", "width"),
						text: LAY.take(".../", "row.text"),
						textWrap: "normal"
					}
				},
				"Media": {
					props: {
						top: LAY.take("../Text", "bottom"),
						width: LAY.take("../", "width"),
					},
					"Image": {
						exist: LAY.take(".../", "row.type").eq("image"),
						$type: "image",
						props: {
							width: LAY.take("../", "width"),
							imageUrl: LAY.take(".../", "row.image")
						}
					},
					"Video": {
						exist: LAY.take(".../", "row.type").eq("video"),
						$type: "video",
						props: {
							width: LAY.take("../", "width"),
							// aspect ratio will be set at 0.55
							height:LAY.take("", "width").multiply(0.55),
							videoSrc: LAY.take(".../", "row.video"),
							videoMuted: true,
							videoAutoplay: true,
							videoLoop: true,
							videoController: true
						}
					}
				},
				"Meta": {
					props: {
						top: LAY.take("../Media", "bottom")
					},
					"Time": {
						props: {
							text: LAY.take( formatTime ).fn(
								LAY.take("/", "data.curTimestamp"),
								LAY.take(".../", "row.timestamp")),
							textColor: LAY.take("/", "data.themeGrey").colorDarken(0.5)
						}
					},
					"Likes": {
						data: {
							numLikes: LAY.take(".../", "row.likes").length(),
							isFocus: false
						},
						props: {
							left: LAY.take("../Time", "right").plus( 
								LAY.take("/", "data.margin") ),
							textWeight: "bold",
							textColor: LAY.take("/", "data.themeBlue"),
							cursor: "pointer",
							tabindex: 0
						},
						states: {
							"one": {
								onlyif: LAY.take("", "data.numLikes").eq(1),
								props: {
									text: "1 like"
								}
							},
							"multiple": {
								onlyif: LAY.take("", "data.numLikes").gt(1),
								props: {
									text: LAY.take("%d likes").format(
										LAY.take("", "data.numLikes"))
								}
							},
							"focused": {
								onlyif: LAY.take("", "data.isFocus"),
								props: {
									focus: true
								}
							}
						},
						when: {
							click: function () {
								this.data("isFocus", true );
								var likes = LAY.level("/Likes");
								likes.data("likers",
									this.level(".../").attr( "row.likes") );
								likes.data("x",
									this.attr("$absoluteLeft") + this.attr("width"));
								likes.data("y",
									this.attr("$absoluteTop"));
								likes.data("shown", true);
							},
							blur: function () {
								console.log("here");
							}
						}
					}
				}
			},
			
			"Border": {
				props: {
					top: LAY.take("../Content", "bottom").max( 
						LAY.take("../Pic", "bottom") ).plus(
						LAY.take("/","data.margin")),
					height:1,
					width: LAY.take("../", "width"),
					borderBottom: {style:"solid", width:1,
						color: LAY.take("/", "data.themeGrey")}
				}
			}
		},
	},
	"Likes": {
		data: {
			likers: [],
			shown: false,
			x: 0,
			y: 0
		},
		props: {
			display:false,
			zIndex: "2",
			left: LAY.take("", "data.x"),
			top: LAY.take("", "data.y")
		},
		states: {
			"shown": {
				onlyif: LAY.take("", "data.shown"),
				props: {
					display: true
				}
			}
		},
		"Pointer": {
			props: {
				top: 7,
				width:5,
				height:5,
				border: {
					right: { style: "solid", width:5,
						color: LAY.color("black")},
					top: { style: "solid", width:5,
						color: LAY.transparent()},
					bottom: { style: "solid", width:5,
						color: LAY.transparent()}
				}
			}
		},
		"Likers": {
			props: {
				left: LAY.take("../Pointer", "right"),
				backgroundColor: LAY.color("black"),
				cornerRadius: 2
			},
			"Liker": {
				many: {
					rows: LAY.take("../../", "data.likers")
				},
				props: {
					text: LAY.take(users).key(
						LAY.take("", "row.content") ).key( "name" ),
					textColor: LAY.color("white"),
					textPadding: {left: 10, right:10, top:2, bottom:2}
				}
			}
		}
	}

});