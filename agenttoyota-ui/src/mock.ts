import type { LoanRec, LeaseRec } from "./types";

// 3 × Loan suggestions (Wikipedia/Commons image URLs)
export const MOCK_LOANS: LoanRec[] = [
  {
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/2025%20Toyota%20Camry%20LE%20Las%20Vegas%202025.jpg",
    vehicleName: "2025 Toyota Camry Hybrid",
    carValue: 32950,
    interestRate: 3.4,
    monthlyEmi: 489,
  },
  {
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/19%20Toyota%20RAV4%20XLE%20Premium.jpg",
    vehicleName: "2025 Toyota RAV4",
    carValue: 29950,
    interestRate: 3.9,
    monthlyEmi: 512,
  },
  {
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Toyota%20Corolla%20Sedan%20(E210)%20Washington%20DC%20Metro%20Area,%20USA%20(3).jpg",
    vehicleName: "2024 Toyota Corolla",
    carValue: 22000,
    interestRate: 4.2,
    monthlyEmi: 399,
  },
];

// 3 × Lease suggestions
export const MOCK_LEASES: LeaseRec[] = [
  {
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/9/94/2024_Toyota_Prius_Excel_PHEV_-_1987cc_2.0_%28225PS%29_Plug-in_Hybrid_-_Silver_Metallic_-_10-2024%2C_Front_Quarter.jpg",
    vehicleName: "2024 Toyota Prius",
    carValue: 27950,
    monthlyRent: 329,
  },
  {
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Toyota%20Tacoma%20TRD%20Off%20Road%20(N400)%20IMG%209735.jpg",
    vehicleName: "2025 Toyota Tacoma",
    carValue: 37200,
    monthlyRent: 429,
  },
  {
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Toyota%20Highlander%20(XU70)%20Washington%20DC%20Metro%20Area,%20USA.jpg",
    vehicleName: "2025 Toyota Highlander",
    carValue: 39600,
    monthlyRent: 469,
  },
];