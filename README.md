# Noto Legal Site

Small static site for GitHub Pages to host:

- `privacy.html`
- `support.html`
- `child-safety.html`
- `delete-account.html`
- `friends/join/index.html`
- `invite/index.html`

## Invite handoff pages

This site now includes a browser handoff page for Noto friend invites.

Use links like:

- `https://YOUR_DOMAIN/friends/join/?invite=TOKEN&inviteId=INVITE_ID`
- `https://YOUR_DOMAIN/invite/?invite=TOKEN&inviteId=INVITE_ID`

What it does:

1. Opens as a normal `https` link in Messages, Chrome, Safari, and other apps.
2. Tries to hand off into `noto://friends/join?...`, with a fallback retry for browsers that prefer the empty-host form.
3. Shows retry/copy actions if the browser blocks or delays the app launch.

This is enough for a browser-based deep-link handoff without a backend.

## For full Universal Links / App Links later

If you want the operating system to open Noto directly from the `https` URL
without stopping on the website first, you will still need to add domain
association files:

- `/.well-known/assetlinks.json` for Android App Links
- `/apple-app-site-association` or `/.well-known/apple-app-site-association` for iOS Universal Links

## Before publishing

Replace all placeholder values:

- any contact or company details you want to show publicly
- the domain used in shared invite links
- the app store destination links if you want install fallbacks beyond Google Play

## Publish with GitHub Pages

1. Create a new GitHub repo, for example `noto-legal-site`.
2. Push these files to the default branch.
3. In GitHub repo settings, open `Pages`.
4. Set source to `Deploy from a branch`.
5. Choose your default branch and `/ (root)`.
6. Save and wait for the site URL.

## Suggested app URLs

After Pages is live, use:

- Privacy policy: `https://YOUR_USERNAME.github.io/YOUR_REPO/privacy.html`
- Support: `https://YOUR_USERNAME.github.io/YOUR_REPO/support.html`
- Child safety standards: `https://YOUR_USERNAME.github.io/YOUR_REPO/child-safety.html`
- Account deletion: `https://YOUR_USERNAME.github.io/YOUR_REPO/delete-account.html`
- Invite handoff: `https://YOUR_USERNAME.github.io/YOUR_REPO/friends/join/?invite=TOKEN&inviteId=INVITE_ID`
# Noto-legal
