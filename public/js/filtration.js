function parseQueryString(queryString) {
  const params = {};
  const pairs = queryString.slice(1).split("&");
  for (const pair of pairs) {
    const [key, value] = pair.split("=");
    params[key] = decodeURIComponent(value);
  }
  return params;
}

function convertObjectToUrlParams(paramsObj, typeExcluded) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(paramsObj)) {
    if (key === typeExcluded) continue;
    params.append(key, value);
  }

  return params.toString();
}

// Sort filteration
const sortRadios = document.querySelectorAll('input[name="sort"]');

sortRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    let urlParams = parseQueryString(window.location.search);
    urlParams = convertObjectToUrlParams(urlParams, (typeExcluded = "sort"));
    if (urlParams === "=undefined")
      window.location.href = `?sort=${radio.value}`;
    else window.location.href = `?${urlParams}&sort=${radio.value}`;
  });
});

// Condition filteration
const conditionRadios = document.querySelectorAll('input[name="condition"]');
conditionRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    let urlParams = parseQueryString(window.location.search);
    urlParams = convertObjectToUrlParams(
      urlParams,
      (typeExcluded = "condition")
    );
    if (urlParams === "=undefined")
      window.location.href = `?condition=${radio.value}`;
    else window.location.href = `?${urlParams}&condition=${radio.value}`;
  });
});

// Location filteration
const citySelect = document.getElementById("city");
citySelect.addEventListener("change", () => {
  let urlParams = parseQueryString(window.location.search);
  urlParams = convertObjectToUrlParams(urlParams, (typeExcluded = "city"));
  console.log("urlParams: ", urlParams);
  if (urlParams === "=undefined")
    window.location.href = `?city=${citySelect.value}`;
  else window.location.href = `?${urlParams}&city=${citySelect.value}`;
});

// Category filteration
const categorySelect = document.getElementById("category");
categorySelect.addEventListener("change", () => {
  let urlParams = parseQueryString(window.location.search);
  urlParams = convertObjectToUrlParams(urlParams, (typeExcluded = "category"));
  console.log("urlParams: ", urlParams);
  if (urlParams === "=undefined")
    window.location.href = `?category=${categorySelect.value}`;
  else window.location.href = `?${urlParams}&category=${categorySelect.value}`;
});
