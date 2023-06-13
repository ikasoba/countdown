function kirisute(num, len = 2) {
  return Math.floor(num * 10 ** len) / 10 ** len;
}

function getDiff(endDate) {
  const now = Date.now();

  if (now >= endDate) {
    return null;
  } else {
    return endDate - now;
  }
}

function getHumanReadable(time) {
  if (time >= 1000 * 60 * 60) {
    return `${kirisute(time / 1000 / 60 / 60, 0)}時間`;
  } else if (time >= 1000 * 60) {
    return `${kirisute(time / 1000 / 60, 2)}分`;
  } else if (time >= 1000) {
    return `${kirisute(time / 1000, 3)}秒`;
  }
}

function createIframe(url) {
  const e = document.createElement("iframe");
  e.src = url;
  e.frameBorder = "0";
  e.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  e.allowFullscreen = true;
  e.id = "frame";

  return e;
}

function createCounter(endDate, message) {
  const e = document.createElement("div");
  e.id = "counter";

  const setTextSize = () => {
    e.style.fontSize = `${100 / ((e.innerText.length + e.innerText.match(/[一-龠]+|[ぁ-ゔ]+|[ァ-ヴー]+|[ａ-ｚＡ-Ｚ０-９]+|[々〆〤ヶ]+/ug)?.length ?? 0))}vw`
  }

  const draw = () => {
    const diff = getDiff(endDate);
    if (diff == null) {
      e.innerText = message ?? "終了！";
      setTextSize();
    } else {
      e.innerText = `あと${getHumanReadable(diff)}`;
      setTextSize();

      setTimeout(draw, 16);
    }
  }

  draw();

  return e;
}

function createGenerator() {
  const e = (name, attrs, ...children) => {
    /** @type {Element} */
    const e = document.createElement(name);

    for (const k in attrs) {
      e.setAttribute(k, attrs[k]);
    }

    e.append(...children);

    return e;
  };

  return e("form", { method: "GET" },
    e("label", {},
      "フレームURL:",
      e("input", { type: "text", name: "u" })
    ),
    e("br", {}),
    e("label", {},
      "カウントダウンの終了時刻:",
      e("input", { type: "datetime-local", name: "ct" })
    ),
    e("br", {}),
    e("label", {},
      "カウントダウンの終了後のメッセージ:",
      e("input", { type: "text", name: "cm" })
    ),
    e("br", {}),
    e("input", { type: "submit" })
  );
}

const params = new URLSearchParams(location.search);
const iframeUrl = params.get("u");
const counterEndDate = params.get("ct") && new Date(params.get("ct")).getTime();
const counterMessage = params.get("cm");

window.addEventListener("load", () => {
  if (counterEndDate) {
    document.body.append(createCounter(counterEndDate, counterMessage || ""));
  }

  if (iframeUrl) {
    document.body.append(createIframe(iframeUrl));
  } else {
    document.body.style.backgroundColor = "#000";
  }

  if (!counterEndDate && !iframeUrl) {
    document.body.style.backgroundColor = "#fff";
    document.body.append(createGenerator());
  }
})