(function () {
  const mobileUserAgentPattern = /Android|iPhone|iPad|iPod/i;
  const page = document.body;

  if (!page) {
    return;
  }

  const currentUrl = new URL(window.location.href);
  const inviteToken = (currentUrl.searchParams.get('invite') || '').trim();
  const inviteId = (currentUrl.searchParams.get('inviteId') || '').trim();
  const isMobile = mobileUserAgentPattern.test(window.navigator.userAgent || '');
  const primaryDeepLink = buildDeepLink(inviteToken, inviteId, false);
  const alternateDeepLink = buildDeepLink(inviteToken, inviteId, true);

  const titleNode = document.getElementById('invite-title');
  const subtitleNode = document.getElementById('invite-subtitle');
  const statusNode = document.getElementById('invite-status');
  const detailsNode = document.getElementById('invite-details');
  const openButton = document.getElementById('open-app-button');
  const copyLinkButton = document.getElementById('copy-link-button');
  const copyAppLinkButton = document.getElementById('copy-app-link-button');

  let openTimer = null;
  let alreadyAttempted = false;

  if (titleNode) {
    titleNode.textContent = inviteToken
      ? 'Open this invite in Noto'
      : 'Invite link is incomplete';
  }

  if (subtitleNode) {
    subtitleNode.textContent = inviteToken
      ? 'We will try to open Noto automatically. If nothing happens, tap the button below.'
      : 'This link is missing the invite token Noto needs to accept the invitation.';
  }

  if (detailsNode) {
    detailsNode.textContent = inviteToken
      ? inviteId
        ? 'Invite ready. The app will open to the friend join screen.'
        : 'Invite ready. The app will open to the friend join screen with the shared token.'
      : 'Ask your friend to send the full Noto invite link again.';
  }

  if (openButton) {
    openButton.setAttribute('href', primaryDeepLink);
    openButton.addEventListener('click', function (event) {
      if (!inviteToken) {
        event.preventDefault();
        return;
      }

      setStatus('Opening Noto...', 'info');
    });

    if (!inviteToken) {
      openButton.setAttribute('aria-disabled', 'true');
      openButton.classList.add('button-disabled');
    }
  }

  if (copyLinkButton) {
    copyLinkButton.addEventListener('click', function () {
      copyText(currentUrl.toString(), 'Invite link copied.');
    });
  }

  if (copyAppLinkButton) {
    copyAppLinkButton.addEventListener('click', function () {
      copyText(primaryDeepLink, 'App link copied.');
    });
  }

  if (!inviteToken) {
    setStatus('This page cannot open Noto until it has a valid invite token.', 'error');
    return;
  }

  if (!isMobile) {
    setStatus('Open this link on your phone to jump into the Noto app.', 'info');
    return;
  }

  setStatus('Trying to open Noto...', 'info');
  window.setTimeout(function () {
    attemptOpen(false);
  }, 320);

  function buildDeepLink(token, id, forceEmptyHost) {
    const query = new URLSearchParams();
    if (id) {
      query.set('inviteId', id);
    }
    if (token) {
      query.set('invite', token);
    }
    const queryString = query.toString();
    const basePath = forceEmptyHost ? 'noto:///friends/join' : 'noto://friends/join';
    return queryString ? basePath + '?' + queryString : basePath;
  }

  function attemptOpen(force) {
    if (alreadyAttempted && !force) {
      return;
    }

    alreadyAttempted = true;
    cleanupAttemptListeners();

    let handoffDetected = false;
    const completeHandoff = function () {
      handoffDetected = true;
      cleanupAttemptListeners();
      setStatus('If Noto opened, you can return here any time to try the link again.', 'success');
    };

    const onVisibilityChange = function () {
      if (document.visibilityState === 'hidden') {
        completeHandoff();
      }
    };

    const onPageHide = function () {
      completeHandoff();
    };

    const onBlur = function () {
      completeHandoff();
    };

    document.addEventListener('visibilitychange', onVisibilityChange, { once: true });
    window.addEventListener('pagehide', onPageHide, { once: true });
    window.addEventListener('blur', onBlur, { once: true });

    openTimer = window.setTimeout(function () {
      if (!handoffDetected) {
        cleanupAttemptListeners();
        setStatus(
          'Noto did not open automatically. Tap "Open in Noto" again, or install the app and retry this invite.',
          'warn'
        );
      }
    }, 1500);

    openDeepLink(primaryDeepLink);

    if (!force) {
      window.setTimeout(function () {
        if (!handoffDetected && document.visibilityState !== 'hidden') {
          openDeepLink(alternateDeepLink);
        }
      }, 360);
    }

    function cleanupAttemptListeners() {
      if (openTimer !== null) {
        window.clearTimeout(openTimer);
        openTimer = null;
      }
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('pagehide', onPageHide);
      window.removeEventListener('blur', onBlur);
    }
  }

  function openDeepLink(url) {
    window.location.href = url;
  }

  function copyText(text, successMessage) {
    if (!navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') {
      setStatus('Copy is not available in this browser. You can still use the Open in Noto button.', 'warn');
      return;
    }

    navigator.clipboard.writeText(text).then(
      function () {
        setStatus(successMessage, 'success');
      },
      function () {
        setStatus('Copy failed. Please try again.', 'error');
      }
    );
  }

  function setStatus(message, tone) {
    if (!statusNode) {
      return;
    }

    statusNode.textContent = message;
    statusNode.dataset.tone = tone;
  }
})();
