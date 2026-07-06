# IMDb Custom Links

A small Chrome extension that adds your own custom external links to IMDb title pages (e.g. `imdb.com/title/tt0111161/`). Links are generated from URL templates you define, using placeholders filled in from the page you're viewing.

## Install (unpacked / developer mode)

1. Unzip this folder somewhere permanent (don't delete it after installing — Chrome loads the extension from this location).
2. Open `chrome://extensions` in Chrome.
3. Turn on **Developer mode** (top-right toggle).
4. Click **Load unpacked** and select the `imdb-custom-links` folder.
5. The extension is now active. Visit any IMDb title page to see the panel in the bottom-right corner.

## Configure your links

1. Go to `chrome://extensions`, find "IMDb Custom Links", and click **Details** → **Extension options** (or right-click the toolbar icon if pinned, and choose **Options**).
2. Add a row for each link you want:
   - **Link label** — the text shown on the button, e.g. "Watch on MySite"
   - **URL template** — the destination URL, with placeholders:
     - `{imdb_id}` → e.g. `tt0111161`
     - `{title}` → the movie/show title
     - `{year}` → release year
     - `{url}` → the current IMDb page's full URL
3. Click **Save**.
4. Reload any open IMDb tab (or visit a new one) to see your links.

### Example templates

```
https://example.com/movie/{imdb_id}
https://www.google.com/search?q={title}+{year}
https://myapp.io/lookup?imdb={imdb_id}&source={url}
```

## Notes

- Links open in a new tab.
- The panel can be dismissed per-page with the ✕ in its corner (it reappears on the next page load).
- If IMDb changes its page layout, title/year detection may need small tweaks in `content.js`, but ID detection (from the URL) is very stable.
