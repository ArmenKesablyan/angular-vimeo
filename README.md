# Angular-Vimeo 0.0.1

## Installation
The recommended method would be to go through bower. If you are not familiar
with bower you can learn more about using bower with the
[Getting Started](http://bower.io/#getting-started) guide.

```
bower install angular-vimeo --save
```

## Demonstration
Checkout the [demo](http://armenkesablyan.github.io/angular-vimeo) page.
Since this is relatively new all there is now is the `<vimeo-player>` directive.


## Features
#### Vimeo Player
The Vimeo Player is a directive that can be used to run the vimeo player on your
angular application. To use the player just add the tag `<vimeo-player>`. The
following attributes can be applied:

| Attribute | Type | Description | Default |
| --------- | ---- | ----------- | ------- |
| **videoId** | _number_ | Video ID of the displayed video from Vimeo. | |
| auto-pause | _number_ | Enables or disables pausing a video when another video is playing | 1
| auto-play | _number_ | Plays the video automatically on load. | 0 |
| color | _string_ | Specify the color of the controls | 00adef |
| height | _number_ | Specify the height of the iFrame | |
| is-finished | _boolean_ | Whether the video is done playing | false
| is-playing | _boolean_ | Whether the video is currently playing | false
| is-ready | _boolean_ | Whether the video is ready to be interacted with | false
| loop | _number_ | Whether the video should play again when it ends | 0 |
| player-id | _string_ | A unique name where the video can be identified.
| seconds | _number_ | The current second the video is at | 0 |
| seconds-loaded | _number_ | The seconds that are loaded in memory that can be played | 0 |
| seconds-total | _number_ | The total duration in seconds of the current loaded video. | 0 |
| show-badge | _number_ | Whether the Vimeo player should display the badge. | 1 |
| show-byline | _number_ | Whether the Vimeo player should display the byline. | 1 |
| show-portrait | _number_ | Whether the Vimeo player should display the users portrait. | 1 |
| show-title | _number_ | Whether the vimeo player should display the video title. | 1 |
| width | _number_ | Specify the width of the iFrame. |  | No |

## Release Notes
#### 0.0.1 - Initial Release (June 23, 2015)
* Introduced `<vimeo-player>` directive.
* Introduced a [demo](http://armenkesablyan.github.io/angular-vimeo) page.
