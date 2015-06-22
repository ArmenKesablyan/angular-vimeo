/**
 * @file Angular Vimeo Player Module. Uses the Vimeo provided API to
 * set vimeo players in the application.
 * @author Armen Kesablyan  (armen@twoowl.com)
 * @version 0.0.1
 */



angular.module('ngVimeo.player', [])


/**
 * The embed player Uri. The format comes as follows
 * https://player.vimeo.com/video/VIDEO_ID?PARAMETER=VALUE. For a list of
 * parameters please check out the parameters enumerator.
 */
  .constant('playerBaseURI', 'https://player.vimeo.com/video/')

/**
 * The player parameters enumerator
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
  .constant('PLAYER_PARAMS', {
    AUTO_PAUSE: 'autopause',
    AUTO_PLAY: 'autoplay',
    BADGE: 'badge',
    BYLINE: 'byline',
    COLOR: 'color',
    LOOP: 'loop',
    PLAYER_ID: 'player_id',
    PORTRAIT: 'portrait',
    TITLE: 'title'
  })


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
  .directive('vimeoPlayer', function (playerService, playerBaseURI,
                                      PLAYER_PARAMS) {
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
            var params = [];

            // Check to see if the autopause attribute has been set.
            if (angular.isDefined(scope.autoPause)) {
              params.push(PLAYER_PARAMS.AUTO_PAUSE + '=' + scope.autoPause);
            }

            // Check to see if the autoplay attribute has been set.
            if (angular.isDefined(scope.autoPlay)) {
              params.push(PLAYER_PARAMS.AUTO_PLAY + '=' + scope.autoPlay);
            }

            // Check to see if the badge attribute has been set.
            if (angular.isDefined(scope.showBadge)) {
              params.push(PLAYER_PARAMS.BADGE + '=' + scope.showBadge);
            }

            // Check to see if the byline attribute has been set.
            if (angular.isDefined(scope.showByline)) {
              params.push(PLAYER_PARAMS.BYLINE + '=' + scope.showByline);
            }

            // Check to see if the color attribute has been set.
            if (angular.isDefined(scope.color)) {
              params.push(PLAYER_PARAMS.COLOR + '=' + scope.color);
            }

            // Check to see if the color attribute has been set.
            if (angular.isDefined(scope.color)) {
              params.push(PLAYER_PARAMS.COLOR + '=' + scope.color);
            }

            // Check to see if the loop attribute has been set.
            if (angular.isDefined(scope.loop)) {
              params.push(PLAYER_PARAMS.LOOP + '=' + scope.loop);
            }

            // Check to see if the loop attribute has been set.
            if (angular.isDefined(scope.loop)) {
              params.push(PLAYER_PARAMS.LOOP + '=' + scope.loop);
            }

            // Check to see if the portrait attribute has been set.
            if (angular.isDefined(scope.showPortrait)) {
              params.push(PLAYER_PARAMS.PORTRAIT + '=' + scope.showPortrait);
            }

            // Check to see if the title attribute has been set.
            if (angular.isDefined(scope.showTitle)) {
              params.push(PLAYER_PARAMS.PORTRAIT + '=' + scope.showTitle);
            }

            // Generate Vimeo video embed Uri
            scope.embedUri = playerBaseURI + scope.videoId + '?' +
              params.join('&');

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
