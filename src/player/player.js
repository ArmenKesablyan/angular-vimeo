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
 * Use to test the origin of a message received.
 */
  .constant('originExpression', /^https?:\/\/player.vimeo.com/)

/**
 * The player parameters enumerator
 * -----------------------------------------------------------------------------
 * autopause: Enables or disables pausing this video when another video is
 * played. Defaults to 1.
 * autoplay: Play the video automatically on load. Defaults to 0. Note that
 * this won't work on some devices.
 * badge: Enables or disables the badge on the video. Defaults to 1.
 * byline: Show the user's byline on the video. Defaults to 1.
 * color: Specify the color of the video controls. Defaults to 00adef. Make
 * sure that you don't include the #.
 * loop:  Play the video again when it reaches the end. Defaults to 0.
 * player_id: A unique id for the player that will be passed back with all
 * Javascript API responses.
 * portrait: Show the user's portrait on the video. Defaults to 1.
 * title: Show the title on the video. Defaults to 1.
 */
  .constant('PLAYER_PARAMS', {
    API: 'api',
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
 * The player events returned enumerator.
 * -----------------------------------------------------------------------------
 * READY: Fired automatically when the player is ready to accept commands.
 * LOAD_PROGRESS: Fired as the video is loading. Includes the percent loaded
 *    and the duration of the video. This also includes bytes loaded and bytes
 *    total in the Flash player.
 * PLAY_PROGRESS: Fired as the video is playing. Includes seconds, percentage
 *    played, and the total duration.
 * PLAY: Fired when the video begins to play.
 * PAUSE: Fired when the video pauses.
 * FINISH: Fires when the video playback reaches the end.
 * SEEK: Fired when the user seeks. Includes seconds and percentage.
 */
  .constant('PLAYER_EVENTS', {
    READY: 'ready',
    LOAD_PROGRESS: 'loadProgress',
    PLAY_PROGRESS: 'playProgress',
    PLAY: 'play',
    PAUSE: 'pause',
    FINISH: 'finish',
    SEEK: 'seek'
  })


/**
 * This constant is used to generate an Id for a player when non is passed.
 */
  .constant('generateIdPrefix', 'VimeoPlayer')


/**
 * Configure vimeo URL as a trusted host to provide content.
 */
  .config(function ($sceDelegateProvider, playerBaseURI) {
    $sceDelegateProvider.resourceUrlWhitelist(['self', playerBaseURI + '**']);
  })


/**
 * A service layer that listens to the communication between the vimeo
 * player and your application. The service uses the postMessage method
 * that safely enables cross-origin communication. For more information
 * look into the MDN Documentation:
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage}
 */
  .factory('playerService', function ($window, originExpression,
                                      PLAYER_EVENTS, generateIdPrefix) {

    /**
     * The collection of players registered to the service.
     * @type {Object}
     */
    var players = {};

    /**
     * The number of players registered players.
     * @type {number}
     */
    var playerRegisterCount = 0;

    /**
     * Generates a unique player Id to communicate with.
     * @returns {string}
     */
    var generatePlayerId = function () {
      playerRegisterCount += 1;
      // TODO: When generating an Id there is a possibility that a user might
      //    have created one and will overwrite the registered player
      return generateIdPrefix + playerRegisterCount;
    };

    /**
     * Register the vimeo player with the player service. When events come from
     * vimeo with the matching player id, specific values will update.
     * @param playerScope {Object} The scope of the player being registered.
     */
    var registerPlayer = function (playerScope) {
      // Register the Id of the current scope at hand.
      players[playerScope.playerId] = playerScope;
    };


    /**
     * Set the origination location of the communication.
     * @type {string}
     */
    var playerOrigin = '*';


    /**
     * Once the video player is ready, we assign events we listen to from the
     * vimeo video player.
     * @param contentWindow
     */
    var initializePlayer = function (contentWindow) {
      contentWindow.postMessage(angular.toJson({
        method: 'addEventListener',
        value: PLAYER_EVENTS.PLAY
      }), playerOrigin);

      contentWindow.postMessage(angular.toJson({
        method: 'addEventListener',
        value: PLAYER_EVENTS.PAUSE
      }), playerOrigin);

      contentWindow.postMessage(angular.toJson({
        method: 'addEventListener',
        value: PLAYER_EVENTS.LOAD_PROGRESS
      }), playerOrigin);

      contentWindow.postMessage(angular.toJson({
        method: 'addEventListener',
        value: PLAYER_EVENTS.PLAY_PROGRESS
      }), playerOrigin);

      contentWindow.postMessage(angular.toJson({
        method: 'addEventListener',
        value: PLAYER_EVENTS.FINISH
      }), playerOrigin);
    };

    /**
     * When the window and the content frame communicate, they will go through
     * this method.
     * @param event
     * @returns {boolean}
     */
    var messageReceived = function (event) {
      // This statement validates to see if the message is coming from Vimeo.
      if (!(originExpression).test(event.origin)) {
        return false;
      }

      if (playerOrigin === '*') {
        playerOrigin = event.origin;
      }

      var data = JSON.parse(event.data);
      var playerScope = players[data.player_id];

      switch (data.event) {
        case PLAYER_EVENTS.READY:
          initializePlayer(playerScope.contentWindow);
          playerScope.isReady = true;
          break;
        case PLAYER_EVENTS.PLAY:
          playerScope.isPlaying = true;
          break;
        case PLAYER_EVENTS.PAUSE:
          playerScope.isPlaying = false;
          break;
        case PLAYER_EVENTS.LOAD_PROGRESS:
          playerScope.secondsLoaded = data.data.seconds;
          playerScope.secondsTotal = data.data.duration;
          break;
        case PLAYER_EVENTS.PLAY_PROGRESS:
          playerScope.seconds = data.data.seconds;
          break;
        case PLAYER_EVENTS.FINISH:
          playerScope.isFinished = true;
          break;
      }

      playerScope.$apply();

    };

    angular.element($window).on('message', messageReceived);

    /**
     * Public methods of the service.
     */
    return {
      generatePlayerId: generatePlayerId,
      registerPlayer: registerPlayer
    }

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
        color: '@?',
        height: '@',
        isFinished: '=',
        isPlaying: '=',
        isReady: '=',
        loop: '@?',
        playerId: '@?',
        videoId: '@',
        seconds: '=',
        secondsLoaded: '=',
        secondsTotal: '=',
        showBadge: '@?',
        showByline: '@?',
        showPortrait: '@?',
        showTitle: '@?',
        width: '@'
      },
      template: '<iframe ng-src="{{embedUri}}" width="{{width}}" ' +
      'height="{{height}}" frameborder="0" webkitallowfullscreen ' +
      'mozallowfullscreen allowfullscreen></iframe>',

      link: function (scope, element) {

        var params = [];

        // Enable the API on the player.
        params.push(PLAYER_PARAMS.API + '=1');

        // Check to see if the user has set a player Id. If not set one.
        if (!angular.isDefined(scope.playerId)) {
          // The user has not created one and so we must generate an Id.
          scope.playerId = playerService.generatePlayerId();
        }
        params.push(PLAYER_PARAMS.PLAYER_ID + '=' + scope.playerId);

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

        // Check to see if the loop attribute has been set.
        if (angular.isDefined(scope.loop)) {
          params.push(PLAYER_PARAMS.LOOP + '=' + scope.loop);
        }

        // Check to see if the portrait attribute has been set.
        if (angular.isDefined(scope.showPortrait)) {
          params.push(PLAYER_PARAMS.PORTRAIT + '=' + scope.showPortrait);
        }

        // Generate Vimeo video embed Uri
        scope.embedUri = playerBaseURI + scope.videoId + '?' +
          params.join('&');

        // Set default values.
        scope.isReady = false;
        scope.isPlaying = false;
        scope.isFinished = false;
        scope.seconds = 0;
        scope.secondsLoaded = 0;
        scope.secondsTotal = 0;

        // Expose the iFrames post message capabilities.
        scope.contentWindow = element.children()[0].contentWindow;

        // After the link process we register our player.
        playerService.registerPlayer(scope);

        // Clean up your directive. when it is removed.
        element.on('$destroy', function () {

        });
      }
    };
  });
