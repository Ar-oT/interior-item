export type Product = {
  id: string;
  name: string;
  price: number;
  material: string;
  description: string;
  image: string;
  imageAlt: string;
};

export const products: Product[] = [
  {
    id: "vase",
    name: "백자 곡선 화병",
    price: 48000,
    material: "백자",
    description:
      "손으로 빚은 부드러운 곡선. 한 송이만 꽂아도 창가 분위기가 바뀝니다.",
    image:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "창가에 놓인 흰 세라믹 화병",
  },
  {
    id: "lamp",
    name: "린넨 갓 테이블 램프",
    price: 89000,
    material: "린넨 · 오크",
    description:
      "내추럴 린넨 갓이 빛을 고르게 퍼뜨려, 저녁 책상 위를 따뜻하게 감쌉니다.",
    image:
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "따뜻한 빛이 퍼지는 테이블 램프",
  },
  {
    id: "candle",
    name: "편백 소이 캔들",
    price: 32000,
    material: "소이왁스 · 편백",
    description:
      "은은한 편백 향이 30시간 동안 이어집니다. 뚜껑을 덮으면 오브제로도 씁니다.",
    image:
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "도자기 용기에 담긴 향초",
  },
  {
    id: "cushion",
    name: "와플 니트 쿠션",
    price: 39000,
    material: "면 니트",
    description:
      "도톰한 와플 조직이 손끝에 닿는 온기를 남깁니다. 소파에 하나만 올려도 충분합니다.",
    image:
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "소파 위에 놓인 니트 쿠션",
  },
  {
    id: "tray",
    name: "오크 서빙 트레이",
    price: 54000,
    material: "오크",
    description:
      "결이 살아있는 오크 트레이. 티타임과 디스플레이를 한 번에 해결합니다.",
    image:
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "나무결이 드러난 오크 트레이",
  },
];

export function formatPrice(price: number) {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(price);
}
