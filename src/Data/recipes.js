const recipes = [
  {
    id: 1,
    title: "Nasi Goreng Spesial",
    image: "/src/assets/nasigoreng.jpeg",
    rating: 4.5,
    author: "Luna",
    popular: true,
    description: "Nasi goreng khas rumahan dengan bumbu spesial dan telur mata sapi.",
    ingredients: [
      "400 gram nasi putih",
      "2 butir telur",
      "3 siung bawang merah, cincang",
      "2 siung bawang putih, geprek",
      "Kecap manis secukupnya",
      "Garam dan kaldu bubuk"
    ],
    steps: [
      "Tumis bawang merah dan putih hingga harum.",
      "Masukkan telur, buat orak-arik.",
      "Masukkan nasi putih, aduk rata dengan api besar.",
      "Tambahkan kecap manis, garam, dan kaldu. Aduk hingga bumbu meresap.",
      "Sajikan selagi hangat."
    ]
  },
  {
    id: 2,
    title: "Dessert Coklat",
    image: "/src/assets/dessertcoklat.jpeg",
    rating: 4.1,
    author: "Renz",
    popular: false,
    description: "Pencuci mulut manis dengan tekstur lembut dan coklat lumer.",
    ingredients: [
      "200 gram dark chocolate",
      "100 ml susu cair",
      "2 sdm margarin",
      "Biskuit sebagai dasar"
    ],
    steps: [
      "Hancurkan biskuit dan letakkan di dasar wadah.",
      "Lelehkan coklat dengan cara ditim bersama margarin dan susu.",
      "Tuang lelehan coklat ke atas biskuit.",
      "Dinginkan di kulkas selama 2 jam."
    ]
  },
  {
    id: 3,
    title: "Mie Goreng Pedas",
    image: "/src/assets/miegoreng.jpeg",
    rating: 4.7,
    author: "Kevin",
    popular: true,
    description: "Mie goreng dengan level pedas maksimal untuk pecinta cabai.",
    ingredients: [
      "1 bungkus mie telur",
      "10 buah cabai rawit (sesuai selera)",
      "Sawi hijau secukupnya",
      "Kecap pedas"
    ],
    steps: [
      "Rebus mie hingga matang, lalu tiriskan.",
      "Haluskan cabai dan tumis bersama bumbu lainnya.",
      "Masukkan mie dan sawi, aduk hingga layu.",
      "Tambahkan kecap pedas, sajikan."
    ]
  }
];

export default recipes;