import { PestModel } from '../models/Pest';
import { IPest } from '../types';
import { isDbConnected } from '../config/db';
import { buildIdQuery } from '../utils/dbHelper';

const samplePests: IPest[] = [
  {
    id: 'pest-1',
    cropName: 'Cotton & Soybean',
    pestName: 'Whitefly',
    scientificName: 'Bemisia tabaci',
    identification: [
      'Tiny 1-2mm moth-like insects with pure white powdery wings',
      'Clusters found on lower surface of young leaves',
      'Nymphs are scale-like, translucent greenish-yellow',
    ],
    symptoms: [
      'Chlorotic spots on leaves due to sap sucking',
      'Sticky honeydew secretion promoting black sooty mold',
      'Transmission of Cotton Leaf Curl & Yellow Mosaic viruses',
    ],
    management: [
      'Install yellow sticky traps @ 20 traps/acre',
      'Spray Diafenthiuron 50% WP @ 1.2 g/L during threshold exceedance',
      'Spray Pyriproxyfen 10% + Clothianidin 10% EC @ 1 ml/L',
    ],
    organicControl: [
      '5% Neem Seed Kernel Extract (NSKE) spray',
      'Beauveria bassiana or Verticillium lecanii @ 5 g/L',
      'Conserve natural predators like ladybird beetles and Chrysoperla',
    ],
    riskLevel: 'HIGH',
    seasonalPeak: 'July - October',
    imageUrl: 'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=600',
  },
  {
    id: 'pest-2',
    cropName: 'Maize & Sugarcane',
    pestName: 'Fall Armyworm',
    scientificName: 'Spodoptera frugiperda',
    identification: [
      'Inverted Y-shape mark on head capsule of mature caterpillar',
      'Four dark spots arranged in square on 8th abdominal segment',
      'Extensive ragged shot-holes in whorl leaves with sawdust-like frass',
    ],
    symptoms: [
      'Destruction of leaf whorls leading to skeletonized foliage',
      'Damaged central growing point (dead-heart symptom)',
      'Boring into developing maize cobs',
    ],
    management: [
      'Pheromone traps @ 5 traps/acre for adult monitoring',
      'Apply Emamectin Benzoate 5% SG @ 0.4 g/L into whorls',
      'Chlorantraniliprole 18.5% SC @ 0.4 ml/L',
    ],
    organicControl: [
      'Bacillus thuringiensis (Bt) kurstaki formulation @ 2 g/L',
      'Intercropping with Cowpea or Desmodium (push-pull strategy)',
      'Egg parasitoid release: Trichogramma pretiosum',
    ],
    riskLevel: 'CRITICAL',
    seasonalPeak: 'Kharif & Rabi whorl stages',
    imageUrl: 'https://images.unsplash.com/photo-1546842931-886c185b4c8c?w=600',
  },
  {
    id: 'pest-3',
    cropName: 'Mustard & Vegetables',
    pestName: 'Aphids (Mahun)',
    scientificName: 'Lipaphis erysimi',
    identification: [
      'Small, soft-bodied yellowish-green or grey pear-shaped insects',
      'Dense colonies on tender shoots, inflorescence, and siliquae',
    ],
    symptoms: [
      'Leaf curling, crinkling and stunted plant vigor',
      'Poor seed setting and shriveled grain formation',
      'Excess honeydew coating siliquae',
    ],
    management: [
      'Spray Dimethoate 30% EC @ 1.5 ml/L of water',
      'Spray Imidacloprid 17.8% SL @ 0.5 ml/L in late afternoon',
    ],
    organicControl: [
      'Spray 2% soap solution (10g washing soap in 1L water)',
      'Neem oil 3000 PPM @ 5 ml/L',
      'Early sowing in 1st fortnight of October to escape aphid build-up',
    ],
    riskLevel: 'MEDIUM',
    seasonalPeak: 'December - February',
    imageUrl: 'https://images.unsplash.com/photo-1582281298055-e25b84a30b0b?w=600',
  },
];

let inMemoryPests = [...samplePests];

export class PestService {
  public static async getAllPests(cropName?: string) {
    if (!isDbConnected()) {
      if (cropName) {
        return inMemoryPests.filter((p) => p.cropName.toLowerCase().includes(cropName.toLowerCase()));
      }
      return inMemoryPests;
    }

    const query = cropName ? { cropName: new RegExp(cropName, 'i') } : {};
    return PestModel.find(query).sort({ cropName: 1 });
  }

  public static async getPestById(id: string) {
    if (!isDbConnected()) {
      const p = inMemoryPests.find((item) => item.id === id || (item as any)._id === id);
      return p || inMemoryPests[0];
    }

    const query = buildIdQuery(id);
    const pest = await PestModel.findOne(query);
    return pest || inMemoryPests[0];
  }

  public static async createPest(data: IPest) {
    if (!isDbConnected()) {
      const created: IPest = { ...data, id: `pest-${Date.now()}` };
      inMemoryPests.push(created);
      return created;
    }
    return PestModel.create(data);
  }
}
