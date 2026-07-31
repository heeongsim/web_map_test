const places = [
  {
    name: "국립공주대학교",
    category: "대학교",
    emoji: "🎓",
    description: "배움과 성장의 중심, 나의 alma mater가 있는 곳",
    address: "충청남도 공주시 공주대학로 56 (신관동 182)",
    lat: 36.4683,
    lng: 127.1402,
  },
  {
    name: "공산성",
    category: "관광·역사",
    emoji: "🏯",
    description: "백제의 역사가 살아 숨 쉬는 공주의 상징적인 성곽",
    address: "충청남도 공주시 산성동 2번지",
    lat: 36.4631,
    lng: 127.1264,
  },
  {
    name: "제민천",
    category: "자연·산책",
    emoji: "🌊",
    description: "도심을 가로지르는 생태하천, 산책하기 좋은 힐링 공간",
    address: "충청남도 공주시 무령로 201 (교동)",
    lat: 36.4610,
    lng: 127.1214,
  },
  {
    name: "매향",
    category: "맛집",
    emoji: "🍜",
    description: "100% 메밀면 막국수와 평양냉면으로 유명한 공주 명소",
    address: "충청남도 공주시 백미고을길 18 (금성동)",
    lat: 36.4638,
    lng: 127.1290,
  },
  {
    name: "시장정육식당",
    category: "맛집",
    emoji: "🥩",
    description: "공주 특산 알밤이 들어간 육회비빔밥으로 유명한 50년 전통 식당",
    address: "충청남도 공주시 백미고을길 10-5 (금성동)",
    lat: 36.4635,
    lng: 127.1285,
  },
  {
    name: "신관짬뽕",
    category: "맛집",
    emoji: "🍲",
    description: "공주 5대 짬뽕, 진하고 깊은 고기짬뽕의 맛을 즐기는 곳",
    address: "충청남도 공주시 전막2길 32-7 (신관동)",
    lat: 36.4668,
    lng: 127.1132,
  },
];

const map = L.map("map", {
  scrollWheelZoom: true,
}).setView([36.464, 127.125], 14);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  maxZoom: 19,
}).addTo(map);

const markers = [];
const placeListEl = document.getElementById("place-list");

function createEmojiIcon(emoji) {
  return L.divIcon({
    className: "emoji-marker",
    html: `<span>${emoji}</span>`,
    iconSize: [42, 42],
    iconAnchor: [21, 42],
    popupAnchor: [0, -38],
  });
}

function createPopupContent(place) {
  return `
    <div class="popup-content">
      <div class="popup-header">
        <span class="popup-emoji">${place.emoji}</span>
        <span class="popup-title">${place.name}</span>
      </div>
      <span class="popup-category">${place.category}</span>
      <p class="popup-desc">${place.description}</p>
      <p class="popup-address">📍 ${place.address}</p>
    </div>
  `;
}

places.forEach((place, index) => {
  const marker = L.marker([place.lat, place.lng], {
    icon: createEmojiIcon(place.emoji),
  })
    .addTo(map)
    .bindPopup(createPopupContent(place), {
      maxWidth: 280,
      className: "custom-popup",
    });

  markers.push(marker);

  const listItem = document.createElement("li");
  listItem.className = "place-item";
  listItem.dataset.index = index;
  listItem.innerHTML = `
    <span class="place-emoji">${place.emoji}</span>
    <div class="place-info">
      <span class="place-category">${place.category}</span>
      <h3>${place.name}</h3>
      <p class="place-summary">${place.description}</p>
    </div>
  `;

  listItem.addEventListener("click", () => {
    map.setView([place.lat, place.lng], 16, { animate: true });
    marker.openPopup();
    setActiveItem(index);
  });

  placeListEl.appendChild(listItem);
});

function setActiveItem(activeIndex) {
  document.querySelectorAll(".place-item").forEach((item, index) => {
    item.classList.toggle("active", index === activeIndex);
  });
}

markers.forEach((marker, index) => {
  marker.on("popupopen", () => setActiveItem(index));
  marker.on("popupclose", () => setActiveItem(-1));
});

const bounds = L.latLngBounds(places.map((p) => [p.lat, p.lng]));
map.fitBounds(bounds, { padding: [50, 50] });
