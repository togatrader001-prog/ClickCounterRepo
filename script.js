/**
 * The Gang Learns APIs — practice fetch playground
 * All endpoints below are public demo APIs (no keys in frontend).
 */

// ---------- tiny helpers ----------

function $(id) {
  return document.getElementById(id);
}

function setLoading(el, message) {
  el.className = "result loading";
  el.textContent = message || "Loading...";
}

function setError(el, message) {
  el.className = "result error";
  el.textContent = message || "Something broke. Classic.";
}

function setOk(el, html) {
  el.className = "result ok";
  el.innerHTML = html;
}

/**
 * fetch JSON with basic status checking.
 * Throws on network failure or non-OK HTTP status.
 */
async function fetchJson(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }
  return response.json();
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

// ---------- 1) Counter (local state only) ----------

let count = 0;
const counterDisplay = $("counter");
const counterStatus = $("counter-status");
const counterButton = $("counterbutton");

const counterLines = [
  "Schemes launched. HR is concerned.",
  "The implication is working.",
  "This is going in the report.",
  "Birds of war: armed.",
  "Dennis is speaking to you.",
];

counterButton.addEventListener("click", () => {
  count += 1;
  counterDisplay.textContent = count;
  counterButton.textContent = `Clicked ${count} times!`;
  const line = counterLines[(count - 1) % counterLines.length];
  counterStatus.textContent = `${line} (count=${count})`;
});

// ---------- 2) Bitcoin via Coinbase (GET JSON, no key) ----------

$("btn-btc").addEventListener("click", async () => {
  const out = $("btc-display");
  const btn = $("btn-btc");
  btn.disabled = true;
  setLoading(out, "Calling Coinbase like a tiny wolf of wall street...");

  try {
    const json = await fetchJson("https://api.coinbase.com/v2/prices/BTC-USD/spot");
    const amount = json?.data?.amount;
    const currency = json?.data?.currency || "USD";

    if (!amount) {
      setError(out, "API returned JSON but no price. Rude.");
      return;
    }

    setOk(
      out,
      `<strong>BTC</strong> spot: <strong>$${escapeHtml(amount)}</strong> ${escapeHtml(currency)}
       <p class="meta">Nested path used: <code>data.amount</code></p>
       <p class="meta">You're still not rich. But the fetch worked.</p>`
    );
  } catch (err) {
    console.error(err);
    setError(out, `Failed to load BTC price: ${err.message}`);
  } finally {
    btn.disabled = false;
  }
});

// ---------- 3) Open Library search (query params + arrays) ----------

$("btn-book").addEventListener("click", async () => {
  const out = $("book-display");
  const btn = $("btn-book");
  const q = $("book-query").value.trim() || "coding";
  btn.disabled = true;
  setLoading(out, `Searching Open Library for "${q}"...`);

  try {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=5`;
    const json = await fetchJson(url);
    const docs = json?.docs || [];

    if (!docs.length) {
      setError(out, "Zero books. Even the library gave up on you.");
      return;
    }

    const items = docs
      .map((doc, i) => {
        const title = escapeHtml(doc.title || "Untitled");
        const author = escapeHtml((doc.author_name && doc.author_name[0]) || "Unknown author");
        const year = doc.first_publish_year ? ` (${doc.first_publish_year})` : "";
        return `<li><strong>${i + 1}. ${title}</strong> — ${author}${year}</li>`;
      })
      .join("");

    setOk(
      out,
      `<p>Found <strong>${json.numFound ?? docs.length}</strong> hits. Top 5:</p>
       <ol>${items}</ol>
       <p class="meta">You used <code>encodeURIComponent</code> + an array in JSON. Fancy.</p>`
    );
  } catch (err) {
    console.error(err);
    setError(out, `Book search failed: ${err.message}`);
  } finally {
    btn.disabled = false;
  }
});

// ---------- 4) nekos.best (image URL from JSON) ----------

$("btn-neko").addEventListener("click", async () => {
  const out = $("neko-display");
  const btn = $("btn-neko");
  btn.disabled = true;
  setLoading(out, "Summoning anime via HTTPS...");

  try {
    const json = await fetchJson("https://nekos.best/api/v2/neko");
    const hit = json?.results?.[0];
    const imageUrl = hit?.url;
    const artist = hit?.artist_name || "unknown artist";
    const source = hit?.source_url || "";

    if (!imageUrl) {
      setError(out, "No image URL in response. The neko escaped.");
      return;
    }

    setOk(
      out,
      `<div class="media-wrap">
         <p>Artist: <strong>${escapeHtml(artist)}</strong></p>
         <img src="${escapeHtml(imageUrl)}" alt="random neko from nekos.best" />
         ${source ? `<p class="meta"><a href="${escapeHtml(source)}" target="_blank" rel="noopener">source</a></p>` : ""}
       </div>`
    );
  } catch (err) {
    console.error(err);
    setError(out, `Neko API failed: ${err.message}`);
  } finally {
    btn.disabled = false;
  }
});

// ---------- 5) Official Joke API ----------

$("btn-joke").addEventListener("click", async () => {
  const out = $("joke-display");
  const btn = $("btn-joke");
  btn.disabled = true;
  setLoading(out, "Writing a joke on a napkin...");

  try {
    const json = await fetchJson("https://official-joke-api.appspot.com/random_joke");
    const setup = json?.setup;
    const punchline = json?.punchline;

    if (!setup || !punchline) {
      setError(out, "Joke API returned an empty soul.");
      return;
    }

    setOk(
      out,
      `<p><strong>${escapeHtml(setup)}</strong></p>
       <p>${escapeHtml(punchline)}</p>
       <p class="meta">type: ${escapeHtml(json.type || "n/a")} · id: ${escapeHtml(json.id ?? "?")}</p>`
    );
  } catch (err) {
    console.error(err);
    setError(out, `Joke failed: ${err.message}`);
  } finally {
    btn.disabled = false;
  }
});

// ---------- 6) Dog CEO ----------

$("btn-dog").addEventListener("click", async () => {
  const out = $("dog-display");
  const btn = $("btn-dog");
  btn.disabled = true;
  setLoading(out, "Releasing hounds...");

  try {
    const json = await fetchJson("https://dog.ceo/api/breeds/image/random");
    if (json?.status !== "success" || !json?.message) {
      setError(out, "Dog API did not success. Bad dog.");
      return;
    }

    setOk(
      out,
      `<div class="media-wrap">
         <p>Good boy protocol: <strong>engaged</strong></p>
         <img src="${escapeHtml(json.message)}" alt="random dog" />
       </div>`
    );
  } catch (err) {
    console.error(err);
    setError(out, `Dog API failed: ${err.message}`);
  } finally {
    btn.disabled = false;
  }
});

// ---------- 7) Advice Slip (nested JSON) ----------

$("btn-advice").addEventListener("click", async () => {
  const out = $("advice-display");
  const btn = $("btn-advice");
  btn.disabled = true;
  setLoading(out, "Consulting the slip...");

  try {
    // cache-bust because this API likes returning cached responses in browsers
    const json = await fetchJson(`https://api.adviceslip.com/advice?t=${Date.now()}`);
    const advice = json?.slip?.advice;
    const id = json?.slip?.id;

    if (!advice) {
      setError(out, "No advice. You're on your own, champ.");
      return;
    }

    setOk(
      out,
      `<p>"${escapeHtml(advice)}"</p>
       <p class="meta">slip id: ${escapeHtml(id ?? "?")} · path: <code>slip.advice</code></p>`
    );
  } catch (err) {
    console.error(err);
    setError(out, `Advice API failed: ${err.message}`);
  } finally {
    btn.disabled = false;
  }
});

