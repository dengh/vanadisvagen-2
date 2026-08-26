(() => {
  const passwordHash = "c76cd54038260c9c142e65a4dc1c34a2d8f1993805f4ad9154521f887ce246d5";
  const storageKey = "vanadisvagen-2-access";

  const hashText = async (value) => {
    const data = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  };

  const unlock = () => {
    localStorage.setItem(storageKey, passwordHash);
    document.documentElement.classList.remove("locked");
    document.getElementById("password-gate")?.remove();
  };

  const showGate = () => {
    const gate = document.createElement("div");
    gate.id = "password-gate";
    gate.innerHTML = `
      <div class="gate-box">
        <h1>Vanadisvägen 2</h1>
        <p>Skriv lösenordet för att öppna sidan.</p>
        <form class="gate-form">
          <label for="gate-password">Lösenord</label>
          <input id="gate-password" name="password" type="password" autocomplete="current-password" autofocus>
          <button type="submit">Öppna</button>
          <div class="gate-error" role="status" aria-live="polite"></div>
        </form>
      </div>
    `;
    document.body.append(gate);

    const form = gate.querySelector("form");
    const input = gate.querySelector("input");
    const error = gate.querySelector(".gate-error");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const enteredHash = await hashText(input.value);
      if (enteredHash === passwordHash) {
        unlock();
        return;
      }
      error.textContent = "Fel lösenord.";
      input.select();
    });

    input.focus();
  };

  const boot = async () => {
    if (localStorage.getItem(storageKey) === passwordHash) {
      unlock();
      return;
    }
    showGate();
  };

  boot();
})();
