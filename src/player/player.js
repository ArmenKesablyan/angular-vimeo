/**
 * @file Angular Vimeo Player Module. Uses the Vimeo provided API to
 * set vimeo players in the application.
 * @author Armen Kesablyan  (armen@twoowl.com)
 * @version 0.0.1
 */



angular.module('ngVimeo.player', [])


/**
 * The embed player Uri. The format comes as follows
 * //player.vimeo.com/video/VIDEO_ID?PARAMETER=VALUE. The parameters include:
 * -----------------------------------------------------------------------------
 * autopause: Enables or disables pausing this video when another video is
 * played. Defaults to 1.
 * autoplay: Play the video automatically on load. Defaults to 0. Note that
 * this won’t work on some devices.
 * badge: Enables or disables the badge on the video. Defaults to 1.
 * byline: Show the user’s byline on the video. Defaults to 1.
 * color: Specify the color of the video controls. Defaults to 00adef. Make
 * sure that you don’t include the #.
 * loop:  Play the video again when it reaches the end. Defaults to 0.
 * player_id: A unique id for the player that will be passed back with all
 * Javascript API responses.
 * portrait: Show the user’s portrait on the video. Defaults to 1.
 * title: Show the title on the video. Defaults to 1.
 */
  .constant('playerBaseURI', 'https://player.vimeo.com/video/')


/**
 * Configure vimeo URL as a trusted host to provide content.
 */
  .config(function ($sceDelegateProvider, playerBaseURI) {
    $sceDelegateProvider.resourceUrlWhitelist([playerBaseURI + '**']);
  })


/**
 * A service layer that listens to the communication between the vimeo
 * player and your application. The service uses the postMessage method
 * that safely enables cross-origin communication. For more information
 * look into the MDN Documentation:
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage}
 */
  .factory('playerService', function ($window) {
    return {}
  })


/**
 * The directive to inject a vimeo player in your application.
 */
  .directive('vimeoPlayer', function (playerService, playerBaseURI) {
    return {
      restrict: 'E',
      scope: {
        autoPause: '@?',
        autoPlay: '@?',
        showBadge: '@?',
        showByline: '@?',
        color: '@?',
        height: '@',
        isPlaying: '=',
        isReady: '=',
        loop: '@?',
        playerId: '@?',
        videoId: '@',
        showPortrait: '@?',
        showTitle: '@?',
        width: '@'
      },
      template: '<iframe src="{{embedUri}}" width="{{width}}" ' +
      'height="{{height}}" frameborder="0" webkitallowfullscreen ' +
      'mozallowfullscreen allowfullscreen></iframe>',
      compile: function () {
        return {
          pre: function (scope) {
            // Generate Vimeo video embed Uri
            scope.embedUri = playerBaseURI + scope.videoId;
          }
        }
      },
      link: function (scope, element) {

        // Clean up your directive. when it is removed.
        element.on('$destroy', function () {

        });
      }
    };
  });