// ---------- 8) Agify (user input → query param) ----------

$("btn-age").addEventListener("click", async () => {
  const out = $("age-display");
  const btn = $("btn-age");
  const name = $("age-name").value.trim();

  if (!name) {
    setError(out, "Enter a name first. The internet can't roast a blank string.");
    return;
  }

  btn.disabled = true;
  setLoading(out, `Asking the internet how old "${name}" is...`);

  try {
    const url = `https://api.agify.io?name=${encodeURIComponent(name)}`;
    const json = await fetchJson(url);

    if (json.age == null) {
      setError(out, `No age guess for "${escapeHtml(name)}". Too mysterious.`);
      return;
    }

    setOk(
      out,
      `<p>Name: <strong>${escapeHtml(json.name || name)}</strong></p>
       <p>Guessed age: <strong>${escapeHtml(json.age)}</strong></p>
       <p class="meta">samples used: ${escapeHtml(json.count ?? "?")}</p>
       <p class="meta">This is statistics, not destiny. Still funny though.</p>`
    );
  } catch (err) {
    console.error(err);
    setError(out, `Agify failed: ${err.message}`);
  } finally {
    btn.disabled = false;
  }
});

// ---------- 9) PokéAPI (path params + richer JSON) ----------

$("btn-poke").addEventListener("click", async () => {
  const out = $("poke-display");
  const btn = $("btn-poke");
  const raw = $("poke-name").value.trim().toLowerCase() || "ditto";
  // path param: only allow simple slug characters
  const name = raw.replaceAll(" ", "-").replaceAll(/[^a-z0-9-]/g, "");

  btn.disabled = true;
  setLoading(out, `Looking up ${name}...`);

  try {
    const json = await fetchJson(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(name)}`);
    const sprite =
      json?.sprites?.front_default ||
      json?.sprites?.other?.["official-artwork"]?.front_default ||
      "";
    const types = (json.types || []).map((t) => t.type.name).join(", ") || "???";
    const id = json.id;
    const pokeName = json.name;

    setOk(
      out,
      `<div class="poke-wrap">
         <p><strong>#${escapeHtml(id)}</strong> ${escapeHtml(pokeName)}</p>
         <p class="meta">types: ${escapeHtml(types)} · height: ${escapeHtml(json.height)} · weight: ${escapeHtml(json.weight)}</p>
         ${sprite ? `<img src="${escapeHtml(sprite)}" alt="${escapeHtml(pokeName)} sprite" />` : "<p>No sprite. Ghost type energy.</p>"}
       </div>`
    );
  } catch (err) {
    console.error(err);
    setError(
      out,
      `Could not find "${escapeHtml(name)}". Try "pikachu" or "snorlax". (${err.message})`
    );
  } finally {
    btn.disabled = false;
  }
});

// ---------- 10) Cat fact ----------

$("btn-cat").addEventListener("click", async () => {
  const out = $("cat-display");
  const btn = $("btn-cat");
  btn.disabled = true;
  setLoading(out, "Downloading cat knowledge...");

  try {
    const json = await fetchJson("https://catfact.ninja/fact");
    if (!json?.fact) {
      setError(out, "No fact. The cat knocked it off the table.");
      return;
    }

    setOk(
      out,
      `<p>${escapeHtml(json.fact)}</p>
       <p class="meta">length field: ${escapeHtml(json.length ?? "?")} chars</p>`
    );
  } catch (err) {
    console.error(err);
    setError(out, `Cat fact failed: ${err.message}`);
  } finally {
    btn.disabled = false;
  }
});
