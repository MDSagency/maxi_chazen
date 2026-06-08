export type ShippingRates = {
  home: number;
  desk: number;
};

export const defaultShippingTable: Record<string, ShippingRates> = {
  Alger: { home: 600, desk: 550 },
  Blida: { home: 700, desk: 650 },
  Boumerdes: { home: 700, desk: 650 },
  Tipaza: { home: 700, desk: 650 },
  Chlef: { home: 900, desk: 850 },
  "Oum El Bouaghi": { home: 900, desk: 850 },
  Batna: { home: 900, desk: 850 },
  Bejaia: { home: 900, desk: 850 },
  Bouira: { home: 900, desk: 850 },
  Tlemcen: { home: 900, desk: 850 },
  Tiaret: { home: 900, desk: 850 },
  "Tizi Ouzou": { home: 900, desk: 850 },
  Jijel: { home: 900, desk: 850 },
  Setif: { home: 900, desk: 850 },
  Saida: { home: 900, desk: 850 },
  Skikda: { home: 900, desk: 850 },
  "Sidi Bel Abbes": { home: 900, desk: 850 },
  Annaba: { home: 900, desk: 850 },
  Guelma: { home: 900, desk: 850 },
  Constantine: { home: 900, desk: 850 },
  Medea: { home: 900, desk: 850 },
  Mostaganem: { home: 900, desk: 850 },
  "M'Sila": { home: 900, desk: 850 },
  Mascara: { home: 900, desk: 850 },
  Oran: { home: 900, desk: 850 },
  "Bordj Bou Arreridj": { home: 900, desk: 850 },
  "El Tarf": { home: 900, desk: 850 },
  Tissemsilt: { home: 900, desk: 850 },
  Khenchela: { home: 900, desk: 850 },
  "Souk Ahras": { home: 900, desk: 850 },
  Mila: { home: 900, desk: 850 },
  "Ain Defla": { home: 900, desk: 850 },
  "Ain Temouchent": { home: 900, desk: 850 },
  Relizane: { home: 900, desk: 850 },
  Laghouat: { home: 1050, desk: 1000 },
  Biskra: { home: 1050, desk: 1000 },
  Tebessa: { home: 1050, desk: 1000 },
  Djelfa: { home: 1050, desk: 1000 },
  Ouargla: { home: 1050, desk: 1000 },
  "El Oued": { home: 1050, desk: 1000 },
  Ghardaia: { home: 1050, desk: 1000 },
  Adrar: { home: 1850, desk: 1750 },
  Bechar: { home: 1850, desk: 1750 },
  "El Bayadh": { home: 1850, desk: 1750 },
  Naama: { home: 1850, desk: 1750 },
  Tamanrasset: { home: 1850, desk: 1750 },
  Illizi: { home: 1850, desk: 1750 },
  Tindouf: { home: 1850, desk: 1750 },
};

export function getShippingCost(
  wilaya: string,
  deliveryMethod: string,
): number {
  const rates = defaultShippingTable[wilaya];
  if (!rates) return 0;
  return deliveryMethod === "Livraison à domicile" ? rates.home : rates.desk;
}
