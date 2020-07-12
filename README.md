# text-player-plugin

This is a jquery plugin for showing the video movie from list of texts


## Details

This plugin will show a video like interface for showing the change from one text to another. A smooth scroll has been implemented to focus on the text changes.
For example, if there are 2 texts "this" and "thats", as shown below "i" has been removed and "at" has been added. So you will see two slides one with typing "this" and another with modifying "this" with "thats".

![**](https://ranjit-singh-cc.github.io/text-player-plugin/examples/pics/diff.png)

Levenshtein Distance algorithm has been used to get the change from one text to another.

Live Demo: [Click here to see the demo](https://ranjit-singh-cc.github.io/text-player-plugin/examples/testing.html)


## Prerequisite

- jquery library - responsible for dom manipulation


## Resources

 - jquery.textplayer.js - responsible for all processing
 - jquery.textplayer.css - responsible for all the UI design

**Note** - The good part is no external image has been used for UI, only pure CSS and SVG has been used to generate the image. So you don't have to include any file apart from this.


## How to bind

In html, create a container where you want to bind it

    <div id="textPlayerContainer">
    	<pre class="textPlayerContent"></pre>
    </div>
    
**Please note** - textPlayerContent class is mandatory in the template, all the text will be printed in this particular element. The outer parent container can have any attribute it in.

In javascript, just bind the textplayer with your container and pass the array of texts

    var textPlayer = $("#textPlayerContainer").textplayer({texts: textArr});
    textPlayer.start();


## Available options

    {
    	slideDurationInMilliSeconds: 5000, // time duration for the transition from one text to another
    	height: 500, // height of outer container, once text gets filled up then scrollbar will be visible
    	width: 600 // width of outer container, once text gets filled up then scrollbar will be visible
    }

## Available events

 - textplayer.navigation -> this gets triggered when new text gets printed


## Video controls

![video controls](https://ranjit-singh-cc.github.io/text-player-plugin/examples/pics/video-controls.png?v=1)


 - Play button
 - Pause button
 - Replay button
 - Expand to full screen button
 - Exit full screen button
 - Ribbon to show the progress of video
 - Time left in the format of hh:mm:ss
 - On hover of progress ribbon showing a tooltip gets visible
 - On click on progress ribbon, video will start from that time
	 - If current state is pause then it will just print all the texts
	 - If current state is playing then it will continue the video from that point
