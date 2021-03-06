const loadToNumber = (load) => {
  switch (load) {
    case 'low':
      return 1;

    case 'medium':
      return 2;

    case 'high':
      return 3;

    default:
      // A really big number since this shouldn't happen
      return 1000;
  }
};

const healthScore = (health) => health.latency + loadToNumber(health.load) * 10;

export default {
  GET_MESSAGES_USER_CACHE_USER: (state) => (id) => state.messagesUserCache[id],
  GET_USER: (state, getters) => (id) => getters.GET_USERS[id],
  GET_SOCKET_ID: (state) => state.socketId,
  GET_HOST_ID: (state) => state.hostId,
  GET_ROOM: (state) => state.room,
  GET_USERS: (state) => state.users,
  GET_MESSAGES: (state) => state.messages,

  IS_PARTY_PAUSING_ENABLED: (state, getters, rootState, rootGetters) => state.isPartyPausingEnabled
    ?? rootGetters.GET_CONFIG.default_party_pause_enabled,

  IS_AUTO_HOST_ENABLED: (state, getters, rootState, rootGetters) => state.isAutoHostEnabled
    ?? rootGetters.GET_CONFIG.default_auto_host_enabled,

  GET_HOST_USER: (state, getters) => getters.GET_USER(getters.GET_HOST_ID),
  AM_I_HOST: (state, getters) => getters.GET_HOST_ID === getters.GET_SOCKET_ID,

  GET_SERVERS_HEALTH: (state) => state.serversHealth,

  GET_SERVER_HEALTH: (state) => (url) => state.serversHealth?.[url],

  GET_SERVER_HEALTH_SCORES: (state, getters) => (getters.GET_SERVERS_HEALTH
    ? Object.fromEntries(Object.entries(getters.GET_SERVERS_HEALTH).map(([url, health]) => [
      url,
      healthScore(health),
    ]))
    : null),

  GET_BEST_SERVER: (state, getters) => (getters.GET_SERVER_HEALTH_SCORES
    ? Object.entries(getters.GET_SERVER_HEALTH_SCORES)
      .reduce((prev, curr) => (curr[1] < prev[1] ? curr : prev))[0]
    : null),

  GET_DISPLAY_USERNAME: (state, getters, rootState, rootGetters) => rootGetters[
    'settings/GET_ALTUSERNAME']
    || rootGetters['plex/GET_PLEX_USER'].username
    || rootGetters['plex/GET_PLEX_USER'].title,

  GET_SERVER: (state) => state.server,

  GET_SYNC_CANCEL_TOKEN: (state) => state.syncCancelToken,

  IS_IN_ROOM: (state) => state.isInRoom,

  // Note: the host should really always have a playback rate of 1
  // eslint-disable-next-line no-nested-ternary
  GET_ADJUSTED_HOST_TIME: (state, getters) => () => (getters.GET_HOST_USER
    ? getters.GET_HOST_USER.state === 'playing'
      ? getters.GET_HOST_USER.time + (Date.now()
          - getters.GET_HOST_USER.updatedAt) * getters.GET_HOST_USER.playbackRate
      : getters.GET_HOST_USER.time
    : null),

  GET_UPNEXT_TIMEOUT_ID: (state) => state.upnextTimeoutId,

  GET_UP_NEXT_TRIGGERED: (state) => state.upNextTriggered,

  ARE_NOTIFICATIONS_ENABLED: (state, getters, rootState, rootGetters) => state
    .areNotificationsEnabled
    ?? rootGetters.GET_CONFIG?.default_are_notification_enabled,

  ARE_SOUND_NOTIFICATIONS_ENABLED: (state, getters, rootState, rootGetters) => state
    .areSoundNotificationsEnabled
    ?? rootGetters.GET_CONFIG?.default_are_sound_notification_enabled,
};
